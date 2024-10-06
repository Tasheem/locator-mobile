import { View, StyleSheet, ScrollView, TextInput, ActivityIndicator } from 'react-native';
import { BRAND_RED } from '../constants/colors';
import { useContext, useEffect, useRef, useState } from 'react';
import { ChatMessage } from '../models/room';
import { chatObservable, disconnectChat, emitChats, establishChatConnection, getChatMessages, sendChatMessage } from '../services/room-service';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RoomDetailsParamList } from './RoomDetailsScreen';
import { getCalendars } from 'expo-localization';
import Chat from '../components/Chat';
import { ScreenContext, UserContext } from '../utils/context';

type Props = {
    navigation: NativeStackNavigationProp<RoomDetailsParamList, 'Chat', undefined>
    route: RouteProp<RoomDetailsParamList, 'Chat'>
}

export default function ChatScreen({ route }: Props) {
    const { widthRatio } = useContext(ScreenContext);
    const scrollViewRef = useRef<ScrollView>(null);
    const [user, setUser] = useContext(UserContext);

    const room = route.params.room;
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [userMessage, setUserMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [timezone, setTimezone] = useState<string>('UTC');
    
    useEffect(() => {
        setIsLoading(true);
        getChatMessages(room.id)
        .then(response => response.json())
        .then((chats: ChatMessage[]) => {
            emitChats(chats);
        })
        .finally(() => {
            setIsLoading(false);
        });

        establishChatConnection(room.id);
        const chatSubscription = chatObservable().subscribe((chats) => {
            setMessages(chats);
        });

        const calendars = getCalendars();
        const firstCalendar = calendars[0];
        setTimezone(firstCalendar.timeZone ? firstCalendar.timeZone : 'UTC');

        return () => {
            chatSubscription.unsubscribe();
            disconnectChat();
        }
    }, []);

    const renderedElements = messages.map((item) => {
        return (
            <Chat key={item.id} chatMessage={item} user={user} timezone={timezone} />
        );
    });

    return (
        <View style={style.rootContainer}>
            <ActivityIndicator 
                animating={isLoading}
                color={BRAND_RED}
                size={widthRatio > 1.5 ? 'large' : 'small'}
            />
            <ScrollView
                ref={scrollViewRef}
                onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({
                    animated: true
                })}
            >
                { renderedElements }
            </ScrollView>
            <View style={style.messageWriterContainer}>
                <TextInput
                    placeholder='Enter Message'
                    style={style.messageWriter}
                    onChangeText={(text) => {
                        setUserMessage(text)
                    }}
                    onSubmitEditing={(e) => {
                        const message = e.nativeEvent.text;
                        sendChatMessage(message, room.id)
                        .then((res) => {
                            if(res.status !== 201) {
                                // TODO: Do some error handling. Notify the user.
                            }
                        })
                        .catch(err => {
                            console.log(err);
                        })
                        .finally(() => {
                            setUserMessage('');
                        });
                    }}
                    value={userMessage}
                />
            </View>
        </View>
    )
}

const style = StyleSheet.create({
    rootContainer: {
        flex: 1,
        marginTop: 10,
        paddingLeft: 10,
        paddingRight: 10
    },
    container: {
        padding: 10
    },
    messageWriterContainer: {
        height: 100,
        alignItems: 'center',
        justifyContent: 'center'
    },
    messageWriter: {
        borderWidth: 2,
        borderColor: BRAND_RED,
        borderRadius: 20,
        paddingLeft: 10,
        height: 40,
        width: '90%'
    }
});

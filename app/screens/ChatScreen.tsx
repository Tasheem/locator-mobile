import { View, StyleSheet, ScrollView, TextInput, ActivityIndicator, Keyboard, ViewStyle, Platform, Alert } from 'react-native';
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
    const [movableInputStyle, setMovableInputStyle] = useState<ViewStyle>({
        paddingTop: 20,
        paddingBottom: 20,
        alignItems: 'center',
        justifyContent: 'center',
    });

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

        if(Platform.OS === 'ios') {
            Keyboard.addListener('keyboardWillShow', (keyboardEvent) => {
                const startCoordinates = keyboardEvent.startCoordinates;
                const endCoordinates = keyboardEvent.endCoordinates;
                const keyboardHeight = keyboardEvent.endCoordinates.height;
                
                console.log('Start coordinates:', startCoordinates);
                console.log('End coordinates:', endCoordinates);
    
                setMovableInputStyle({
                    height: keyboardHeight,
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    paddingTop: 20
                });
            });

            Keyboard.addListener('keyboardWillHide', (keyboardEvent) => {
                setMovableInputStyle({
                    paddingTop: 20,
                    paddingBottom: 20,
                    alignItems: 'center',
                    justifyContent: 'center'
                });
            });
        }

        return () => {
            chatSubscription.unsubscribe();
            disconnectChat();
        }
    }, []);

    const style = StyleSheet.create({
        rootContainer: {
            flex: 1,
            paddingLeft: 10,
            paddingRight: 10
        },
        scrollViewContainer: {
            flex: 1
        },
        messageWriterContainer: movableInputStyle,
        messageWriter: {
            borderWidth: 2,
            borderColor: BRAND_RED,
            borderRadius: 20,
            paddingLeft: 10,
            height: 40,
            width: '90%'
        }
    });

    const renderedElements = messages.map((item) => {
        return (
            <Chat
                key={item.id}
                chatMessage={item}
                user={user}
                timezone={timezone}
                onLongPress={() => {
                    if(item.source.id === user?.id) {
                        return;
                    }

                    Alert.prompt('Report a chat', 'Provide the reason for reporting this chat message and press the report button to submit the report.', [
                        {
                            'text': 'Cancel',
                            'style': 'default'
                        },
                        {
                            'text': 'Report',
                            'style': 'destructive'
                        }
                    ]);
                }}
            />
        );
    });

    return (
        <View style={style.rootContainer}>
            {
                isLoading ? (
                    <ActivityIndicator 
                        animating={isLoading}
                        color={BRAND_RED}
                        size={widthRatio > 1.5 ? 'large' : 'small'}
                        style={{
                            marginTop: 20
                        }}
                    />
                ) : null
            }
            <View
                style={style.scrollViewContainer}
            >
                <ScrollView
                    ref={scrollViewRef}
                    onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({
                        animated: true
                    })}
                >
                    { renderedElements }
                </ScrollView>
            </View>
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
                    autoCapitalize='none'
                />
            </View>
        </View>
    )
}

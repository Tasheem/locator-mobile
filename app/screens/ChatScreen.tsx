import { View, StyleSheet, ScrollView, TextInput, ActivityIndicator, Keyboard, ViewStyle, Platform, Alert, Modal, SafeAreaView, TouchableOpacity } from 'react-native';
import { BRAND_RED } from '../constants/colors';
import { useContext, useEffect, useRef, useState } from 'react';
import { ChatMessage } from '../models/room';
import { chatObservable, disconnectChat, emitChats, establishChatConnection, getChatMessages, reportChat, sendChatMessage } from '../services/room-service';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RoomDetailsParamList } from './RoomDetailsScreen';
import { getCalendars } from 'expo-localization';
import Chat from '../components/Chat';
import { BlockedContext, ScreenContext, UserContext } from '../utils/context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Confirmation from '../components/Confirmation';

type Props = {
    navigation: NativeStackNavigationProp<RoomDetailsParamList, 'Chat', undefined>
    route: RouteProp<RoomDetailsParamList, 'Chat'>
}

export default function ChatScreen({ route }: Props) {
    const { widthRatio } = useContext(ScreenContext);
    const scrollViewRef = useRef<ScrollView>(null);
    const [user, setUser] = useContext(UserContext);
    const [blockedUsers, setBlockedUsers] = useContext(BlockedContext);

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
    const [reportChatModalVisible, setReportChatModalVisible] = useState(false);
    const [reportChatTarget, setReportChatTarget] = useState<ChatMessage | null>(null);

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
        },
        backArrowContainer: {
            flexDirection: 'row',
            marginLeft: 10,
            marginTop: 10
        }
    });

    const renderedElements = messages.map((item) => {
        if(blockedUsers.has(item.source.id)) {
            return null;
        }

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

                    setReportChatTarget(item);
                    setReportChatModalVisible(true);
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

            <Modal
                animationType='fade'
                visible={reportChatModalVisible}
                onRequestClose={() => {
                    setReportChatTarget(null);
                    setReportChatModalVisible(false);
                }}
            >
                <SafeAreaView>
                    <TouchableOpacity
                        style={style.backArrowContainer}
                        onPress={() => {
                            setReportChatTarget(null);
                            setReportChatModalVisible(false);
                        }}
                    >
                        <Ionicons
                            name='arrow-back-circle'
                            color={BRAND_RED}
                            size={30}
                        />
                    </TouchableOpacity>

                    <Confirmation
                        title='Report Chat'
                        prompt={
                            `Are you sure you want to report this chat sent by ${reportChatTarget?.source.username}?`
                        }
                        inputPlaceholder='Reason'
                        submitText='Report'
                        submitHandler={async (reason?: string) => {
                            if(!reportChatTarget) {
                                return;
                            }

                            if(!reason) {
                                Alert.alert('Error', 'A reason must be provided for reporting a chat.',
                                    [
                                        {
                                            text: 'OK'
                                        }
                                    ]
                                );
                                return;
                            }

                            try {
                                const response = await reportChat({
                                    chat: reportChatTarget,
                                    reason: reason
                                });

                                if(response.ok) {
                                    Alert.alert('Success', 'Thank you for reporting chats you find inappropriate. This report will be reviewed and further action may be taken.',
                                        [
                                            {
                                                text: 'OK',
                                                onPress: () => {
                                                    setReportChatModalVisible(false);
                                                }
                                            }
                                        ]
                                    );
                                } else {
                                    Alert.alert('Error', 'An error has occurred while reporting this chat. Please try again later.',
                                        [
                                            {
                                                text: 'OK'
                                            }
                                        ]
                                    );
                                }
                            } catch(err) {
                                Alert.alert('Error', 'An error has occurred while reporting this chat. Please try again later.',
                                    [
                                        {
                                            text: 'OK'
                                        }
                                    ]
                                );
                            }
                        }}
                        elementInFocus={reportChatTarget ? (
                            <Chat
                                chatMessage={reportChatTarget}
                                user={user}
                                timezone={timezone}
                            />
                        ) : undefined}
                    />
                </SafeAreaView>
            </Modal>
        </View>
    );
}

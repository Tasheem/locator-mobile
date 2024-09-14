import { View, Text, StyleSheet, Image, FlatList, ScrollView, TextInput, ActivityIndicator } from "react-native";
import { CARD_RED_PRIMARY_COLOR, CARD_RED_SECONDARY_COLOR, CARD_PRIMARY_COLOR, CARD_SECONDARY_COLOR, BRAND_RED } from "../constants/colors";
import { useContext, useEffect, useState } from "react";
import { Chat } from "../models/room";
import { chatObservable, disconnectChat, emitChats, establishChatConnection, getChatMessages, sendChatMessage } from "../services/room-service";
import { RootStackParamList } from "../../App";
import { NativeStackNavigationProp, NativeStackScreenProps } from "@react-navigation/native-stack";
import { RouteProp } from "@react-navigation/native";
import { RoomDetailsParamList } from "./RoomDetailsScreen";
import moment from "moment";

type Props = {
    navigation: NativeStackNavigationProp<RoomDetailsParamList, "Chat", undefined>
    route: RouteProp<RoomDetailsParamList, "Chat">
}

export default function ChatScreen({ route }: Props) {
    const room = route.params.room;
    const user = route.params.user;
    const [messages, setMessages] = useState<Chat[]>([]);
    const [userMessage, setUserMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    
    useEffect(() => {
        setIsLoading(true);
        getChatMessages(room.id)
        .then(response => response.json())
        .then((chats: Chat[]) => {
            emitChats(chats);
        })
        .finally(() => {
            setIsLoading(false);
        });

        establishChatConnection(room.id);
        const chatSubscription = chatObservable().subscribe((chats) => {
            setMessages(chats);
        });

        return () => {
            chatSubscription.unsubscribe();
            disconnectChat();
        }
    }, []);

    const renderedElements = messages.map((item) => {
        return (
            <View key={item.id} style={item.source.id === user?.id ? [style.messageContainer, style.redMessageContainer] : style.messageContainer}>
                <View style={item.source.id === user?.id ? [style.imageContainer, style.redImageContainer] : style.imageContainer}>
                    <Image source={require("../assets/no-profile-pic.png")}
                    style={{
                        width: 50,
                        height: 50,
                        borderRadius: 40,
                        borderColor: "black",
                        borderWidth: 2
                    }} />
                </View>
                <View style={style.textContainer}>
                    <View style={item.source.id === user?.id ? [style.messageDetailsContainer, style.redDetailsContainer] : style.messageDetailsContainer}>
                        <View style={style.nameContainer}>
                            <Text style={item.source.id === user?.id ? [style.text, style.whiteText] : style.text}>
                                { item.source.username }
                            </Text>
                        </View>
                        <View style={style.dateContainer}>
                            <Text style={item.source.id === user?.id ? [style.text, style.whiteText] : style.text}>
                                { moment(item.createDate).format("MMM Do YYYY").toString() }
                            </Text>
                            <Text style={item.source.id === user?.id ? [style.text, style.whiteText] : style.text}>
                                { moment(item.createDate).format("h:mm:ss a").toString() }
                            </Text>
                        </View>
                    </View>
                    <View style={style.messageContentsContainer}>
                        <Text style={item.source.id === user?.id ? [style.text, style.whiteText] : style.text}>
                            { item.message }
                        </Text>
                    </View>
                </View>
            </View>
        );
    });

    return (
        <View style={style.rootContainer}>
            <ActivityIndicator 
                animating={isLoading}
                color={BRAND_RED}
            />
            <ScrollView>
                { renderedElements }
            </ScrollView>
            <View style={style.messageWriterContainer}>
                <TextInput
                    placeholder="Enter Message"
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
                            setUserMessage("");
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
    messageContainer: {
        flexDirection: "row",
        borderColor: CARD_SECONDARY_COLOR,
        borderWidth: 2,
        borderStyle: "solid",
        borderRadius: 18,
        backgroundColor: CARD_PRIMARY_COLOR,
        marginBottom: 10,
    },
    redMessageContainer: {
        borderColor: CARD_RED_SECONDARY_COLOR,
        backgroundColor: CARD_RED_PRIMARY_COLOR
    },
    imageContainer: {
        borderRightColor: CARD_SECONDARY_COLOR,
        borderRightWidth: 2,
        justifyContent: "center",
        paddingLeft: 5,
        paddingRight: 5,
    },
    redImageContainer: {
        borderRightColor: CARD_RED_SECONDARY_COLOR
    },
    textContainer: {
        flex: 1,
        flexGrow: 1
    },
    text: {
        color: "black",
        lineHeight: 18
    },
    whiteText: {
        color: "white"
    },
    messageDetailsContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        borderBottomColor: CARD_SECONDARY_COLOR,
        borderBottomWidth: 2,
        paddingLeft: 5,
        paddingRight: 5,
        flexWrap: "wrap",
        flex: 1
    },
    nameContainer: {
        flex: 1
    },
    dateContainer: {
        flex: 1,
        alignItems: "flex-end"
    },
    redDetailsContainer: {
        borderBottomColor: CARD_RED_SECONDARY_COLOR
    },
    messageContentsContainer: {
        paddingLeft: 5,
        paddingRight: 5
    },
    messageWriterContainer: {
        height: 100,
        alignItems: "center",
        justifyContent: "center"
    },
    messageWriter: {
        borderWidth: 2,
        borderColor: BRAND_RED,
        borderRadius: 20,
        paddingLeft: 10,
        height: 40,
        width: "90%"
    }
});

import AsyncStorage from "@react-native-async-storage/async-storage";
import { Client } from "@stomp/stompjs";
import { Chat } from "../models/room";
import { Subject } from "rxjs";
import { sendRequest } from "../utils/requestUtil";

const serverPrefix = "http://localhost:8080/room";
const socketUrl = 'ws://localhost:8080/chat';

const chatSubject = new Subject<Chat>();
const chatObservable = () => {
    return chatSubject.asObservable();
}

const stompClient: {
    client?: Client
} = {}

const createRoom = async (roomName: string) => {
    const token = await AsyncStorage.getItem("bearerToken");

    const options = {
        method: "POST",
        body: JSON.stringify({
            "name": roomName
        }),
        headers: {
            "Authorization": token ? token : "",
            "Content-Type": "application/json"
        }
    };

    return sendRequest(serverPrefix, options);
}

const getRoomsForUser = async () => {
    return sendRequest(serverPrefix);
}

const getChatMessages = async (roomId: number) => {
    return sendRequest(`${serverPrefix}/id/${roomId}/chat`);
}

const sendChatMessage = async (message: string, roomId: number) => {
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "message": message
        })
    } as RequestInit;
    
    return sendRequest(`${serverPrefix}/id/${roomId}/chat`, options);
}

const establishChatConnection = (roomId: number) => {
    AsyncStorage.getItem("bearerToken")
    .then(token => {
        stompClient.client = new Client({
            brokerURL: socketUrl,
            connectHeaders: {
                "Authorization": token ? token : ""
            },
            forceBinaryWSFrames: true,
            appendMissingNULLonIncoming: true,
            logRawCommunication: true
        });

        stompClient.client.onConnect = (frame) => {
            stompClient.client?.subscribe("/topic/room/" + roomId, (message) => {
                const chatMessage = JSON.parse(message.body) as Chat;
                console.log(chatMessage);
                
                chatSubject.next(chatMessage);
            });
        };
        
        stompClient.client.activate();
    });
}

const disconnectChat = () => {
    // console.log("Deactivating Chat...");
    stompClient.client?.deactivate();
}

export { createRoom, establishChatConnection, disconnectChat, chatObservable, getChatMessages, getRoomsForUser, sendChatMessage }
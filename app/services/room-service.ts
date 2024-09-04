import AsyncStorage from "@react-native-async-storage/async-storage";
import { Client } from "@stomp/stompjs";
import { Chat } from "../models/room";
import { Subject } from "rxjs";

const serverPrefix = "http://localhost:8080/room";
const socketUrl = 'ws://localhost:8080/chat';

const chatSubject = new Subject<Chat>();
const chatObservable = () => {
    return chatSubject.asObservable();
}

const stompClient = new Client({
    brokerURL: socketUrl
});

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

    return fetch(serverPrefix, options);
}

const getChatMessages = async (roomId: number) => {
    const token = await AsyncStorage.getItem("bearerToken");

    const options = {
        headers: {
            "Authorization": token ? token : ""
        }
    }

    return fetch(`${serverPrefix}/id/${roomId}/chat`, options);
}

const establishChatConnection = (roomId: number) => {
    stompClient.activate();

    stompClient.onConnect = (frame) => {
        console.log("Connected:", frame);
    
        stompClient.subscribe("/topic/room/" + roomId, (message) => {
            const chatMessage = JSON.parse(message.body) as Chat;
            console.log(chatMessage);

            chatSubject.next(chatMessage);
        });
    };
}

const disconnectChat = () => {
    stompClient.deactivate();
}

export { createRoom, establishChatConnection, disconnectChat, chatObservable, getChatMessages }
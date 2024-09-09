import AsyncStorage from "@react-native-async-storage/async-storage";
import { Client } from "@stomp/stompjs";
import { Chat } from "../models/room";
import { Subject } from "rxjs";
import { sendRequest } from "../utils/requestUtil";
import { User } from "../models/user";

const serverPrefix = "http://localhost:8080/room";
const socketUrl = 'ws://localhost:8080/chat';

const chatSubject = new Subject<Chat>();
const chatObservable = () => {
    return chatSubject.asObservable();
}

const participantsSubject = new Subject<User>();
const participantsObservable = () => {
    return participantsSubject.asObservable();
}

const stompClient: {
    chatClient?: Client,
    participantsClient?: Client
} = {}

const createRoom = async (roomName: string) => {
    const options = {
        method: "POST",
        body: JSON.stringify({
            "name": roomName
        }),
        headers: {
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

const getJoinRoomRequests = async () => {
    return sendRequest(`${serverPrefix}/join`);
}

const sendJoinRoomResponse = async (joinRequestId: number, accepted: boolean) => {
    const options = {
        method: "PATCH"
    } as RequestInit;

    return sendRequest(`${serverPrefix}/join/id/${joinRequestId}/accepted/${accepted}`, options);
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
        stompClient.chatClient = new Client({
            brokerURL: socketUrl,
            connectHeaders: {
                "Authorization": token ? token : ""
            },
            forceBinaryWSFrames: true,
            appendMissingNULLonIncoming: true,
            logRawCommunication: true
        });

        stompClient.chatClient.onConnect = (frame) => {
            stompClient.chatClient?.subscribe("/topic/room/" + roomId, (message) => {
                const chatMessage = JSON.parse(message.body) as Chat;
                console.log(chatMessage);
                
                chatSubject.next(chatMessage);
            });
        };
        
        stompClient.chatClient.activate();
    });
}

const disconnectChat = () => {
    // console.log("Deactivating Chat...");
    stompClient.chatClient?.deactivate();
}

const establishParticipantsConnection = (roomId: number) => {
    AsyncStorage.getItem("bearerToken")
    .then(token => {
        stompClient.participantsClient = new Client({
            brokerURL: socketUrl,
            connectHeaders: {
                "Authorization": token ? token : ""
            },
            forceBinaryWSFrames: true,
            appendMissingNULLonIncoming: true,
            logRawCommunication: true
        });

        stompClient.participantsClient.onConnect = (frame) => {
            stompClient.participantsClient?.subscribe(`/topic/room/${roomId}/members`, (message) => {
                const newMember = JSON.parse(message.body) as User;
                console.log(newMember);
                
                participantsSubject.next(newMember);
            });
        };
        
        stompClient.participantsClient.activate();
    });
}

const disconnectParticipantsSocket = () => {
    stompClient.participantsClient?.deactivate();
}

export { 
    createRoom, 
    establishChatConnection, 
    disconnectChat, 
    chatObservable, 
    getChatMessages, 
    getJoinRoomRequests, 
    getRoomsForUser, 
    sendChatMessage,
    sendJoinRoomResponse,
    establishParticipantsConnection,
    participantsObservable,
    disconnectParticipantsSocket
}
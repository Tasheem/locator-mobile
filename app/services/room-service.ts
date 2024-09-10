import AsyncStorage from "@react-native-async-storage/async-storage";
import { Client } from "@stomp/stompjs";
import { Chat, JoinRoom, Room } from "../models/room";
import { BehaviorSubject, Subject } from "rxjs";
import { sendRequest } from "../utils/requestUtil";
import { User } from "../models/user";

type StompClientHolder = {
    chatClient?: Client
    participantsClient?: Client
    roomsClient?: Client
    notificationsClient?: Client
}

const serverPrefix = "http://localhost:8080/room";
const socketUrl = 'ws://localhost:8080/chat';

let chats = [] as Chat[];
let participants = [] as User[];
let rooms = [] as Room[];
let joinRequests = [] as JoinRoom[];

const chatSubject = new BehaviorSubject<Chat[]>(chats);
const chatObservable = () => {
    return chatSubject.asObservable();
}

const participantsSubject = new BehaviorSubject<User[]>(participants);
const participantsObservable = () => {
    return participantsSubject.asObservable();
}

const acceptedRoomSubject = new BehaviorSubject<Room[]>(rooms);
const acceptedRoomObservable = () => {
    return acceptedRoomSubject.asObservable();
}

const notificationSubject = new BehaviorSubject<JoinRoom[]>(joinRequests);
const notificationObservable = () => {
    return notificationSubject.asObservable();
}

const emitChats = (updatedChats: Chat[]) => {
    chats = updatedChats;
    chatSubject.next(chats);
}

const emitParticipants = (updatedParticipants: User[]) => {
    participants = updatedParticipants;
    participantsSubject.next(participants);
}

const emitRooms = (updatedRooms: Room[]) => {
    rooms = updatedRooms;
    acceptedRoomSubject.next(rooms);
}

const emitJoinRequests = (requests: JoinRoom[]) => {
    joinRequests = requests;
    notificationSubject.next(joinRequests);
}

const clientHolder: StompClientHolder = {}

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

const sendJoinRoomRequest = async (roomId: number, targetUserId: number) => {
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "targetRoomId": roomId,
            "targetUserId": targetUserId
        })
    } as RequestInit;

    return sendRequest(`${serverPrefix}/join`, options);
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
        clientHolder.chatClient = new Client({
            brokerURL: socketUrl,
            connectHeaders: {
                "Authorization": token ? token : ""
            },
            forceBinaryWSFrames: true,
            appendMissingNULLonIncoming: true,
            logRawCommunication: true
        });

        clientHolder.chatClient.onConnect = (frame) => {
            clientHolder.chatClient?.subscribe("/topic/room/" + roomId, (message) => {
                const chatMessage = JSON.parse(message.body) as Chat;
                chats = [...chats, chatMessage];
                
                chatSubject.next(chats);
            });
        };
        
        clientHolder.chatClient.activate();
    });
}

const disconnectChat = () => {
    // console.log("Deactivating Chat...");
    clientHolder.chatClient?.deactivate();
}

const establishParticipantsConnection = (roomId: number) => {
    AsyncStorage.getItem("bearerToken")
    .then(token => {
        clientHolder.participantsClient = new Client({
            brokerURL: socketUrl,
            connectHeaders: {
                "Authorization": token ? token : ""
            },
            forceBinaryWSFrames: true,
            appendMissingNULLonIncoming: true,
            logRawCommunication: true
        });

        clientHolder.participantsClient.onConnect = (frame) => {
            clientHolder.participantsClient?.subscribe(`/topic/room/${roomId}/members`, (message) => {
                const newMember = JSON.parse(message.body) as User;
                participants = [...participants, newMember];
                
                participantsSubject.next(participants);
            });
        };
        
        clientHolder.participantsClient.activate();
    });
}

const disconnectParticipantsSocket = () => {
    clientHolder.participantsClient?.deactivate();
}

const establishRoomsConnection = (userId: number) => {
    AsyncStorage.getItem("bearerToken")
    .then(token => {
        clientHolder.roomsClient = new Client({
            brokerURL: socketUrl,
            connectHeaders: {
                "Authorization": token ? token : ""
            },
            forceBinaryWSFrames: true,
            appendMissingNULLonIncoming: true,
            logRawCommunication: true
        });

        clientHolder.roomsClient.onConnect = (frame) => {
            clientHolder.roomsClient?.subscribe(`/topic/room/join/${userId}/accepted`, (message) => {
                const addedRoom = JSON.parse(message.body) as Room;
                rooms = [...rooms, addedRoom];

                acceptedRoomSubject.next(rooms);
            });
        };
        
        clientHolder.roomsClient.activate();
    });
}

const disconnectRoomsConnection = () => {
    clientHolder.roomsClient?.deactivate();
}

const establishNotificationsConnection = (userId: number) => {
    AsyncStorage.getItem("bearerToken")
    .then(token => {
        clientHolder.notificationsClient = new Client({
            brokerURL: socketUrl,
            connectHeaders: {
                "Authorization": token ? token : ""
            },
            forceBinaryWSFrames: true,
            appendMissingNULLonIncoming: true,
            logRawCommunication: true
        });

        clientHolder.notificationsClient.onConnect = (frame) => {
            clientHolder.notificationsClient?.subscribe(`/topic/room/join/${userId}`, (message) => {
                const newRequest = JSON.parse(message.body) as JoinRoom;
                joinRequests = [...joinRequests, newRequest];
                
                notificationSubject.next(joinRequests);
            });
        };
        
        clientHolder.notificationsClient.activate();
    });
}

const disconnectNotificationSocket = () => {
    clientHolder.notificationsClient?.deactivate;
}

export { 
    createRoom, 
    establishChatConnection, 
    disconnectChat, 
    chatObservable, 
    getChatMessages,
    sendJoinRoomRequest,
    getJoinRoomRequests, 
    getRoomsForUser, 
    sendChatMessage,
    sendJoinRoomResponse,
    establishParticipantsConnection,
    participantsObservable,
    disconnectParticipantsSocket,
    establishRoomsConnection,
    disconnectRoomsConnection,
    acceptedRoomObservable,
    establishNotificationsConnection,
    disconnectNotificationSocket,
    notificationObservable,
    emitChats,
    emitParticipants,
    emitRooms,
    emitJoinRequests
}
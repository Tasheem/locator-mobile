import { User } from './user'

type Room = {
    id: number
    name: string
    creator: User
    members: User[]
}

type ChatMessage = {
    id: number,
    message: string
    createDate: string
    source: User
    destination?: User
    room: Room
}

type JoinRoom = {
    id: number
    targetRoom: Room
    sourceUser: User
    targetUser: User
    createDate: string
}

export { Room, ChatMessage, JoinRoom }
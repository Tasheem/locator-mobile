import { User } from './user'

type Room = {
    id: number
    name: string
    members: User[]
}

type Chat = {
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

export { Room, Chat, JoinRoom }
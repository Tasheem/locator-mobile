import { User } from "./user"

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

export { Room, Chat }
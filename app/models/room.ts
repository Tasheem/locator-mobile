import { User } from "./user"

export type Room = {
    id: number
    name: string
    members: User[]
}
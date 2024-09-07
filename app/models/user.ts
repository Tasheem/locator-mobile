import { PlaceType } from "./places"
import { Room } from "./room"

export type User = {
    id?: number
    username: string
    password: string
    firstname: string
    lastname: string
    email: string
    preferences: PlaceType[]
    rooms?: Room[]
}
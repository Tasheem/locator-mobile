import { PlaceType } from "./lokator-place-type"
import { Room } from "./room"

export type User = {
    username: string
    password: string
    firstname: string
    lastname: string
    email: string
    preferences: PlaceType[]
    rooms?: Room[]
}
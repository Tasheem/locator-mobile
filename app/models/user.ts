import { PlaceType } from "./lokator-place-type"

export type User = {
    username: string
    password: string
    firstname: string
    lastname: string
    email: string
    preferences: PlaceType[]
}
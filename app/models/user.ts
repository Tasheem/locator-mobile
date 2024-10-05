import { PlaceType } from './places'
import { Room } from './room'

export type User = {
    id?: number
    username: string
    password: string
    firstname: string
    lastname: string
    email: string
    preferences: PlaceType[]
    rooms?: Room[]
    profilePictureUrl?: string
}

export type UserSearchResult = {
    id: number
    username: string
    firstname: string
    lastname: string
    profilePictureUrl?: string
    usernameHighlight?: string
    firstnameHighlight?: string
    lastnameHighlight?: string
}
import { PlaceType } from './places'
import { Room } from './room'

type User = {
    id?: number
    username: string
    password: string
    firstname: string
    lastname: string
    email: string
    preferences: PlaceType[]
    rooms?: Room[]
    profilePictureUrl?: string
    createdAt?: string
    lastLogin?: string
}

type UserSearchResult = {
    id: number
    username: string
    firstname: string
    lastname: string
    profilePictureUrl?: string
    usernameHighlight?: string
    firstnameHighlight?: string
    lastnameHighlight?: string
}

type Blocked = {
    id: number
    source: User
    target: User
    reason?: string
    date: string
}

export { User, UserSearchResult, Blocked };
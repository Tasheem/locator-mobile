import { Platform } from 'react-native'

export const appConfig: ApplicationConfig = {
    serverURL: process.env.EXPO_PUBLIC_ENV === 'development' && Platform.OS === 'android' ? process.env.EXPO_PUBLIC_SERVER_URL_ANDROID : process.env.EXPO_PUBLIC_SERVER_URL,
    socketURL: process.env.EXPO_PUBLIC_ENV === 'development' && Platform.OS === 'android' ? process.env.EXPO_PUBLIC_SOCKET_URL_ANDROID : process.env.EXPO_PUBLIC_SOCKET_URL,
    placesAPIKey: process.env.EXPO_PUBLIC_PLACES_API_KEY
}

export type ApplicationConfig = {
    serverURL: string
    socketURL: string
    placesAPIKey: string
}
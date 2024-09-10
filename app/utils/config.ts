import { Platform } from "react-native"

export const appConfig: ApplicationConfig = {
    serverURL: process.env.NODE_ENV === "development" && Platform.OS === "android" ? process.env.EXPO_PUBLIC_SERVER_URL_ANDROID : process.env.EXPO_PUBLIC_SERVER_URL,
    placesAPIKey: process.env.EXPO_PUBLIC_PLACES_API_KEY
}

export type ApplicationConfig = {
    serverURL: string
    placesAPIKey: string
}
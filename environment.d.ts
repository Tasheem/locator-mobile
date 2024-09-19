declare global {
    namespace NodeJS {
        interface ProcessEnv {
            EXPO_PUBLIC_ENV: 'development' | 'production' | 'test'
            EXPO_PUBLIC_SERVER_URL: string
            EXPO_PUBLIC_SERVER_URL_ANDROID: string
            EXPO_PUBLIC_SOCKET_URL: string
            EXPO_PUBLIC_SOCKET_URL_ANDROID: string
            NODE_ENV: 'development' | 'production'
            EXPO_PUBLIC_PLACES_API_KEY: string
        }
    }
}
  
  // If this file has no import/export statements (i.e. is a script)
  // convert it into a module by adding an empty export statement.
  export {}
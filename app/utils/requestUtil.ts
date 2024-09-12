import AsyncStorage from "@react-native-async-storage/async-storage";
import { User } from "../models/user";
import { BehaviorSubject } from "rxjs";
import { appConfig } from "./config";

const serverUrl = appConfig.serverURL;

const userSubject = new BehaviorSubject<User | null>(null);
const tokenSubject = new BehaviorSubject<string | null>(null);

AsyncStorage.getItem("user")
.then((item) => {
    if(!item) {
        return;
    }

    const user = JSON.parse(item) as User;
    userSubject.next(user);
});

AsyncStorage.getItem("bearerToken")
.then((token) => {
    if(!token) {
        return;
    }

    tokenSubject.next(token);
});

const emitUser = (user: User | null) => {
    if(user) {
        AsyncStorage.setItem("user", JSON.stringify(user));
    } else {
        AsyncStorage.removeItem("user");
    }

    userSubject.next(user);
}

const emitToken = (token: string | null) => {
    console.log("Emit Token:", token);
    if(token) {
        AsyncStorage.setItem("bearerToken", token);
    } else {
        AsyncStorage.removeItem("bearerToken");
    }

    tokenSubject.next(token);
}

const userObservable = () => {
    return userSubject.asObservable();
}

const tokenObservable = () => {
    return tokenSubject.asObservable();
}

const sendRequest = async (url: string, options?: RequestInit) => {
    const token = await AsyncStorage.getItem("bearerToken");
    
    let requestInit: RequestInit | undefined;
    if(options) {
        let headers;
        if(token) {
            headers = {
                ...options.headers,
                "Authorization": token ? token : null
            };
        } else {
            headers = {
                ...options.headers
            }
        }

        requestInit = {
            ...options,
            headers: headers
        } as RequestInit
    } else {
        let headers;
        if(token) {
            requestInit = {
                headers: {
                    "Authorization": token ? token : null
                }
            } as RequestInit
        }
    }

    console.log(requestInit); 
    const response = await fetch(url, requestInit);
    console.log(url);
    console.log(response.status)
    if(response.status === 401 && url.includes(serverUrl)) {
        // Token expired. Need to log in again.
        await AsyncStorage.removeItem("bearerToken");
        await AsyncStorage.removeItem("user");
        emitUser(null);
        emitToken(null);
    }

    return response;
}

export { userObservable, tokenObservable, emitUser, emitToken, sendRequest }
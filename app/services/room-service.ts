import AsyncStorage from "@react-native-async-storage/async-storage";
import { Room } from "../models/room";

const serverPrefix = "http://localhost:8080/room";

const createRoom = async (roomName: string) => {
    const token = await AsyncStorage.getItem("bearerToken");

    const options = {
        method: "POST",
        body: JSON.stringify({
            "name": roomName
        }),
        headers: {
            "Authorization": token ? token : "",
            "Content-Type": "application/json"
        }
    };

    return fetch(serverPrefix, options);
}

export { createRoom }
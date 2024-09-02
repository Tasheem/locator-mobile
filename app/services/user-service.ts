import AsyncStorage from "@react-native-async-storage/async-storage";
import { User } from "../models/user";
import { emitUser } from "./auth-service";

const serverPrefix = "http://localhost:8080/user";
const requestUser = async () => {
    const token = await AsyncStorage.getItem("bearerToken");
    const options = {
        headers: {
            "Authorization": token ? token : ""
        }
    };

    const response = fetch(serverPrefix, options);
    response.then((res) => {
        return res.json();
    })
    .then((user: User) => {
        emitUser(user);
    });

    return response;
}

export { requestUser }
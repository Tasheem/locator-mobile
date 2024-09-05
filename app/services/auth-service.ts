import { User } from "../models/user";
import { emitToken, emitUser, sendRequest } from "../utils/requestUtil";

const serverPrefix = "http://localhost:8080/auth";
const login = async (username: string, password: string) => {
    const payload = {
        "username": username,
        "password": password,
    };
    
    const options: RequestInit = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    };

    console.log(payload);

    const response = await sendRequest(serverPrefix + "/login", options);
    /* console.log("STATUS:", response.status);
    console.log("Headers:", response.headers); */
    if(response.status === 200) {
        const token = response.headers.get("authorization");
        // console.log("Token:", token);

        const user = await response.json() as User;
        // console.log("User:", user);

        emitUser(user);
        emitToken(token);

        return;
    }

    throw new Error();
}

const logout = () => {
    emitUser(null);
    emitToken(null);
}

const register = async (payload: User) => {
    const headers = new Headers();
    headers.set("Content-Type", "application/json");

    const options: RequestInit = {
        method: "POST",
        headers: headers,
        body: JSON.stringify(payload)
    }

    const response = await sendRequest(serverPrefix + "/user/register", options);
    if(response.status !== 200 && response.status !== 201) {
        // Error registering a user.
        throw Error(response.status + "");
    }
    
    return response;
}

export { login, logout, register };

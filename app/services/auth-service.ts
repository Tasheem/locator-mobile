import { User } from "../models/user";

export class AuthService {
    private serverPrefix: string;

    constructor() {
        this.serverPrefix = "http://localhost:8080/auth";
    }

    public async login(username: string, password: string) {
        const payload = {
            "username": username,
            "password": password,
        };
        
        const options: RequestInit = {
            method: "POST",
            headers:{
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        };

        console.log(payload);

        const response = await fetch(this.serverPrefix + "/login", options);
        console.log("STATUS:", response.status);
        console.log("Headers:", response.headers);
        if(response.status === 200) {
            const token = response.headers.get("authorization");
            console.log("JSessionID:", token);

            const user = await response.json() as User;

            return {
                authToken: token,
                user: user
            }
        }

        throw new Error();
    }

    public async logout() {
        const options: RequestInit = {
            method: "GET"
        }

        const response = await fetch(this.serverPrefix + "/logout")
        console.log("STATUS:", response.status);
    }

    public async register(payload: User) {
        const headers = new Headers();
        headers.set("Content-Type", "application/json");

        const options: RequestInit = {
            method: "POST",
            headers: headers,
            body: JSON.stringify(payload)
        }

        const response = await fetch(this.serverPrefix + "/user/register", options);
        if(response.status !== 200 && response.status !== 201) {
            // Error registering a user.
            throw Error(response.status + "");
        }
        
        return response;
    }
}

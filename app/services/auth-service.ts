export class AuthService {
    private serverPrefix: string;

    constructor() {
        this.serverPrefix = "http://localhost:8080";
    }

    public async login(username: string, password: string, setUserToken: React.Dispatch<React.SetStateAction<string | null>>) {
        const options: RequestInit = {
            method: "POST",
            headers:{
                "Content-Type": "application/x-www-form-urlencoded"
            },    
            body: new URLSearchParams({
                "username": username,
                "password": password,
                "grant_type": "password"
            }).toString()
        };

        console.log(options.body);

        const response = await fetch(this.serverPrefix + "/login", options);
        console.log("STATUS:", response.status);
        console.log("Headers:", response.headers);
        if(response.status === 200) {
            const jSessionID = response.headers.get("set-cookie");
            console.log("JSessionID:", jSessionID);
            setUserToken(jSessionID);
        }
    }

    public async logout() {
        const options: RequestInit = {
            method: "GET"
        }

        const response = await fetch(this.serverPrefix + "/logout")
        console.log("STATUS:", response.status);
    }
}

import { User } from "../models/user";
import { emitUser, sendRequest } from "../utils/requestUtil";

const serverPrefix = "http://localhost:8080/user";
const requestUser = async () => {
    const response = sendRequest(serverPrefix);
    response.then((res) => {
        return res.json();
    })
    .then((user: User) => {
        emitUser(user);
    });

    return response;
}

const searchUsers = async (searchTerm: string) => {
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "searchTerm": searchTerm
        })
    } as RequestInit

    return sendRequest(serverPrefix + "/search", options);
}

export { requestUser, searchUsers }
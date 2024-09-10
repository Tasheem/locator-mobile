import { User } from "../models/user";
import { appConfig } from "../utils/config";
import { emitUser, sendRequest } from "../utils/requestUtil";

const serverPrefix = `${appConfig.serverURL}/user`;
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
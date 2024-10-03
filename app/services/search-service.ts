import { appConfig } from "../utils/config";
import { sendRequest } from "../utils/requestUtil";

const serverPrefix = `${appConfig.serverURL}/search`
const searchUsers = async (searchTerm: string) => {
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'searchTerm': searchTerm
        })
    } as RequestInit

    return sendRequest(serverPrefix + '/user', options);
}

export { searchUsers }
import { User } from '../models/user';
import { appConfig } from '../utils/config';
import { emitUser, sendRequest } from '../utils/requestUtil';

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

const getUserPreferences = async () => {
    return sendRequest(`${serverPrefix}/diet/preferences`);
}

const updateUserPreferences = async (placeTypeIds: number[]) => {
    console.log('----------------------------- Saving Place Type Ids -----------------------------');
    console.log(placeTypeIds);
    
    const options = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(placeTypeIds)
    } as RequestInit

    return sendRequest(`${serverPrefix}/diet/preferences`, options);
}

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

    return sendRequest(serverPrefix + '/search', options);
}

export { requestUser, getUserPreferences, updateUserPreferences, searchUsers }
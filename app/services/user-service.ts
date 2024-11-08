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
    const options = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(placeTypeIds)
    } as RequestInit

    return sendRequest(`${serverPrefix}/diet/preferences`, options);
}

const deleteUser = async () => {
    const options = {
        method: 'DELETE',
    } as RequestInit

    return sendRequest(serverPrefix, options);
}

const getBlockedUsers = async () => {
    return sendRequest(`${serverPrefix}/block`);
}

const blockUser = async (targetUserId: number, reason?: string) => {
    const options = {
        method: 'POST',
        body: reason
    } as RequestInit

    return sendRequest(`${serverPrefix}/block/${targetUserId}`, options);
}

const unblockUser = async (blockId: number) => {
    const options = {
        method: 'DELETE'
    } as RequestInit

    return sendRequest(`${serverPrefix}/block/${blockId}`, options);
}

export { requestUser, getUserPreferences, updateUserPreferences, deleteUser, getBlockedUsers, blockUser, unblockUser }
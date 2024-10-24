import { User } from '../models/user';
import { appConfig } from '../utils/config';
import { emitToken, emitUser, sendRequest } from '../utils/requestUtil';

const serverPrefix = `${appConfig.serverURL}/auth`;
const login = async (username: string, password: string) => {
    // console.log(`Server URL: ${appConfig.serverURL}`);
    const payload = {
        'username': username,
        'password': password,
    };
    
    const options: RequestInit = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    };

    const response = await sendRequest(serverPrefix + '/login', options);
    if(response.ok) {
        const token = response.headers.get('authorization');
        const user = await response.json() as User;

        emitToken(token);
        emitUser(user);
    }

    return response;
}

const logout = () => {
    emitToken(null);
    emitUser(null);
}

const register = async (payload: User) => {
    const options: RequestInit = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    }

    return sendRequest(serverPrefix + '/register', options);
}

export { login, logout, register };

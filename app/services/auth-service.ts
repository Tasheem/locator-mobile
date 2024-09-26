import { User } from '../models/user';
import { appConfig } from '../utils/config';
import { emitToken, emitUser, sendRequest } from '../utils/requestUtil';

const serverPrefix = `${appConfig.serverURL}/auth`;
const login = async (username: string, password: string) => {
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

    console.log(payload);

    const response = await sendRequest(serverPrefix + '/login', options);
    /* console.log('STATUS:', response.status);
    console.log('Headers:', response.headers); */
    if(response.ok) {
        const token = response.headers.get('authorization');
        // console.log('Token:', token);

        const user = await response.json() as User;
        // console.log('User:', user);

        emitUser(user);
        emitToken(token);
    }

    return response;
}

const logout = () => {
    emitUser(null);
    emitToken(null);
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

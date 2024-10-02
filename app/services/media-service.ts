import { appConfig } from "../utils/config";
import { sendRequest } from "../utils/requestUtil";

const serverPrefix = `${appConfig.serverURL}/media`;
const fetchUserImages = () => {
    return sendRequest(`${serverPrefix}/image/user`);
}

export { fetchUserImages }
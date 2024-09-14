import { appConfig } from "../utils/config";
import { sendRequest } from "../utils/requestUtil";

const serverPrefix = `${appConfig.serverURL}/recommendation`;
const fetchRecommendedPlaces = (roomId: number, latitude: number, longitude: number) => {
    const options = {
        method: "POST",
        body: JSON.stringify({
            "latitude": latitude,
            "longitude": longitude
        }),
        headers: {
            "Content-Type": "application/json"
        }
    };

    return sendRequest(`${serverPrefix}/room/id/${roomId}`, options);
}

export { fetchRecommendedPlaces }
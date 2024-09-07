import { sendRequest } from "../utils/requestUtil";

const serverPrefix = "http://localhost:8080/recommendation"
const fetchRecommendedPlaces = (roomId: number) => {
    const options = {
        method: "POST",
        body: JSON.stringify({
            "latitude": 33.50009020,
            "longitude": -86.8069160
        }),
        headers: {
            "Content-Type": "application/json"
        }
    };

    return sendRequest(`${serverPrefix}/room/id/${roomId}`, options);
}

export { fetchRecommendedPlaces }
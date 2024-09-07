import { PlaceType } from "../models/places";
import { sendRequest } from "../utils/requestUtil";

const host = "http://localhost:8080"
export async function fetchPlaceTypes() {
	const uri = host + "/places/type";
	const response = await sendRequest(uri);

	if(!response.ok) {
		console.log(response);
		throw Error("Status not 200");
	}

	return response.json() as Promise<PlaceType[]>;
}
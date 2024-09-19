import { PlaceType } from '../models/places';
import { sendRequest } from '../utils/requestUtil';
import { appConfig } from '../utils/config';

const serverPrefix = appConfig.serverURL;

export async function fetchPlaceTypes() {
	const uri = serverPrefix + '/places/type';
	const response = await sendRequest(uri);

	if(!response.ok) {
		console.log(response);
		throw Error('Status not 200');
	}

	return response.json() as Promise<PlaceType[]>;
}
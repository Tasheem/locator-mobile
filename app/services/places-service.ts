import { PlaceType } from '../models/places';
import { sendRequest } from '../utils/requestUtil';
import { appConfig } from '../utils/config';

const serverPrefix = appConfig.serverURL;

export async function fetchPlaceTypes() {
	const uri = serverPrefix + '/places/type';
	return sendRequest(uri);
}
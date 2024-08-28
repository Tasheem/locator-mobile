import { Place, SearchResponse } from "../models/google-places-api";

export const apiKey = "";

export async function fetchPlaces() {
	const url = "https://places.googleapis.com/v1/places:searchNearby";
	const headers = {
		"Content-Type": "application/json",
		"X-Goog-Api-Key": apiKey,
		"X-Goog-FieldMask":
			"places.id,places.types,places.nationalPhoneNumber,places.displayName,places.primaryType,places.primaryTypeDisplayName,places.formattedAddress,places.photos.name,places.photos.widthPx,places.photos.heightPx,places.currentOpeningHours.openNow",
	};

	const body = JSON.stringify({
		openNow: true,
		includedTypes: ["restaurant"],
		maxResultCount: 10,
		locationRestriction: {
			circle: {
				center: {
					latitude: 33.50009020,
					longitude: -86.8069160,
				},
				radius: 20000.0,
			},
		}
	});

	let data: SearchResponse | null = null;
	try {
		const response = await fetch(url, {
			method: "POST",
			headers: headers,
			body: body
		});
	
		data = await response.json() as SearchResponse;
		return data.places;
	} catch(err) {
		console.log(err);
	}
}

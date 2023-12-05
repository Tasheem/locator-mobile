type AuthorAttribution = {
	displayName: string;
	photoUri: string;
	uri: string;
}

type Photo = {
	height: number;
	width: number;
	photoReference: string;
	htmlAttributions: string[];
	authorAttributions: AuthorAttribution[];
};

export type Restaurant = {
	types: string[];
	formattedAddress: string;
	websiteUri: string;
	displayName: {
		languageCode: string;
		text: string;
	};
	photos?: Photo[];
};

//fetches restaurants based on searchTerm. i.e: 'Vegan', 'Vegetarian', etc.
export function fetchRestaurants(searchTerm: string, apiKey: string) {
	const url = "https://places.googleapis.com/v1/places:searchText";

	const headers = {
		"Content-Type": "application/json",
		"X-Goog-Api-Key": apiKey,
		"X-Goog-FieldMask":
			"places.id,places.displayName,places.formattedAddress,places.types,places.websiteUri,places.photos",
	};

	const body = JSON.stringify({
		textQuery: searchTerm,
		languageCode: "en",
		locationBias: {
			circle: {
				center: {
					latitude: 33.5186,
					longitude: -86.8104,
				},
				radius: 500.0,
			},
		},
	});

	return fetch(url, {
		method: "POST",
		headers: headers,
		body: body,
	})
		.then((response) => {
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
			return response.json();
		})
		.then((data): Restaurant[] => {
			return data?.places;
		})
		.catch((error) => {
			console.error("Error:", error);
			throw error;
		});
}

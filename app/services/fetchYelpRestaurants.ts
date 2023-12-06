import { Business } from "../models/yelp-api";

//fetches restaurants based on searchTerm. i.e: 'Vegan', 'Vegetarian', etc.
export function fetchYelpRestaurants(searchTerm: string, apiKey: string) {
	searchTerm = searchTerm.replace(" ", "%20");
	const url = `https://api.yelp.com/v3/businesses/search?latitude=33.5186&longitude=-86.8104&term=${searchTerm}%20food&categories=&sort_by=best_match&limit=20`;

	const headers = {
		Authorization: `Bearer ${apiKey}`,
		Accept: "application/json",
	};

	return fetch(url, {
		method: "GET",
		headers: headers,
	})
	.then((response) => {
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		return response.json();
	})
	.then((data): Business[] => {
		return data?.businesses;
	})
	.catch((error) => {
		console.error("Error:", error);
		throw error;
	});
}

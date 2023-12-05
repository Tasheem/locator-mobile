type Category = {
	alias: string;
	title: string;
};

type Coordinates = {
	latitude: number;
	longitude: number;
};

type Location = {
	address1: string;
	address2: string | null;
	address3: string | null;
	city: string;
	country: string;
	display_address: string[];
	state: string;
	zip_code: string;
};

export type Business = {
	id: string;
	alias: string;
	name: string;
	image_url: string;
	is_closed: boolean;
	url: string;
	review_count: number;
	categories: Category[];
	rating: number;
	coordinates: Coordinates;
	transactions: string[];
	price: string;
	location: Location;
	phone: string;
	display_phone: string;
	distance: number;
};

//fetches restaurants based on searchTerm. i.e: 'Vegan', 'Vegetarian', etc.
export function fetchYelpRestaurants(searchTerm: string, apiKey: string) {
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

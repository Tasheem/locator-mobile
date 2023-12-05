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
	address2?: string;
	address3?: string;
	city: string;
	country: string;
	display_address: string[];
	state: string;
	zip_code: string;
};

type Business = {
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

export { Business, Location, Coordinates, Category };
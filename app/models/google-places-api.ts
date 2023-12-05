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

type Restaurant = {
	types: string[];
	formattedAddress: string;
	websiteUri: string;
	displayName: {
		languageCode: string;
		text: string;
	};
	photos?: Photo[];
};

export { Restaurant, Photo, AuthorAttribution };
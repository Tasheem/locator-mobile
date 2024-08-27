type Photo = {
	name: string;
	heightPx: number;
	widthPx: number;
};

type LocalizedText = {
	text: string;
	languageCode: string
}

type OpeningHours = {
	openNow: boolean
}

type Place = {
	id: string;
	types: string[];
	nationalPhoneNumber: string;
	formattedAddress: string;
	displayName: LocalizedText;
	primaryTypeDisplayName: LocalizedText;
	currentOpeningHours: OpeningHours;
	primaryType: string;
	photos?: Photo[];
};

type SearchResponse = {
	places: Place[];
}

export { Place, Photo, SearchResponse };
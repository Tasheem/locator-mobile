import { FlatList, SafeAreaView, View, Text, ActivityIndicator, StyleSheet } from "react-native";
import renderImage from "../utils/renderImage";
import { useEffect, useState } from "react";
import { Place } from "../models/google-places-api";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { apiKey, fetchPlaces } from "../services/places-service";

const brandColor = "#c96b6b";

export default function RecommendationScreen() {
    const [places, setPlaces] = useState<Place[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        fetchPlaces()
        .then(results => {
            setPlaces(results ? results : []);
        })
        .finally(() => {
            setIsLoading(false);
        });
    }, []);
    
    /* useEffect(() => {
        console.log(`Number of places: ${places.length}`);
        console.log(places);
    }, [places]); */

    return (
        <SafeAreaView>
            <ActivityIndicator 
                animating={isLoading}
                color={brandColor}
                style={{
                    height: isLoading ? "auto" : 0
                }} 
            />
            { places.length > 0 ? renderResultsList(places) : <Text></Text> }
        </SafeAreaView>
    );
}

const renderResultsList = (places: Place[]) => {
    const imageHeight = 70;
    const imageWidth = 70;

    const maxHeightPx = 200;
    const maxWidthPx = 200;
	return (
		<FlatList
			data={places}
			keyExtractor={(place) => place.id}
			renderItem={({ item }) => (
				<View style={resultsStyle.resultsRowContainer}>
					{ item.photos && item.photos.length > 0 ? 
                    renderImage(`https://places.googleapis.com/v1/${item.photos[0].name}/media?key=${apiKey}&maxHeightPx=${maxHeightPx}&maxWidthPx=${maxWidthPx}`, imageWidth, imageHeight) 
                    : <View></View>}
					<View style={resultsStyle.informationContainer}>
						<View style={resultsStyle.detailsRow}>
							<Text style={resultsStyle.label}>Name:</Text>
							<Text>{item.displayName.text}</Text>
						</View>

						<View style={resultsStyle.detailsRow}>
							<Text style={resultsStyle.label}>Address:</Text>
							<Text>{item.formattedAddress}</Text>
						</View>

						<View style={resultsStyle.detailsRow}>
							<Text style={resultsStyle.label}>Phone:</Text>
							<Text>{item.nationalPhoneNumber}</Text>
						</View>
					</View>
					<BouncyCheckbox
						size={25}
						fillColor={brandColor}
						unfillColor="#FFFFFF"
						iconStyle={{ borderColor: brandColor }}
						innerIconStyle={{ borderWidth: 2 }}
						style={resultsStyle.checkbox}
					/>
				</View>
			)}
		/>
	)
}

const resultsStyle = StyleSheet.create({
	resultsRowContainer: {
		flex: 1,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		padding: 10,
		zIndex: 1,
		borderColor: brandColor,
		borderWidth: 2,
		margin: 10,
		borderRadius: 20,
		shadowColor: brandColor, // only works on iOS unless bg-color is set
		shadowOpacity: 0.5, // only works on iOS unless bg-color is set
	},
	thumbnail: {
		width: 70,
		height: 70,
	},
	informationContainer: {
		justifyContent: "space-between",
		flex: 5,
		paddingLeft: 20,
		rowGap: 5
	},
	detailsRow: {
		flexDirection: "row",
		width: "60%",
	},
	label: {
		fontWeight: "bold",
		paddingRight: 5,
	},
	checkbox: {
		flex: 1,
	},
});
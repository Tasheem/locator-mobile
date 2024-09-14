import { FlatList, SafeAreaView, View, Text, ActivityIndicator, StyleSheet, Alert } from "react-native";
import renderImage from "../utils/renderImage";
import { useEffect, useState } from "react";
import { Place } from "../models/places";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { BRAND_RED } from "../constants/colors";
import { fetchRecommendedPlaces } from "../services/recommendation-service";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RoomDetailsParamList } from "./RoomDetailsScreen";
import { RouteProp } from "@react-navigation/native";
import * as Location from "expo-location";
import moment from "moment-timezone";

const apiKey = process.env.EXPO_PUBLIC_PLACES_API_KEY;

type Props = {
    navigation: NativeStackNavigationProp<RoomDetailsParamList, "Recommended", undefined>
    route: RouteProp<RoomDetailsParamList, "Recommended">
}

export default function RecommendationScreen({ route }: Props) {
    const room = route.params.room;

    const [places, setPlaces] = useState<Place[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        (async () => {
            const { status } = await Location.getForegroundPermissionsAsync();
            if(status === "granted") {
                setIsLoading(true);
                
                try {
                    let location = await Location.getLastKnownPositionAsync();
                    if(locationIsOld(location?.timestamp)) {
                        location = await Location.getCurrentPositionAsync();
                    }

                    if(!location || location.coords.latitude == null || location.coords.longitude == null) {
                        return;
                    }

                    const response = await fetchRecommendedPlaces(room.id, location.coords.latitude, location.coords.longitude);
                    const places = await response.json() as Place[];
                    setPlaces(places);
                } finally {
                    setIsLoading(false);
                }
            } else {
                Alert.alert("Error", "Location needs to be granted to receive recommendations for your room.");
                setPlaces([]);
            }
        })();
    }, []);
    
    useEffect(() => {
        console.log(`Number of places: ${places.length}`);
        // console.log(places);
    }, [places]);

    return (
        <SafeAreaView>
            <ActivityIndicator 
                animating={isLoading}
                color={BRAND_RED}
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
					{ 
						item.photos && item.photos.length > 0 
						? renderImage(`https://places.googleapis.com/v1/${item.photos[0].name}/media?key=${apiKey}&maxHeightPx=${maxHeightPx}&maxWidthPx=${maxWidthPx}`, imageWidth, imageHeight) 
                    	: <View></View>
					}
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
					<View style={resultsStyle.checkboxContainer}>
						<View style={resultsStyle.percentageContainer}>
							<Text style={ item.matchPercentage >= 0.70 ? resultsStyle.percentage : [resultsStyle.percentage, resultsStyle.percentageRed] }>
								{ Math.floor(item.matchPercentage * 100) }%
							</Text>
							<Text style={ item.matchPercentage >= 0.70  ? resultsStyle.percentage : [resultsStyle.percentage, resultsStyle.percentageRed] }>
								match
							</Text>
						</View>
						<BouncyCheckbox
							size={25}
							fillColor={BRAND_RED}
							unfillColor="#FFFFFF"
							iconStyle={{ borderColor: BRAND_RED }}
							innerIconStyle={{ borderWidth: 2 }}
							style={resultsStyle.checkbox}
						/>
					</View>
				</View>
			)}
		/>
	)
}

const locationIsOld = (timestamp?: number) => {
    if(!timestamp) {
        return false;
    }

    const lastTimeChecked = moment(timestamp);
    const today = moment();
    const aWeekAgo = today.subtract(7, "days");

    return lastTimeChecked.isBefore(aWeekAgo);
}

const resultsStyle = StyleSheet.create({
	resultsRowContainer: {
		flex: 1,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		padding: 10,
		zIndex: 1,
		borderColor: BRAND_RED,
		borderWidth: 2,
		margin: 10,
		borderRadius: 20,
		shadowColor: BRAND_RED, // only works on iOS unless bg-color is set
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
	checkboxContainer: {
		height: "100%"
	},
	percentageContainer: {
		paddingBottom: 10
	},
	percentage: {
		color: "green",
		fontSize: 14
	},
	percentageRed: {
		color: "red"
	},
	checkbox: {
	}
});

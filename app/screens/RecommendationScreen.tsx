import { FlatList, SafeAreaView, View, Text, ActivityIndicator, StyleSheet, Alert } from 'react-native';
import renderImage from '../utils/renderImage';
import { useEffect, useState } from 'react';
import { Place } from '../models/places';
import { BRAND_RED } from '../constants/colors';
import { fetchRecommendedPlaces } from '../services/recommendation-service';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RoomDetailsParamList } from './RoomDetailsScreen';
import { RouteProp } from '@react-navigation/native';
import * as Location from 'expo-location';
import moment from 'moment-timezone';
import SegmentedControl from '@react-native-segmented-control/segmented-control';
import { TextInput } from 'react-native-gesture-handler';
import LocatorButton from '../components/LocatorButton';
import { geocode } from '../services/geocode-service';
import { GeocodeAPIResponse } from '../models/geocode-response';
import { Room } from '../models/room';

const apiKey = process.env.EXPO_PUBLIC_PLACES_API_KEY;

type Props = {
    navigation: NativeStackNavigationProp<RoomDetailsParamList, 'Recommended', undefined>
    route: RouteProp<RoomDetailsParamList, 'Recommended'>
}

export default function RecommendationScreen({ route }: Props) {
    const room = route.params.room;
	const searchOptions = ['My Location', 'Custom'];

	const [selectedOptionIndex, setSelectedOptionIndex] = useState(1);
    const [places, setPlaces] = useState<Place[]>([]);
    const [isLoading, setIsLoading] = useState(false);
	const [customLocation, setCustomLocation] = useState('');

    return (
        <SafeAreaView style={{
			height: '100%' // This addresses issue with flatlist being overlapped by the bottom tabs.
		}}>
			<View style={style.formContainer}>
				<View style={style.inputContainer}>
					{
						selectedOptionIndex === 1 ? (
							<TextInput
								placeholder='Location'
								style={style.locationInput}
								value={customLocation}
								onChangeText={setCustomLocation}
							/>
						) : null
					}
					<LocatorButton 
						type='Primary'
						textValue='Search'
						useLogo={true}
						disabled={isLoading}
						handler={() => {
							setPlaces([]);
							setIsLoading(true);
							console.log('search hit!!!!!!!!!!!!!!!!!!!!!!');
							if(selectedOptionIndex === 0) {
								searchByGPSLocation(room)
								.then((places) => {
									setPlaces(places ? places : []);
								})
								.finally(() => {
									setIsLoading(false);
								});
							} else {
								searchByCustomLocation(customLocation, room)
								.then((places) => {
									setPlaces(places ? places : []);
								})
								.finally(() => {
									setIsLoading(false);
								});
							}
						}}
					/>
				</View>
				<SegmentedControl
					values={searchOptions}
					selectedIndex={selectedOptionIndex}
					onChange={async (event) => {
						setSelectedOptionIndex(event.nativeEvent.selectedSegmentIndex);
						if(event.nativeEvent.selectedSegmentIndex === 0) {
							// Request permissions if not already granted.
							// Moving away from the "My location" option if the user declined the request.
							const isGranted = await hasLocationPermissions();
							if(!isGranted) {
								setSelectedOptionIndex(1);
								Alert.alert('Inaccessible', 'Location permissions must be granted to search by your location in real time');
							}
						}
					}}
					style={style.searchOptions}
					tintColor={BRAND_RED}
					activeFontStyle={{
						color: 'white'
					}}
				/>
			</View>
            <ActivityIndicator 
                animating={isLoading}
                color={BRAND_RED}
                style={{
                    height: isLoading ? 'auto' : 0,
					marginTop: isLoading ? 10 : 0,
					marginBottom: isLoading ? 10 : 0
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
						{/* <Checkbox
							color={BRAND_RED}
							style={resultsStyle.checkbox}
						/> */}
					</View>
				</View>
			)}
		/>
	)
}

const searchByCustomLocation = async (location: string, room: Room) => {
	if(location.trim().length === 0) {
		Alert.alert('Invalid', 'A location is needed to activate search.');
	}

	let coordinates = null;
	try {
		const response = await geocode(location);
		if(response.ok) {
			const payload = await response.json() as GeocodeAPIResponse;
			if(payload.results.length === 0) {
				throw new Error('Geocode API returned no results.');
			}

			coordinates = payload.results[0].geometry.location;
		} else {
			Alert.alert('Error', 'An error occurred when atempting to parse the location. Please adjust the format and try again.');
			return;
		}
	} catch (err) {
		Alert.alert('Error', 'An error occurred when atempting to parse the location. Please adjust the format and try again.');
		return;
	}

	if(!coordinates) {
		Alert.alert('Error', 'An error occurred when atempting to parse the location. Please adjust the format and try again.');
		return;
	}

	try {
		const response = await fetchRecommendedPlaces(room.id, coordinates?.lat, coordinates?.lng);
		const places = await response.json() as Place[];

		return places;
	} catch (err) {
		Alert.alert('Error', 'An error occurred when fetching recommendations. Please try again later.');
		return;
	}
}

const searchByGPSLocation = async (room: Room) => {
	const { status } = await Location.getForegroundPermissionsAsync();
	if(status === 'granted') {
		try {
			let location = await Location.getLastKnownPositionAsync();
			if(locationIsOld(location?.timestamp)) {
				console.log('Location is old. Fetching updated location...');
				location = await Location.getCurrentPositionAsync();
				console.log(location);
			}

			if(!location || location.coords.latitude == null || location.coords.longitude == null) {
				return;
			}

			const response = await fetchRecommendedPlaces(room.id, location.coords.latitude, location.coords.longitude);
			const places = await response.json() as Place[];
			
			return places;
		} catch (err) {
			Alert.alert('Error', 'An error occurred when fetching recommendations. Please try again later.');
			return;
		}
	} else {
		Alert.alert('Location', 'Location permissions must be granted to search by your location in real time');
	}
}

const locationIsOld = (timestamp?: number) => {
    if(!timestamp) {
        return false;
    }

    const lastTimeChecked = moment(timestamp);
    const today = moment();
    const aWeekAgo = today.subtract(8, 'hours');

    return lastTimeChecked.isBefore(aWeekAgo);
}

const style = StyleSheet.create({
	formContainer: {
		paddingTop: 10,
		paddingBottom: 10,
		paddingLeft: 5,
		paddingRight: 5,
		borderWidth: 2,
		borderColor: BRAND_RED,
		borderRadius: 10,
		marginTop: 10,
		marginLeft: 10,
		marginRight: 10
	},
	inputContainer: {
		flexDirection: 'row',
		justifyContent: 'center',
		columnGap: 10
	},
	locationInput: {
		flex: 1,
		borderColor: BRAND_RED,
		borderWidth: 2,
		borderRadius: 10,
		paddingLeft: 10,
		paddingRight: 10
	},
	searchOptions: {
		marginTop: 10
	}
});

const hasLocationPermissions = async () => {
	const { status } = await Location.getForegroundPermissionsAsync();
	if(status !== 'granted') {
		// request permission
		const response = await Location.requestForegroundPermissionsAsync();
		return response.status === 'granted';
	}

	return true;
}

const resultsStyle = StyleSheet.create({
	resultsRowContainer: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
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
		justifyContent: 'space-between',
		flex: 5,
		paddingLeft: 20,
		rowGap: 5
	},
	detailsRow: {
		flexDirection: 'row',
		width: '60%',
	},
	label: {
		fontWeight: 'bold',
		paddingRight: 5,
	},
	checkboxContainer: {
		height: '100%'
	},
	percentageContainer: {
		paddingBottom: 10
	},
	percentage: {
		color: 'green',
		fontSize: 14
	},
	percentageRed: {
		color: 'red'
	},
	checkbox: {
	}
});

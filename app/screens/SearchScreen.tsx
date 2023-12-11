import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
	FlatList,
	Image,
	SafeAreaView,
	StyleSheet,
	Text,
	TextInput,
	Platform,
	View,
	ActivityIndicator,
} from "react-native";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { fetchYelpRestaurants } from "../services/fetchYelpRestaurants";
import { Business } from "../models/yelp-api";
import { formatPhoneNumber } from "../utils/formatUtil";
import LokatorButton from "../components/LokatorButton";

const brandColor = "#c96b6b";

export default function SearchScreen() {
	const [diet, setDiet] = useState("");
	const [businesses, setBusinesses] = useState<Business[]>([]);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		console.log(`Diet: ${diet}`);
		console.log(`Number of businesses: ${businesses.length}`);
		console.log(businesses);
	}, [businesses]);

	const handlePress = () => {
		if (diet) {
			setIsLoading(true);
			
			fetchYelpRestaurants(diet, "Bzz6M3phkh0W4XFEb1LtdBZmxC9TraSABAVGI-eLgf1O1VrWDNj8jLGiNO_kSY6nFPcaiUU8YaMDOhIJ3Jr3K7fLuYg6n37tPQagkuIZsYqNaakZCuL4GLdNPBNtZXYx")
			.then((results) => {
				setBusinesses(results);
			})
			.catch((error) => {
				console.error("Error fetching restaurants:", error);
				// Handle error appropriately
			})
			.finally(() => {
				setIsLoading(false);
			});
		} else {
			// Handle the case where 'diet' is not set
			console.log("what the fuck?");
		}
	};

	return (
		<SafeAreaView>
			<View style={styles.headerContainer}>
				<Text style={styles.heading}>Find Your Meal</Text>
			</View>
			<View style={styles.formContainer}>
				<TextInput
					style={styles.inputField}
					placeholder="Diet"
					onChangeText={setDiet}
					value={diet}
				/>
				
				<LokatorButton 
					handler={handlePress} 
					type="Secondary"
					fontSize={17}
					useLogo={true}
				/>
			</View>
			<ActivityIndicator 
				animating={isLoading}
				color={brandColor}
				style={{
					height: isLoading ? "auto" : 0
				}} 
			/>
			{ businesses.length > 0 ? renderResultsList(businesses) : <Text></Text> }

			<StatusBar style="auto" />
		</SafeAreaView>
	);
}

const renderImage = (uri: string) => {
	if(!uri) {
		return (
			<Image source={{
				uri: uri
			}} />
		);
	}

	return (
		<Image style={resultsStyle.thumbnail} source={{
			uri: uri
		}} />
	);
}

const renderResultsList = (businesses: Business[]) => {
	return (
		<FlatList
			data={businesses}
			keyExtractor={(item) => item.id}
			renderItem={({ item }) => (
				<View style={resultsStyle.resultsRowContainer}>
					{ renderImage(item.image_url) }
					<View style={resultsStyle.informationContainer}>
						<View style={resultsStyle.detailsRow}>
							<Text style={resultsStyle.label}>Name:</Text>
							<Text>{item.name}</Text>
						</View>

						<View style={resultsStyle.detailsRow}>
							<Text style={resultsStyle.label}>Address:</Text>
							<Text>{`${item.location.address1}, ${item.location.city}, ${item.location.state}`}</Text>
						</View>

						<View style={resultsStyle.detailsRow}>
							<Text style={resultsStyle.label}>Type:</Text>
							<Text>{formatPhoneNumber(item.phone)}</Text>
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

const styles = StyleSheet.create({
	headerContainer: {
		flexDirection: "row",
		marginTop: 20,
		marginBottom: 20,
		marginLeft: "auto",
		marginRight: "auto",
		borderColor: brandColor,
		borderBottomWidth: 2
	},
	heading: {
		fontSize: 20,
		fontWeight: "bold"
	},
	formContainer: {
		flexDirection: "row",
		marginLeft: 5,
		marginRight: 5,
		marginBottom: 20,
		zIndex: 2
	},
	inputField: {
		flex: 2,
		borderColor: brandColor,
		borderWidth: 2,
		borderRadius: 8,
		height: 40,
		paddingLeft: 5,
		marginRight: 10
	}
});

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

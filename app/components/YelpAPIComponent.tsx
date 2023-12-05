import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
	FlatList,
	Button,
	Image,
	SafeAreaView,
	StyleSheet,
	Text,
	TextInput,
	Platform,
	View,
	StatusBar as sb,
} from "react-native";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { fetchYelpRestaurants } from "../utils/fetchYelpRestaurants";
import { Business } from "../models/yelp-api";

export default function YelpAPIComponent() {
	const [diet, setDiet] = useState("");
	const [businesses, setBusinesses] = useState<Business[]>([]);

	useEffect(() => {
		console.log(`Diet: ${diet}`);
		console.log(`Number of businesses: ${businesses.length}`);
		console.log(businesses);
	}, [businesses]);

	const handlePress = () => {
		if (diet) {
			fetchYelpRestaurants(diet, "Bzz6M3phkh0W4XFEb1LtdBZmxC9TraSABAVGI-eLgf1O1VrWDNj8jLGiNO_kSY6nFPcaiUU8YaMDOhIJ3Jr3K7fLuYg6n37tPQagkuIZsYqNaakZCuL4GLdNPBNtZXYx")
			.then((results) => {
				setBusinesses(results);
			})
			.catch((error) => {
				console.error("Error fetching restaurants:", error);
				// Handle error appropriately
			});
		} else {
			// Handle the case where 'diet' is not set
			console.log("what the fuck?");
		}
	};

	return (
		<SafeAreaView style={styles.androidSafeArea}>
			<View style={styles.headerContainer}>
				<TextInput style={styles.heading} value="Find Your Meal" />
			</View>
			<View style={styles.formContainer}>
				<TextInput
					style={styles.inputField}
					placeholder="Diet"
					onChangeText={setDiet}
					value={diet}
				/>

				<View style={styles.formBtnContainer}>
					<Button
						title="Search"
						onPress={handlePress}
					/>
				</View>
			</View>
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
						fillColor="#007AFF"
						unfillColor="#FFFFFF"
						iconStyle={{ borderColor: "#007AFF" }}
						innerIconStyle={{ borderWidth: 2 }}
						style={resultsStyle.checkbox}
					/>
				</View>
			)}
		/>
	)
}

const formatPhoneNumber = (pn: string) => {
	if(!pn) {
		return '';
	}

	const phoneNumber = pn.slice(2);
	const split = [phoneNumber.slice(0, 3), phoneNumber.slice(3, 6), phoneNumber.slice(6, 10)];
	const formattedNumber = `(${split[0]})-${split[1]}-${split[2]}`;

	return formattedNumber;
}

const styles = StyleSheet.create({
	androidSafeArea: {
		flex: 1,
		paddingTop: Platform.OS === "android" ? sb.currentHeight : 0
	},
	headerContainer: {
		flexDirection: "row",
		justifyContent: "center",
		paddingTop: 20,
		paddingBottom: 20
	},
	heading: {
		fontSize: 20,
		fontWeight: "bold",
		borderColor: "#007AFF",
		borderBottomWidth: 2
	},
	formContainer: {
		flexDirection: "row",
		marginLeft: 5,
		marginBottom: 20,
		zIndex: 2
	},
	inputField: {
		flex: 2,
		borderColor: "#bfbfbf",
		borderWidth: 1,
		borderRadius: 8,
		height: 40,
		paddingLeft: 5
	},
	formBtnContainer: {
		flex: 1,
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center"
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
		borderColor: "#bfbfbf",
		borderWidth: 2,
		margin: 10,
		borderRadius: 20,
		shadowColor: "#bfbfbf",
		shadowOpacity: 0.8,
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

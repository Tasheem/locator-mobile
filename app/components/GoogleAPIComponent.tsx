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
import { fetchRestaurants, Restaurant } from "../utils/fetchGoogleRestaurants";
import { fetchYelpRestaurants, Business } from "../utils/fetchYelpRestaurants";

export default function GoogleAPIComponent() {
	const [diet, setDiet] = useState("");
	const [restaurants, setRestaurants] = useState<Business[]>([]);

	useEffect(() => {
		console.log(`Diet: ${diet}`);
		console.log(`Number of restaurants: ${restaurants.length}`);
		console.log(restaurants);
	}, [restaurants]);

	const handlePress = () => {
		if (diet) {
			fetchYelpRestaurants(diet, "GetYourKeyBro")
				.then((results) => {
					setRestaurants(results);
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
			<View style={styles.formContainer}>
				<View style={styles.inputContainer}>
					<TextInput
						style={[
							styles.inputField,
							{
								flexBasis: "100%",
							},
						]}
						placeholder="Diet"
						onChangeText={setDiet}
						value={diet}
					/>
				</View>

				<View style={styles.formBtnContainer}>
					<Button
						title="Search"
						onPress={handlePress}
					/>
				</View>
			</View>
			{restaurants.length > 0 ? (
				<FlatList
					data={restaurants}
					keyExtractor={(item) => item.id}
					renderItem={({ item }) => (
						<View style={resultsStyle.resultsRowContainer}>
							<Image
								style={resultsStyle.thumbnail}
								source={{ uri: item.image_url }}
							/>
							<View style={resultsStyle.informationContainer}>
								<View style={resultsStyle.detailsRow}>
									<Text style={resultsStyle.label}>Name:</Text>
									<Text>{item.name}</Text>
								</View>

								{/* <View style={resultsStyle.detailsRow}>
									<Text style={resultsStyle.label}>Address:</Text>
									<Text>{item.location}</Text>
								</View> */}

								{/* <View style={resultsStyle.detailsRow}>
									<Text style={resultsStyle.label}>Type:</Text>
									<Text>{sectionData.item.type}</Text>
								</View> */}
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
			) : (
				<Text>Nada</Text>
			)}
			<StatusBar style="auto" />
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	androidSafeArea: {
		flex: 1,
		paddingTop: Platform.OS === "android" ? sb.currentHeight : 0,
	},
	formContainer: {
		flexDirection: "row",
		marginLeft: 5,
		marginBottom: 20,
		zIndex: 2,
	},
	inputContainer: {
		flex: 2,
		flexDirection: "row",
		flexWrap: "wrap",
		rowGap: 5,
	},
	inputField: {
		flex: 1,
		borderColor: "#bfbfbf",
		borderWidth: 1,
		borderRadius: 8,
		height: 40,
		paddingLeft: 5,
	},
	dropdown: {
		flex: 1,
		borderColor: "#bfbfbf",
		borderRadius: 8,
		paddingLeft: 1,
	},
	formBtnContainer: {
		flex: 1,
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		height: "200%",
	},
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
		height: 70,
		justifyContent: "space-between",
		flex: 5,
		paddingLeft: 20,
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

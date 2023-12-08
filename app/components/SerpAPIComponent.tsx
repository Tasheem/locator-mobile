import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
	Button,
	Image,
	SafeAreaView,
	SectionList,
	SectionListRenderItem,
	StyleSheet,
	Text,
	TextInput,
	View,
	Platform,
	StatusBar as sb,
} from "react-native";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { SerpAPIResult } from "../models/serp-api";

type Section = {
	title: string;
	data: SectionData[];
};

type SectionData = {
	imageSrc: {
		uri: string;
	};
	name: string;
	address: string;
	type: string;
};

const apiKey =
	"9de1f7091548075288f90f1f6b0d3bea6c57810b47ce67cbf885bbc39a473ff9";

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

export default function SerpAPIComponent() {
	const [diet, setDiet] = useState("");
	const [location, setLocation] = useState<string | null>(null);

	const [open, setOpen] = useState(false);
	const [cities, setCities] = useState([
		{
			label: "Alabama",
			value: "Alabama",
			disabled: true,
			labelStyle: { opacity: 0.5 },
		},
		{
			label: "Birmingham",
			value: "Birmingham, Alabama, United States",
			parent: "Alabama",
		},

		{
			label: "Georgia",
			value: "Georgia",
			disabled: true,
			labelStyle: { opacity: 0.5 },
		},
		{
			label: "Atlanta",
			value: "Atlanta, Georgia, United States",
			parent: "Georgia",
		},
	]);

	const [sections, setSections] = useState<Section[]>([]);

	/* const sections: Section[] = [
    {
      title: 'Coffee',
      data: [
        {
          imageSrc: './assets/favicon.png',
          name: 'Starbucks',
          address: '600 Congress Ave',
          type: 'Coffee shop'
        },
        {
          imageSrc: './assets/favicon.png',
          name: 'Item 2',
          address: 'Some Address',
          type: 'Restaurant'
        },
        {
          imageSrc: './assets/favicon.png',
          name: 'Item 3',
          address: 'Some Other Address',
          type: 'Fast Food'
        }
      ]
    }
  ] */

	useEffect(() => {
		console.log(`Diet: ${diet}`);
		console.log(`Location: ${location}`);
	}, [diet, location]);

	const fetchPlaces = () => {
		const url = `https://serpapi.com/search.json?api_key=${apiKey}&q=${
			diet + " food"
		}&location=${location?.replace(
			" ",
			"+"
		)}&hl=en&gl=us&google_domain=google.com`;

		fetch(url)
			.then((response) => response.json())
			.then((data: SerpAPIResult) => {
				const sections = [] as Section[];
				const sectionData = [] as SectionData[];

				console.log(data);
				data.local_results.places.forEach((place) => {
					sectionData.push({
						imageSrc: {
							uri: place.thumbnail,
						},
						name: place.title,
						address: place.address,
						type: place.type,
					});
				});

				sections.push({
					title: diet,
					data: sectionData,
				});

				setSections(sections);
			})
			.catch((err) => {
				console.error(err);
			});
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
						onPress={fetchPlaces}
					/>
				</View>
			</View>

			<SectionList
				sections={sections}
				keyExtractor={(item, index) => "" + index}
				renderItem={renderResultRow}
				renderSectionHeader={({ section: { title } }) => (
					<Text style={{ fontSize: 24 }}>{title}</Text>
				)}
			></SectionList>

			<StatusBar style="auto" />
		</SafeAreaView>
	);
}

const renderResultRow: SectionListRenderItem<SectionData, Section> = (
	sectionData
) => {
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
		},
		label: {
			fontWeight: "bold",
			paddingRight: 5,
		},
		checkbox: {
			flex: 1,
		},
	});

	return (
		<View style={resultsStyle.resultsRowContainer}>
			<Image
				style={resultsStyle.thumbnail}
				source={sectionData.item.imageSrc}
			/>
			<View style={resultsStyle.informationContainer}>
				<View style={resultsStyle.detailsRow}>
					<Text style={resultsStyle.label}>Name:</Text>
					<Text>{sectionData.item.name}</Text>
				</View>

				<View style={resultsStyle.detailsRow}>
					<Text style={resultsStyle.label}>Address:</Text>
					<Text>{sectionData.item.address}</Text>
				</View>

				<View style={resultsStyle.detailsRow}>
					<Text style={resultsStyle.label}>Type:</Text>
					<Text>{sectionData.item.type}</Text>
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
	);
};

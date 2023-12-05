import { StatusBar } from "expo-status-bar";
import {
	SafeAreaView,
	StyleSheet,
	Platform,
	StatusBar as sb,
} from "react-native";
// import SerpAPIComponent from "./app/components/SerpApiComponent";
import YelpAPIComponent from "./app/components/YelpAPIComponent";

const styles = StyleSheet.create({
	androidSafeArea: {
		flex: 1,
		paddingTop: Platform.OS === "android" ? sb.currentHeight : 0,
	},
});

export default function App() {
	return (
		<SafeAreaView style={styles.androidSafeArea}>
			{/* <SerpAPIComponent /> */}
			<YelpAPIComponent />
			<StatusBar style="auto" />
		</SafeAreaView>
	);
}

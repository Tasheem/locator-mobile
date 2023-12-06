import { StatusBar } from "expo-status-bar";
import {
	SafeAreaView,
	View,
	StyleSheet,
	Platform,
	StatusBar as sb,
} from "react-native";
// import SerpAPIComponent from "./app/components/SerpApiComponent";
import YelpAPIComponent from "./app/components/YelpAPIComponent";
import LoginComponent from "./app/components/LoginComponent";

const styles = StyleSheet.create({
	androidSafeArea: {
		flex: 1,
		paddingTop: Platform.OS === "android" ? sb.currentHeight : 0,
	},
});

export default function App() {
	return (
		<View>
			{/* <SerpAPIComponent /> */}
			{/* <YelpAPIComponent /> */}
			<LoginComponent />
			<StatusBar style="auto" />
		</View>
	);
}

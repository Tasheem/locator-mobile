import { StatusBar } from "expo-status-bar";
import {
	View,
	StatusBar as sb,
} from "react-native";
// import SerpAPIComponent from "./app/components/SerpApiComponent";
import YelpAPIComponent from "./app/components/YelpAPIComponent";
import LoginComponent from "./app/components/LoginComponent";

export default function App() {
	return (
		<View>
			{/* <SerpAPIComponent /> */}
			<YelpAPIComponent />
			{/* <LoginComponent /> */}
			<StatusBar style="auto" />
		</View>
	);
}

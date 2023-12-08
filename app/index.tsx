import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import LoginComponent from "./login";

export default function App() {
	return (
		<View>
			<LoginComponent />
			<StatusBar style="auto" />
		</View>
	);
}

import { StatusBar } from "expo-status-bar";
import LoginComponent from "./app/login";
import { NavigationContainer } from "@react-navigation/native";
import { NativeStackScreenProps, createNativeStackNavigator } from "@react-navigation/native-stack";
import YelpAPIComponent from "./app/yelp";

export type RootStackParamList = {
	Login: undefined;
	Search: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
	return (
		<NavigationContainer>
			<Stack.Navigator initialRouteName="Login">
				<Stack.Screen name="Login" component={LoginComponent} />
				<Stack.Screen name="Search" component={YelpAPIComponent} />
			</Stack.Navigator>
			<StatusBar style="auto" />
		</NavigationContainer>
	);
}

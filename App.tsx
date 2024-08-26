import { StatusBar } from "expo-status-bar";
import LoginComponent from "./app/screens/LoginScreen";
import { NavigationContainer } from "@react-navigation/native";
import { NativeStackScreenProps, createNativeStackNavigator } from "@react-navigation/native-stack";
import YelpAPIComponent from "./app/screens/SearchScreen";
import RoomsScreen from "./app/screens/RoomsScreen";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
	return (
		<NavigationContainer>
			{/* <Stack.Navigator initialRouteName="Login">
				<Stack.Screen name="Login" component={LoginComponent} />
				<Stack.Screen name="Search" component={YelpAPIComponent} />
			</Stack.Navigator> */}
			<Stack.Navigator initialRouteName="Rooms">
				<Stack.Screen name="Rooms" component={ RoomsScreen } />
			</Stack.Navigator>
			<StatusBar style="auto" />
		</NavigationContainer>
	);
}

type RootStackParamList = {
	Login: undefined;
	Search: undefined;
	Rooms: undefined;
};
type LoginNavigationProps = NativeStackScreenProps<RootStackParamList, "Login">;
type HomeNavigationProps = NativeStackScreenProps<RootStackParamList, "Rooms">;

export { RootStackParamList, LoginNavigationProps, HomeNavigationProps }
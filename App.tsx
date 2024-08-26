import { StatusBar } from "expo-status-bar";
import LoginComponent from "./app/screens/LoginScreen";
import { NavigationContainer } from "@react-navigation/native";
import { NativeStackScreenProps, createNativeStackNavigator } from "@react-navigation/native-stack";
import YelpAPIComponent from "./app/screens/SearchScreen";
import RoomsScreen from "./app/screens/RoomsScreen";
import Logo from "./app/components/Logo";
import { Button, TouchableHighlight } from "react-native";
import LokatorButton from "./app/components/LokatorButton";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
	return (
		<NavigationContainer>
			{/* <Stack.Navigator initialRouteName="Login">
				<Stack.Screen name="Login" component={LoginComponent} />
				<Stack.Screen name="Search" component={YelpAPIComponent} />
			</Stack.Navigator> */}
			<Stack.Navigator initialRouteName="Rooms">
				<Stack.Screen name="Rooms" component={ RoomsScreen }
				options={{
					/* headerTitle: () => <Logo height={30} width={30} />, */
					headerLeft: () => {
						return (
							<LokatorButton type="Secondary" textValue="New Room" handler={() => {}} />
						);
					}
				}} />
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
type RoomsNavigationProps = NativeStackScreenProps<RootStackParamList, "Rooms">;

export { RootStackParamList, LoginNavigationProps, RoomsNavigationProps }
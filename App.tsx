import { StatusBar } from "expo-status-bar";
import LoginComponent from "./app/screens/LoginScreen";
import { NavigationContainer } from "@react-navigation/native";
import { NativeStackScreenProps, createNativeStackNavigator } from "@react-navigation/native-stack";
import YelpAPIComponent from "./app/screens/SearchScreen";
import RoomsScreen from "./app/screens/RoomsScreen";
import Logo from "./app/components/Logo";
import { Button, TouchableHighlight } from "react-native";
import LokatorButton from "./app/components/LokatorButton";
import RoomDetailsScreen from "./app/screens/RoomDetailsScreen";
import { BRAND_RED } from "./app/constants/colors";
import { useState } from "react";
import { AuthService } from "./app/services/auth-service";

const Stack = createNativeStackNavigator<RootStackParamList>();
const authService = new AuthService();

export default function App() {
	const [userToken, setUserToken] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [isSignout, setIsSignout] = useState<boolean>(false);

	return (
		<NavigationContainer>
			{
				userToken ? (
					<Stack.Navigator initialRouteName="Rooms"
					screenOptions={{
						headerTitleStyle: {
							color: BRAND_RED
						}
					}}>
						<Stack.Screen name="Rooms" component={ RoomsScreen }
						options={{
							/* headerTitle: () => <Logo height={30} width={30} />, */
							headerLeft: () => {
								return (
									<LokatorButton type="Secondary" textValue="New Room" handler={() => {}} />
								);
							},
							headerRight: () => {
								return (
									<LokatorButton type="Secondary" textValue="Log Out" handler={async () => {
										await authService.logout();
										setUserToken(null);
									}} />
								);
							}
						}} />
	
						<Stack.Screen name="RoomDetails" component={ RoomDetailsScreen }
						options={{
							title: 'Room'
						}} />
					</Stack.Navigator>
				) : (
					<Stack.Navigator initialRouteName="Login">
						<Stack.Screen name="Login" component={LoginComponent} initialParams={{
							"setUserToken": setUserToken
						}} />
						<Stack.Screen name="Search" component={YelpAPIComponent} />
					</Stack.Navigator>
				)
			}
			
			<StatusBar style="auto" />
		</NavigationContainer>
	);
}

type RootStackParamList = {
	Login: {
		setUserToken: React.Dispatch<React.SetStateAction<string | null>>
	};
	Search: undefined;
	Rooms: undefined;
	RoomDetails: {
		roomId: number
	}
};
type LoginNavigationProps = NativeStackScreenProps<RootStackParamList, "Login">;
type RoomsNavigationProps = NativeStackScreenProps<RootStackParamList, "Rooms">;

export { RootStackParamList, LoginNavigationProps, RoomsNavigationProps }
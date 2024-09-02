import { StatusBar } from "expo-status-bar";
import LoginComponent from "./app/screens/LoginScreen";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
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
import RegisterScreen from "./app/screens/RegisterScreen";
import { User } from "./app/models/user";

const Stack = createNativeStackNavigator<RootStackParamList>();
const authService = new AuthService();

export default function App() {
	const [authToken, setAuthToken] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [isSignout, setIsSignout] = useState<boolean>(false);
	const [user, setUser] = useState<User | null>(null);

	return (
		<NavigationContainer>
			{
				authToken ? (
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
										setAuthToken(null);
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
							setAuthToken: setAuthToken,
							setUser: setUser
						}} />
						<Stack.Screen name="Register" component={RegisterScreen} />
					</Stack.Navigator>
				)
			}
			
			<StatusBar style="auto" />
		</NavigationContainer>
	);
}

type RootStackParamList = {
	Login: {
		setAuthToken: React.Dispatch<React.SetStateAction<string | null>>
		setUser: React.Dispatch<React.SetStateAction<User | null>>
	};
	Search: undefined;
	Rooms: undefined;
	RoomDetails: {
		roomId: number
	},
	Register: undefined
};
type LoginNavigationProps = NativeStackScreenProps<RootStackParamList, "Login">;
type RoomsNavigationProps = NativeStackScreenProps<RootStackParamList, "Rooms">;

export { RootStackParamList, LoginNavigationProps, RoomsNavigationProps }
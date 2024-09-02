import { StatusBar } from "expo-status-bar";
import LoginComponent from "./app/screens/LoginScreen";
import { NavigationContainer } from "@react-navigation/native";
import { NativeStackScreenProps, createNativeStackNavigator } from "@react-navigation/native-stack";
import RoomsScreen from "./app/screens/RoomsScreen";
import LokatorButton from "./app/components/LokatorButton";
import RoomDetailsScreen from "./app/screens/RoomDetailsScreen";
import { BRAND_RED } from "./app/constants/colors";
import { userObservable, logout } from "./app/services/auth-service";
import RegisterScreen from "./app/screens/RegisterScreen";
import { User } from "./app/models/user";
import { useEffect, useState } from "react";
import { Room } from "./app/models/room";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
	const [user, setUser] = useState<User | null>(null);
	
	useEffect(() => {
		const userSubscription = userObservable().subscribe((nextValue) => {
			// console.log("User emitted:", nextValue);
			setUser(nextValue);
		});

		return () => {
			userSubscription.unsubscribe();
		};
	}, []);

	return (
		<NavigationContainer>
			{
				user ? (
					<Stack.Navigator initialRouteName="Rooms"
					screenOptions={{
						headerTitleStyle: {
							color: BRAND_RED
						}
					}}>
						<Stack.Screen name="Rooms" component={ RoomsScreen }
						options={{
							/* headerTitle: () => <Logo height={30} width={30} />, */
							headerRight: () => {
								return (
									<LokatorButton type="Secondary" textValue="Log Out" handler={() => {
										logout();
									}} />
								);
							}
						}} />
	
						<Stack.Screen name="RoomDetails" component={ RoomDetailsScreen }
						options={(options) => ({
							title: options.route.params.room.name
						})} />
					</Stack.Navigator>
				) : (
					<Stack.Navigator initialRouteName="Login">
						<Stack.Screen name="Login" component={LoginComponent} />
						<Stack.Screen name="Register" component={RegisterScreen} />
					</Stack.Navigator>
				)
			}
			
			<StatusBar style="auto" />
		</NavigationContainer>
	);
}

type RootStackParamList = {
	Login: undefined
	Search: undefined
	Rooms: undefined
	RoomDetails: {
		room: Room
	}
	Register: undefined
	Chat: undefined
};
type LoginNavigationProps = NativeStackScreenProps<RootStackParamList, "Login">;
type RoomsNavigationProps = NativeStackScreenProps<RootStackParamList, "Rooms">;

export { RootStackParamList, LoginNavigationProps, RoomsNavigationProps }
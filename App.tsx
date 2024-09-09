import { StatusBar } from "expo-status-bar";
import LoginComponent from "./app/screens/LoginScreen";
import { NavigationContainer } from "@react-navigation/native";
import { NativeStackScreenProps, createNativeStackNavigator } from "@react-navigation/native-stack";
import RegisterScreen from "./app/screens/RegisterScreen";
import { User } from "./app/models/user";
import { useEffect, useState } from "react";
import { Room } from "./app/models/room";
import * as encoding from "text-encoding" // Needed for stompjs library
import { userObservable } from "./app/utils/requestUtil";
import { AutocompleteDropdownContextProvider } from "react-native-autocomplete-dropdown";
import HomeScreen from "./app/screens/HomeScreen";

global.TextEncoder = encoding.TextEncoder

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
		<AutocompleteDropdownContextProvider>
			<NavigationContainer>
				{
					user ? (
						<Stack.Navigator>
							<Stack.Screen name="Home" component={HomeScreen} initialParams={{
								user: user
							}}
							options={{
								headerShown: false
							}} />
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
		</AutocompleteDropdownContextProvider>
	);
}

type RootStackParamList = {
	Home: {
		user: User
	}
	Login: undefined
	Search: undefined
	Register: undefined
	RoomsStack: {
        user: User
        room: Room
    }
    Notifications: {
        user: User
    }
    Rooms: {
        user: User
    }
    RoomDetails: {
		room: Room,
		user: User
	}
};
type LoginNavigationProps = NativeStackScreenProps<RootStackParamList, "Login">;

export { RootStackParamList, LoginNavigationProps }
import { StatusBar } from 'expo-status-bar';
import LoginComponent from './app/screens/LoginScreen';
import { NavigationContainer, NavigationProp, ParamListBase, RouteProp } from '@react-navigation/native';
import { NativeStackScreenProps, createNativeStackNavigator } from '@react-navigation/native-stack';
import RegisterScreen from './app/screens/RegisterScreen';
import { User } from './app/models/user';
import { useEffect, useState } from 'react';
import { Room } from './app/models/room';
import * as encoding from 'text-encoding' // Needed for stompjs library
import { userObservable } from './app/utils/requestUtil';
import { AutocompleteDropdownContextProvider } from 'react-native-autocomplete-dropdown';
import * as Location from 'expo-location';
import { Alert } from 'react-native';
import { createDrawerNavigator, DrawerNavigationProp } from '@react-navigation/drawer';
import HomeDrawer from './app/screens/HomeDrawer';
import PreferencesScreen from './app/screens/PreferencesScreen';
import { BRAND_RED } from './app/constants/colors';

global.TextEncoder = encoding.TextEncoder

const Drawer = createDrawerNavigator<RootStackParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
	const [user, setUser] = useState<User | null>(null);
	
	useEffect(() => {
		const userSubscription = userObservable().subscribe((nextValue) => {
			// console.log('User emitted:', nextValue);
			setUser(nextValue);
		});

		checkLocationPermissions();
		return () => {
			userSubscription.unsubscribe();
		};
	}, []);

	return (
		<AutocompleteDropdownContextProvider>
			<NavigationContainer>
				{
					user ? (
						<Drawer.Navigator initialRouteName='Home'>
							<Drawer.Screen name='HomeDrawer' 
								component={HomeDrawer} 
								initialParams={{
									user: user
								}}
								options={{
									drawerLabel: 'Home',
									headerTitle: 'Home',
									headerTintColor: BRAND_RED
								}}
							/>

							<Drawer.Screen
								name='Preferences'
								component={PreferencesScreen}
								initialParams={{
									user: user
								}}
								options={{
									headerTintColor: BRAND_RED
								}}
							/>
						</Drawer.Navigator>
					) : (
						<Stack.Navigator initialRouteName='Login'>
							<Stack.Screen name='Login' component={LoginComponent} />
							<Stack.Screen name='Register' component={RegisterScreen} />
						</Stack.Navigator>
					)
				}
				
				<StatusBar style='auto' />
			</NavigationContainer>
		</AutocompleteDropdownContextProvider>
	);
}

const checkLocationPermissions = async () => {
	const { status } = await Location.getForegroundPermissionsAsync();
	console.log('Saved status: ' + status);

	if(status !== 'granted') {
		const permissionResponse = await Location.requestForegroundPermissionsAsync();
		console.log('Status after request: ' + permissionResponse.status);
		if(permissionResponse.status !== 'granted') {
			Alert.alert('Location', 'The recommendation feature of this app will not operate correctly without location permissions.');
		}
	}
}

type RootStackParamList = {
	HomeDrawer: {
		user: User
	},
	Home: {
		user: User
	}
	Preferences: {
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
type LoginNavigationProps = NativeStackScreenProps<RootStackParamList, 'Login'>;

export { RootStackParamList, LoginNavigationProps }
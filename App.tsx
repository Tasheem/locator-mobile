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
import { Alert, StyleSheet, View } from 'react-native';
import { createDrawerNavigator, DrawerNavigationProp } from '@react-navigation/drawer';
import HomeDrawer from './app/screens/HomeDrawer';
import PreferencesScreen from './app/screens/PreferencesScreen';
import { BRAND_RED } from './app/constants/colors';
import LocatorButton from './app/components/LocatorButton';
import { logout } from './app/services/auth-service';
import { UserContext } from './app/utils/context';

global.TextEncoder = encoding.TextEncoder

const Drawer = createDrawerNavigator<RootStackParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
	const [user, setUser] = useState<User | null>(null);
	
	useEffect(() => {
		const userSubscription = userObservable().subscribe((nextValue) => {
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
						<UserContext.Provider value={user}>
							<Drawer.Navigator initialRouteName='Home'>
								<Drawer.Screen name='HomeDrawer' 
									component={HomeDrawer}
									options={{
										drawerLabel: 'Home',
										headerTitle: 'Home',
										headerTintColor: BRAND_RED,
										headerRight: () => {
											return (
												<View
													style={style.logoutBtnContainer}
												>
													<LocatorButton
														type='Secondary'
														textValue='Log Out'
														handler={() => {
															logout();
														}}
													/>
												</View>
											);
										}
									}}
								/>

								<Drawer.Screen
									name='Preferences'
									component={PreferencesScreen}
									options={{
										headerTintColor: BRAND_RED,
										headerRight: () => {
											return (
												<View
													style={style.logoutBtnContainer}
												>
													<LocatorButton
														type='Secondary'
														textValue='Log Out'
														handler={() => {
															logout();
														}}
													/>
												</View>
											)
										}
									}}
								/>
							</Drawer.Navigator>
						</UserContext.Provider>
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

	if(status !== 'granted') {
		const permissionResponse = await Location.requestForegroundPermissionsAsync();
		if(permissionResponse.status !== 'granted') {
			Alert.alert('Location', 'The recommendation feature of this app will not operate correctly without location permissions.');
		}
	}
}

type RootStackParamList = {
	HomeDrawer: undefined
	Home: undefined
	Preferences: undefined
	Login: undefined
	Search: undefined
	Register: undefined
	RoomsStack: {
        room: Room
    }
    Notifications: undefined
    Rooms: undefined
    RoomDetails: {
		room: Room
	}
};
type LoginNavigationProps = NativeStackScreenProps<RootStackParamList, 'Login'>;

const style = StyleSheet.create({
	logoutBtnContainer: {
		marginRight: 10
	}
});

export { RootStackParamList, LoginNavigationProps }
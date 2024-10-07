import { StatusBar } from 'expo-status-bar';
import LoginComponent from './app/screens/LoginScreen';
import { NavigationContainer } from '@react-navigation/native';
import { NativeStackScreenProps, createNativeStackNavigator } from '@react-navigation/native-stack';
import RegisterScreen from './app/screens/RegisterScreen';
import { User } from './app/models/user';
import { useEffect, useState } from 'react';
import { Room } from './app/models/room';
import * as encoding from 'text-encoding' // Needed for stompjs library
import { userObservable } from './app/utils/requestUtil';
import { Dimensions, Image, StyleSheet, View } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import HomeDrawer from './app/screens/HomeDrawer';
import PreferencesScreen from './app/screens/PreferencesScreen';
import { BRAND_RED } from './app/constants/colors';
import LocatorButton from './app/components/LocatorButton';
import { logout } from './app/services/auth-service';
import { UserContext, ScreenContext } from './app/utils/context';
import PhotosScreen from './app/screens/PhotosScreen';
import { TouchableOpacity } from 'react-native-gesture-handler';

global.TextEncoder = encoding.TextEncoder

const Drawer = createDrawerNavigator<RootStackParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();

const screenHeight = Dimensions.get('screen').height;
const screenWidth = Dimensions.get('screen').width;

// 914 & 411, the height & width of the pixel 8, are arbitrarily chosen as the standards.
const standardHeight = 914;
const standardWidth = 411;
const heightRatio = screenHeight / standardHeight;
const widthRatio = screenWidth / standardWidth;

export default function App() {
	const [user, setUser] = useState<User | null>(null);
	const [displayingLogout, setDisplayingLogout] = useState(false);

	
	useEffect(() => {
		const userSubscription = userObservable().subscribe((nextValue) => {
			setUser(nextValue);
		});

		return () => {
			userSubscription.unsubscribe();
		};
	}, []);

	const headerRightView = () => {
		return (
			<View
				style={style.logoutBtnContainer}
			>
				<TouchableOpacity
					onPress={() => {
						setDisplayingLogout(!displayingLogout);
					}}
				>
					<Image
						source={user?.profilePictureUrl ? { uri: user.profilePictureUrl } : require('./app/assets/no-profile-pic.png')}
						style={{
							width: 30,
							height: 30,
							borderRadius: 40,
							borderWidth: 2,
							borderColor: 'black',
							marginRight: displayingLogout ? 0 : 5
						}}
					/>
				</TouchableOpacity>
				{
					displayingLogout ? (
						<LocatorButton
							type='Secondary'
							textValue='Log Out'
							handler={() => {
								setDisplayingLogout(false);
								logout();
							}}
						/>
					) : null
				}
			</View>
		)
	};

	return (
		<NavigationContainer>
			{
				user ? (
					<UserContext.Provider value={[user, setUser]}>
						<ScreenContext.Provider
							value={{
								height: screenHeight,
								width: screenWidth,
								heightRatio: heightRatio,
								widthRatio: widthRatio
							}}
						>
							<Drawer.Navigator initialRouteName='Home'>
								<Drawer.Screen name='HomeDrawer'
									component={HomeDrawer}
									options={{
										drawerLabel: 'Home',
										headerTitle: 'Home',
										headerTintColor: BRAND_RED,
										headerRight: headerRightView
									}}
								/>

								<Drawer.Screen
									name='Preferences'
									component={PreferencesScreen}
									options={{
										headerTintColor: BRAND_RED,
										headerRight: headerRightView
									}}
								/>

								<Drawer.Screen
									name='Photos'
									component={PhotosScreen}
									options={{
										headerTintColor: BRAND_RED,
										headerRight: headerRightView
									}}
								/>
							</Drawer.Navigator>
						</ScreenContext.Provider>
					</UserContext.Provider>
				) : (
					<ScreenContext.Provider
						value={{
							height: screenHeight,
							width: screenWidth,
							heightRatio: heightRatio,
							widthRatio: widthRatio
						}}
					>
						<Stack.Navigator initialRouteName='Login'>
							<Stack.Screen
								name='Login'
								component={LoginComponent}
								options={{
									headerTintColor: BRAND_RED,
									headerTitleStyle: {
										fontSize: 16 * widthRatio
									}
								}}
							/>
							<Stack.Screen
								name='Register'
								component={RegisterScreen}
								options={{
									headerTintColor: BRAND_RED
								}}
							/>
						</Stack.Navigator>
					</ScreenContext.Provider>
				)
			}
			
			<StatusBar style='auto' />
		</NavigationContainer>
	);
}

type RootStackParamList = {
	HomeDrawer: undefined
	Home: undefined
	Preferences: undefined
	Photos: undefined
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
		marginRight: 10,
		flexDirection: 'row',
		alignItems: 'center',
		gap: 10
	}
});

export { RootStackParamList, LoginNavigationProps }
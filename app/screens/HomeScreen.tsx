import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { RouteProp } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import RoomsScreen from './RoomsScreen';
import NotificationScreen from './NotificationScreen';
import { BRAND_RED } from '../constants/colors';
import LokatorButton from '../components/LokatorButton';
import { logout } from '../services/auth-service';
import RoomDetailsScreen from './RoomDetailsScreen';
import Ionicons from 'react-native-vector-icons/Ionicons'
import { useEffect, useState } from 'react';
import { disconnectNotificationSocket, establishNotificationsConnection, notificationObservable } from '../services/room-service';

type Props = {
    route: RouteProp<RootStackParamList, 'Home'>
}

const Tab = createBottomTabNavigator<RootStackParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();
export default function HomeScreen({ route }: Props) {
    const user = route.params.user;
    const [notificationCount, setNotificationCount] = useState(0);

    useEffect(() => {
        if(!user.id) {
            return;
        }

        establishNotificationsConnection(user.id);
        const subscription = notificationObservable().subscribe(joinRequests => {
            setNotificationCount(joinRequests.length);
        });

        return () => {
            subscription.unsubscribe();
            disconnectNotificationSocket();
        }
    }, []);

    return (
        <Tab.Navigator
        screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;
  
              if (route.name === 'RoomsStack') {
                iconName = focused
                  ? 'home'
                  : 'home-outline';
              } else {
                iconName = focused ? 'notifications' : 'notifications-outline';
              }
  
              // You can return any component that you like here!
              return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: BRAND_RED,
            tabBarInactiveTintColor: 'gray',
        })}
        >
            <Tab.Screen name='RoomsStack' component={RoomsStack} initialParams={{
                user: user
            }}
            options={{
                headerShown: false,
                title: 'Rooms'
            }} />
            <Tab.Screen name='Notifications' component={NotificationScreen} initialParams={{
                user: user
            }} options={{
                headerTintColor: BRAND_RED,
                tabBarBadge: notificationCount > 0 ? notificationCount : undefined
            }} />
        </Tab.Navigator>
    );
}

type RoomStackProp = {
    route: RouteProp<RootStackParamList, 'RoomsStack'>
}

const RoomsStack = ({ route }: RoomStackProp) => {
    return (
        <Stack.Navigator initialRouteName='Rooms'
        screenOptions={{
            headerTitleStyle: {
                color: BRAND_RED
            }
        }}>
            <Stack.Screen name='Rooms' component={ RoomsScreen } initialParams={{
                user: route.params.user
            }}
            options={{
                /* headerTitle: () => <Logo height={30} width={30} />, */
                headerRight: () => {
                    return (
                        <LokatorButton type='Secondary' textValue='Log Out' handler={() => {
                            logout();
                        }} />
                    );
                }
            }} />

            <Stack.Screen name='RoomDetails' component={ RoomDetailsScreen }
            options={(options) => ({
                title: options.route.params.room.name,
                headerTintColor: BRAND_RED
            })} />
        </Stack.Navigator>
    );
}
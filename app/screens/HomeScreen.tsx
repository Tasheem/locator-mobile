import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { NavigationProp, RouteProp } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import RoomsScreen from './RoomsScreen';
import NotificationScreen from './NotificationScreen';
import { BRAND_RED } from '../constants/colors';
import LocatorButton from '../components/LocatorButton';
import { logout } from '../services/auth-service';
import RoomDetailsScreen from './RoomDetailsScreen';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useContext, useEffect, useState } from 'react';
import {
  disconnectNotificationSocket,
  emitJoinRequests,
  establishNotificationsConnection,
  getJoinRoomRequests,
  notificationObservable,
} from '../services/room-service';
import { JoinRoom } from '../models/room';
import { ScreenContext, UserContext } from '../utils/context';

type Props = {
  route: RouteProp<RootStackParamList, 'Home'>
  navigation: NavigationProp<RootStackParamList, 'Home'>
};

const Tab = createBottomTabNavigator<RootStackParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();
export default function HomeScreen({ route, navigation }: Props) {
  const { heightRatio, widthRatio } = useContext(ScreenContext);
  const [user, setUser] = useContext(UserContext);
  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    if (!user || !user.id) {
      return;
    }

    getJoinRoomRequests()
    .then((res) => res.json())
    .then((joinRequests: JoinRoom[]) => {
      emitJoinRequests(joinRequests);
    })
    .catch((err) => {
      // console.log(err);
    });

    establishNotificationsConnection(user.id);
    const subscription = notificationObservable().subscribe((joinRequests) => {
      setNotificationCount(joinRequests.length);
    });

    return () => {
      subscription.unsubscribe();
      disconnectNotificationSocket();
    };
  }, []);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'RoomsStack') {
            iconName = focused ? 'home' : 'home-outline';
          } else {
            iconName = focused ? 'notifications' : 'notifications-outline';
          }

          return <Ionicons name={iconName} size={size * heightRatio} color={color} />;
        },
        tabBarActiveTintColor: BRAND_RED,
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          height: 50 * heightRatio
        },
        tabBarIconStyle: {
          width: widthRatio > 1.5 ? (25 * widthRatio) : undefined
        },
        tabBarLabelStyle: {
          fontSize: 10 * widthRatio
        }
      })}
    >
      <Tab.Screen
        name='RoomsStack'
        component={RoomsStack}
        options={{
          headerShown: false,
          title: 'Rooms'
        }}
      />
      <Tab.Screen
        name='Notifications'
        component={NotificationScreen}
        options={{
          headerTintColor: BRAND_RED,
          tabBarBadge: notificationCount > 0 ? notificationCount : undefined,
          headerShown: false
        }}
      />
    </Tab.Navigator>
  );
}

type RoomStackProp = {
  route: RouteProp<RootStackParamList, 'RoomsStack'>
  navigation: NavigationProp<RootStackParamList, 'RoomsStack'>
};

const RoomsStack = ({ route, navigation }: RoomStackProp) => {
  return (
    <Stack.Navigator
      initialRouteName='Rooms'
      screenOptions={{
        headerTitleStyle: {
          color: BRAND_RED
        },
      }}
    >
      <Stack.Screen
        name='Rooms'
        component={RoomsScreen}
        options={{
          /* headerTitle: () => <Logo height={30} width={30} />, */
          headerTitleAlign: 'center',
          headerShown: false
        }}
      />

      <Stack.Screen
        name='RoomDetails'
        component={RoomDetailsScreen}
        options={(options) => ({
          title: options.route.params.room.name,
          headerTintColor: BRAND_RED,
          headerShown: false
        })}
      />
    </Stack.Navigator>
  );
};

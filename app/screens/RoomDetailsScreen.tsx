import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import ChatScreen from './ChatScreen';
import RecommendationScreen from './RecommendationScreen';
import { BRAND_RED } from '../constants/colors';
import { RootStackParamList } from '../../App';
import { Room } from '../models/room';
import { User } from '../models/user';
import ParticipantsScreen from './ParticipantsScreen';
import { NavigationProp, RouteProp } from '@react-navigation/native';
import { useContext } from 'react';
import { UserContext } from '../utils/context';

type Props = {
    route: RouteProp<RootStackParamList, 'RoomDetails'>,
    navigation: NavigationProp<RootStackParamList, 'RoomDetails'>
}

export type RoomDetailsParamList = {
    Participants: {
        room: Room
    },
    Chat: {
        room: Room
    }
    Recommended: {
        room: Room
    }
}
const Tab = createMaterialTopTabNavigator<RoomDetailsParamList>();

export default function RoomDetailsScreen({ route }: Props) {
    const user = useContext(UserContext);
    const room = route.params.room;

    return (
        <Tab.Navigator
        screenOptions={{
            tabBarIndicatorStyle: {
                backgroundColor: BRAND_RED
            },
            tabBarLabelStyle: {
                color: BRAND_RED
            }
        }} >
            <Tab.Screen name='Participants' component={ ParticipantsScreen } initialParams={{
                room: room
            }} />
            <Tab.Screen name='Chat' component={ ChatScreen } initialParams={{
                room: room
            }} />
            <Tab.Screen name='Recommended' component={ RecommendationScreen } initialParams={{
                room: room
            }} options={{
                tabBarLabel: 'Food'
            }} />
        </Tab.Navigator>
    );
}

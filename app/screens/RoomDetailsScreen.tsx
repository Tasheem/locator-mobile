import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import ChatScreen from './ChatScreen';
import RecommendationScreen from './RecommendationScreen';
import { BRAND_RED } from '../constants/colors';
import { RootStackParamList } from '../../App';
import { Room } from '../models/room';
import ParticipantsScreen from './ParticipantsScreen';
import { NavigationProp, RouteProp } from '@react-navigation/native';
import { useContext, useState } from 'react';
import { BlockedContext, UserContext } from '../utils/context';
import { Blocked } from '../models/user';

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
    const [blockedUsers, setBlockedUsers] = useState<Map<number, Blocked>>(new Map());
    const room = route.params.room;

    return (
        <BlockedContext.Provider value={[blockedUsers, setBlockedUsers]}>
            <Tab.Navigator
            screenOptions={{
                tabBarIndicatorStyle: {
                    backgroundColor: BRAND_RED
                },
                tabBarLabelStyle: {
                    color: BRAND_RED
                }
            }}>
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
        </BlockedContext.Provider>
    );
}

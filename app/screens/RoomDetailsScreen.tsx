import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import ChatScreen from "./ChatScreen";
import RecommendationScreen from "./RecommendationScreen";
import { BRAND_RED } from "../constants/colors";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../App";
import { Room } from "../models/room";
import { User } from "../models/user";

export type RoomDetailsParamList = {
    Chat: {
        room: Room,
        user: User
    }
    Recommendation: undefined
}
const Tab = createMaterialTopTabNavigator<RoomDetailsParamList>();

export default function RoomDetailsScreen({ route }: Props) {
    const room = route.params.room;
    const user = route.params.user;

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
            {/* <Tab.Screen name="Participants" component={ ParticipantsScreen } /> */}
            <Tab.Screen name="Chat" component={ ChatScreen } initialParams={{
                room: room,
                user: user
            }} />
            <Tab.Screen name="Recommendation" component={ RecommendationScreen } />
        </Tab.Navigator>
    );
}

type Props = NativeStackScreenProps<RootStackParamList, "RoomDetails">;

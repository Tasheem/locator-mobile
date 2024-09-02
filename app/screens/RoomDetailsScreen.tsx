import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import ParticipantsScreen from "./ParticipantsScreen";
import ChatScreen from "./ChatScreen";
import RecommendationScreen from "./RecommendationScreen";
import { BRAND_RED } from "../constants/colors";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../App";
import { createContext } from "react";
import { Room } from "../models/room";

export const RoomContext = createContext<Room | null>(null);
const Tab = createMaterialTopTabNavigator();

export default function RoomDetailsScreen({ route }: Props) {
    const room = route.params.room;

    return (
        <RoomContext.Provider value={room}>
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
                <Tab.Screen name="Chat" component={ ChatScreen } />
                <Tab.Screen name="Recommendation" component={ RecommendationScreen } />
            </Tab.Navigator>
        </RoomContext.Provider>
    );
}

type Props = NativeStackScreenProps<RootStackParamList, "RoomDetails">;

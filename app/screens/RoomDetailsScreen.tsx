import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import ParticipantsScreen from "./ParticipantsScreen";
import ChatScreen from "./ChatScreen";
import RecommendationScreen from "./RecommendationScreen";
import { BRAND_RED } from "../constants/colors";

const Tab = createMaterialTopTabNavigator();

export default function RoomDetailsScreen() {
    return (
        <Tab.Navigator
        screenOptions={{
            tabBarIndicatorStyle: {
                backgroundColor: BRAND_RED
            },
            tabBarLabelStyle: {
                color: BRAND_RED
            }
        }}>
            {/* <Tab.Screen name="Participants" component={ ParticipantsScreen } /> */}
            <Tab.Screen name="Chat" component={ ChatScreen } />
            <Tab.Screen name="Recommendation" component={ RecommendationScreen } />
        </Tab.Navigator>
    );
}
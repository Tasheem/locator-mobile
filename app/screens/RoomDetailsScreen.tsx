import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import ParticipantsScreen from "./ParticipantsScreen";
import ChatScreen from "./ChatScreen";
import RecommendationScreen from "./RecommendationScreen";

const Tab = createMaterialTopTabNavigator();

export default function RoomDetailsScreen() {
    return (
        <Tab.Navigator>
            {/* <Tab.Screen name="Participants" component={ ParticipantsScreen } /> */}
            <Tab.Screen name="Chat" component={ ChatScreen } />
            <Tab.Screen name="Recommendation" component={ RecommendationScreen } />
        </Tab.Navigator>
    );
}
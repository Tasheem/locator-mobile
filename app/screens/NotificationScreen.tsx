import { NavigationProp, RouteProp } from "@react-navigation/native"
import { View } from "react-native";
import { RootStackParamList } from "../../App";

type Props = {
    route: RouteProp<RootStackParamList, "Notifications">,
    navigation: NavigationProp<RootStackParamList, "Notifications">
}

export default function NotificationScreen({ route, navigation }: Props) {
    return (
        <View></View>
    );
}
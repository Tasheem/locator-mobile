import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../App";
import HomeScreen from "./HomeScreen";
import { RouteProp } from "@react-navigation/native";
import { DrawerNavigationProp } from '@react-navigation/drawer'
import { createContext } from "react";

type Props = {
    route: RouteProp<RootStackParamList, 'HomeDrawer'>
    navigation: DrawerNavigationProp<RootStackParamList, 'HomeDrawer'>
}

const Stack = createNativeStackNavigator<RootStackParamList>();
export const DrawerContext = createContext<DrawerNavigationProp<RootStackParamList, "HomeDrawer"> | null>(null);

export default function HomeDrawer({ route, navigation }: Props) {
    const user = route.params.user;

    console.log('Logging navigation');
    console.log(navigation);
    return (
        <DrawerContext.Provider value={navigation}>
            <Stack.Navigator>
                <Stack.Screen name='Home' component={HomeScreen} initialParams={{
                    user: user
                }}
                options={{
                    headerShown: false
                }} />
            </Stack.Navigator>
        </DrawerContext.Provider>
    );
}
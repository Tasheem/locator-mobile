import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../App";
import HomeScreen from "./HomeScreen";
import { RouteProp } from "@react-navigation/native";
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { DrawerContext, UserContext } from "../utils/context";
import { useContext } from "react";

type Props = {
    route: RouteProp<RootStackParamList, 'HomeDrawer'>
    navigation: DrawerNavigationProp<RootStackParamList, 'HomeDrawer'>
}

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function HomeDrawer({ route, navigation }: Props) {
    const [user, setUser] = useContext(UserContext);
    
    return (
        <DrawerContext.Provider value={navigation}>
            <Stack.Navigator>
                <Stack.Screen 
                    name='Home' 
                    component={HomeScreen}
                    options={{
                        headerShown: false
                    }}
                />
            </Stack.Navigator>
        </DrawerContext.Provider>
    );
}
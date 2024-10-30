import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../App";
import { RouteProp } from "@react-navigation/native";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { TouchableOpacity } from "react-native-gesture-handler";

type Props = {
    navigation: NativeStackNavigationProp<RootStackParamList, 'Account', undefined>
    route: RouteProp<RootStackParamList, 'Account'>
}

export default function AccountScreen({}: Props) {
    return (
        <SafeAreaView style={style.rootContainer}>
            <TouchableOpacity style={style.deleteBtn}>
                <Text style={style.deleteText}>Delete Account</Text>
            </TouchableOpacity>
        </SafeAreaView>
    )
}

const style = StyleSheet.create({
    rootContainer: {
        borderWidth: 2,
        height: '70%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    deleteBtn: {
        backgroundColor: 'red',
        padding: 15,
        borderRadius: 10
    },
    deleteText: {
        color: 'white'
    }
});
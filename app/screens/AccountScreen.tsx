import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../App";
import { RouteProp } from "@react-navigation/native";
import { ActivityIndicator, Alert, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { TouchableOpacity } from "react-native-gesture-handler";
import { deleteUser } from "../services/user-service";
import { emitToken, emitUser } from "../utils/requestUtil";
import { useState } from "react";
import { BRAND_RED } from "../constants/colors";

type Props = {
    navigation: NativeStackNavigationProp<RootStackParamList, 'Account', undefined>
    route: RouteProp<RootStackParamList, 'Account'>
}

export default function AccountScreen({}: Props) {
    const [loading, setLoading] = useState(false);

    const onDelete = () => {
        Alert.alert(
            'Delete Account',
            'Are you sure you want to delete your account? This action cannot be undone.',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            setLoading(true);
                            const response = await deleteUser();
    
                            if(response.ok) {
                                // Clear token and user object to log user out.
                                emitToken(null);
                                emitUser(null);
                            } else if(response.status === 401) {
                                Alert.alert('Error', 'Please log back in to delete your account.', [
                                    {
                                        text: 'OK',
                                        style: 'default'
                                    }
                                ]);
                            } else {
                                // This block should never be reached but it's here just in case.
                                Alert.alert('Error', 'An error occurred while deleting your account. Please try to delete later or report the problem to support.', [
                                    {
                                        text: 'OK',
                                        style: 'default'
                                    }
                                ]);
                            }
                        } catch (err) {
                            Alert.alert('Error', 'An error occurred while deleting your account. Please try to delete later or report the problem to support.', [
                                {
                                    text: 'OK',
                                    style: 'default'
                                }
                            ]);
                        } finally {
                            setLoading(false);
                        }
                    }
                }
            ]
        )
    }
    
    return (
        <SafeAreaView style={style.rootContainer}>
            {
                loading ? (
                    <ActivityIndicator
                        animating={loading}
                        color={BRAND_RED}
                    />
                ) : (
                    <TouchableOpacity style={style.deleteBtn} onPress={onDelete}>
                        <Text style={style.deleteText}>Delete Account</Text>
                    </TouchableOpacity>
                )
            }
        </SafeAreaView>
    )
}


const style = StyleSheet.create({
    rootContainer: {
        height: '90%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    deleteBtn: {
        backgroundColor: 'red',
        padding: 20,
        borderRadius: 10
    },
    deleteText: {
        color: 'white'
    }
});
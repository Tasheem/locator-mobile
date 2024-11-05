import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../App";
import { RouteProp } from "@react-navigation/native";
import { ActivityIndicator, Alert, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { TouchableOpacity } from "react-native-gesture-handler";
import { deleteUser } from "../services/user-service";
import { emitToken, emitUser } from "../utils/requestUtil";
import { useContext, useEffect, useState } from "react";
import { BRAND_RED } from "../constants/colors";
import { UserContext } from "../utils/context";
import moment from "moment-timezone";
import { getCalendars } from "expo-localization";

type Props = {
    navigation: NativeStackNavigationProp<RootStackParamList, 'Account', undefined>
    route: RouteProp<RootStackParamList, 'Account'>
}

export default function AccountScreen({}: Props) {
    const [user] = useContext(UserContext);
    const [loading, setLoading] = useState(false);
    const [timezone, setTimezone] = useState('UTC');

    useEffect(() => {
        const calendars = getCalendars();
        const firstCalendar = calendars[0];
        setTimezone(firstCalendar.timeZone ? firstCalendar.timeZone : 'UTC');
    }, []);

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
            <View style={style.formContainer}>
                <View style={style.rowContainer}>
                    <Text style={style.textLabel}>Username:</Text>
                    <TextInput
                        style={style.textBox}
                        value={user?.username}
                        editable={false}
                    />
                </View>
                <View style={style.rowContainer}>
                    <Text style={style.textLabel}>Email:</Text>
                    <TextInput
                        style={style.textBox}
                        value={user?.email}
                        editable={false}
                    />
                </View>
                <View style={style.rowContainer}>
                    <Text style={style.textLabel}>First Name:</Text>
                    <TextInput
                        style={style.textBox}
                        value={user?.firstname}
                        editable={false}
                    />
                </View>
                <View style={style.rowContainer}>
                    <Text style={style.textLabel}>Last Name:</Text>
                    <TextInput
                        style={style.textBox}
                        value={user?.lastname}
                        editable={false}
                    />
                </View>
                <View style={style.rowContainer}>
                    <Text style={style.textLabel}>Created:</Text>
                    <TextInput
                        style={style.textBox}
                        value={moment.utc(user?.createdAt).tz(timezone).format('LLL')}
                        editable={false}
                    />
                </View>
                <View style={style.rowContainer}>
                    <Text style={style.textLabel}>Last Login:</Text>
                    <TextInput
                        style={style.textBox}
                        value={moment.utc(user?.lastLogin).tz(timezone).format('LLL')}
                        editable={false}
                    />
                </View>
            </View>

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
    formContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        width: '90%',
        padding: 10,
        gap: 20,
        marginBottom: 15
    },
    rowContainer: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 10
    },
    textLabel: {
        fontWeight: 'bold',
        fontSize: 16
    },
    textBox: {
        width: '70%',
        height: 40,
        borderColor: BRAND_RED,
        borderWidth: 2,
        borderRadius: 25,
        paddingLeft: 10,
        paddingRight: 10
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
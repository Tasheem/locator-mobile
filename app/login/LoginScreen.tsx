import { StyleSheet, Text, TextInput, View, Dimensions, Image, TouchableHighlight } from "react-native";
import { RootStackParamList } from "../../App";
import { NativeStackNavigationProp, NativeStackScreenProps } from "@react-navigation/native-stack";

export default function LoginComponent(navigationProp: NativeStackScreenProps<RootStackParamList, "Login">) {
    return (
        <View style={styles.formContainer}>
            <Image style={{
                width: 100,
                height: 100
            }} source={require("../assets/locater_center_solid.png")} />
            <TextInput placeholder="Username" style={[styles.inputField, styles.usernameInput]} />
            <TextInput secureTextEntry={true} placeholder="Password" style={[styles.inputField, styles.passwordInput]} />

            { renderButton(navigationProp.navigation) }
        </View>
    )
}

const renderButton = (navigation: NativeStackNavigationProp<RootStackParamList, "Login", undefined>) => {
    return (
        <TouchableHighlight onPress={() => {
            navigation.navigate("Search");
        }} underlayColor="#965050" style={styles.btnContainer}>
            <Text style={{
                fontSize: 20,
                color: "white"
            }}>Log In</Text>
        </TouchableHighlight>
    )
}

const brandColor = "#c96b6b"
const styles = StyleSheet.create({
    logo: {
        width: 50,
        height: 50
    },
    formContainer: {
        height: "95%",
        justifyContent: "center",
        alignItems: "center",
        rowGap: 25
    },
    inputField: {
		borderColor: brandColor,
		borderWidth: 1,
		borderRadius: 8,
		height: 40,
        width: Dimensions.get("window").width - 80,
		paddingLeft: 5
	},
    usernameInput: {
    },
    passwordInput: {
    },
    btnContainer: {
        backgroundColor: brandColor,
        borderRadius: 8,
        paddingLeft: 25,
        paddingRight: 25,
        paddingTop: 7,
        paddingBottom: 7,
        flexDirection: "row",
		justifyContent: "center",
		alignItems: "center"
    },
    btn: {
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		gap: 5,
        padding: 5
	}
});
import { StyleSheet, Text, TextInput, View, Dimensions } from "react-native";
import { LoginNavigationProps } from "../../App";
import LokatorButton from "../components/LokatorButton";
import Logo from "../components/Logo";

export default function LoginScreen(navigationProp: LoginNavigationProps) {
    return (
        <View style={styles.formContainer}>
            <Logo height={100} width={100} />
            <TextInput placeholder="Username" style={[styles.inputField, styles.usernameInput]} />
            <TextInput secureTextEntry={true} placeholder="Password" style={[styles.inputField, styles.passwordInput]} />

            <LokatorButton 
                handler={() => {
                    navigationProp.navigation.navigate("Search");
                }} 
                type="Primary"
                fontSize={20} 
                padding="wide"
            />
        </View>
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
    }
});
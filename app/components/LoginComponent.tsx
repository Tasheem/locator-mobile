import { Button, SafeAreaView, StatusBar, StyleSheet, Text, TextInput, View, Dimensions, Platform, Image } from "react-native";

export default function LoginComponent() {
    return (
        <View style={styles.formContainer}>
            <Image style={{
                width: 100,
                height: 100
            }} source={require("../../assets/locater_center_solid.png")} />
            <TextInput placeholder="Username" style={[styles.inputField, styles.usernameInput]} />
            <TextInput placeholder="Password" style={[styles.inputField, styles.passwordInput]} />

            { renderButton() }
        </View>
    )
}

const renderButton = () => {
    if(Platform.OS === "ios") {
        return (
            <View style={styles.iosBtnContainer}>
                <Button title="Log In" color="white" />
            </View>
        )
    }

    return (
        <Button title="Log In" />
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
		borderWidth: 2,
		borderRadius: 8,
		height: 40,
        width: Dimensions.get("window").width - 80,
		paddingLeft: 5
	},
    usernameInput: {
    },
    passwordInput: {
    },
    iosBtnContainer: {
        backgroundColor: brandColor,
        borderRadius: 5,
        paddingLeft: 10,
        paddingRight: 10,
    }
})
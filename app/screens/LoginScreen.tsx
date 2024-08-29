import { StyleSheet, Text, TextInput, View, Dimensions, ActivityIndicator, Button } from "react-native";
import { LoginNavigationProps } from "../../App";
import LokatorButton from "../components/LokatorButton";
import Logo from "../components/Logo";
import { useState } from "react";
import { AuthService } from "../services/auth-service";

type LoginProps = {
    setUserToken: React.Dispatch<React.SetStateAction<string | null>>
}

export default function LoginScreen(navigationProp: LoginNavigationProps, loginProps: LoginProps) {
    // TODO: Need to figure out how React does dependency injection.
    const authService = new AuthService();

    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    return (
        <View style={styles.formContainer}>
            <Logo height={100} width={100} />
            <ActivityIndicator 
				animating={isLoggingIn}
				color={brandColor}
				style={{
					height: isLoggingIn ? "auto" : 0
				}} 
			/>

            <TextInput placeholder="Username" 
                style={[styles.inputField, styles.usernameInput]}
                onChangeText={setUsername}
                value={username} 
            />
            <TextInput secureTextEntry 
                placeholder="Password" 
                style={[styles.inputField, styles.passwordInput]}
                onChangeText={setPassword}
                value={password}
            />

            <LokatorButton 
                handler={async () => {
                    setIsLoggingIn(true);
                    console.log("username:", username);
                    console.log("password:", password);
                    await authService.login(username, password, navigationProp.route.params.setUserToken);
                    setIsLoggingIn(false);
                }} 
                type="Primary"
                fontSize={20} 
                padding="wide"
                textValue="Login"
            />

            <Button title="Register" 
                onPress={() => {
                    navigationProp.navigation.navigate("Register");
                }}
            />
        </View>
    );
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
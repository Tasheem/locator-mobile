import { StyleSheet, Text, TextInput, View, Dimensions, ActivityIndicator, Button } from "react-native";
import { LoginNavigationProps } from "../../App";
import LokatorButton from "../components/LokatorButton";
import Logo from "../components/Logo";
import { useState } from "react";
import { login } from "../services/auth-service";

export default function LoginScreen(navigationProp: LoginNavigationProps) {
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(false);

    return (
        <View style={styles.formContainer}>
            <Logo height={100} width={100} />
            
            {
                error && !isLoggingIn ? (
                    <View>
                        <Text style={{
                            color: "red"
                        }}>Incorrect username/password.</Text>
                    </View>
                ) : null
            }
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

                    try {
                        await login(username, password);
                    } catch (error: any) {
                        setError(true);
                        console.log(error);
                    } finally {
                        setIsLoggingIn(false);
                    }
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
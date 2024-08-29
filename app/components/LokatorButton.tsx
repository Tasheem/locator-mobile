import { StyleSheet, Text, TextInput, View, Dimensions, Image, TouchableHighlight } from "react-native";
import { BRAND_RED } from "../constants/colors";
import Logo from "./Logo";
import { useState } from "react";

type LokatorButtonProps = {
    handler: () => void;
    type: "Primary" | "Secondary"
    useLogo?: boolean;
    fontSize?: number;
    padding?: "wide" | "normal";
    textValue: string;
}

export default function LokatorButton(props: LokatorButtonProps) {
    const [isPressed, setIsPressed] = useState(false);

    const textColorStyling = () => {
        if(props.type === 'Primary') {
            return "#f2f0f0";
        }

        return isPressed ? "#f2f0f0" : BRAND_RED;
    }

    const styles = StyleSheet.create({
        btn: {
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            borderWidth: 2,
            borderColor: BRAND_RED,
            backgroundColor: props.type === 'Primary' ? BRAND_RED : "#f2f0f0",
            paddingLeft: props.padding ? (props.padding === "normal" ? "4%" : "6%") : "4%",
            paddingTop: "1.5%",
            paddingBottom: "1.5%",
            paddingRight: props.padding ? (props.padding === "normal" ? "4%" : "6%") : "4%",
            borderRadius: 8
        },
        contentContainer: {
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            gap: props.useLogo ? 8 : 0
        },
        btnText: {
            fontSize: props.fontSize ? props.fontSize : 16,
            color: textColorStyling()
        },
        btnImage: {
            width: props.fontSize ? props.fontSize + 3 : 19,
            height: props.fontSize ? props.fontSize + 3 : 19
        }
    });

    return (
		<TouchableHighlight onPressIn={() => {
            setIsPressed(true);
        }} 
        onPressOut={() => {
            setIsPressed(false);
        }}
        onPress={props.handler} underlayColor={ props.type === "Primary" ? "#965050" : BRAND_RED } 
        style={styles.btn}>
			<View style={styles.contentContainer}>
				<Text style={styles.btnText}>{props.textValue}</Text>
                {
                    props.useLogo ? 
                    <Logo 
                        height={props.fontSize ? props.fontSize + 3 : 19} 
                        width={props.fontSize ? props.fontSize + 3 : 19} 
                    /> : null
                }
			</View>
		</TouchableHighlight>
    );
}

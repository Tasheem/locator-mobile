import { StyleSheet, Text, View, TextInput, ActivityIndicator } from "react-native"
import LocatorButton from "./LocatorButton";
import { useState } from "react";
import { BRAND_RED } from "../constants/colors";

type Props = {
    title: string
    prompt?: string
    inputPlaceholder?: string
    submitText?: string
    submitHandler?: ((text?: string) => Promise<void>)
}

export default function Confirmation({ title, prompt, inputPlaceholder, submitText, submitHandler }: Props) {
    const [userInput, setUserInput] = useState<string | undefined>();
    const [runningHandler, setRunningHandler] = useState(false);

    return (
        <View style={style.rootContainer}>
            <View style={style.titleContainer}>
                <Text style={style.title}>{ title }</Text>
            </View>

            <View style={style.promptContainer}>
                <Text style={style.prompt}>{ prompt }</Text>
            </View>

            <View
                style={style.formContainer}
            >
                <TextInput
                    placeholder={inputPlaceholder}
                    value={userInput}
                    onChangeText={setUserInput}
                    style={style.textInput}
                    autoCapitalize='none'
                />

                {
                    runningHandler ? (
                        <ActivityIndicator
                            animating={runningHandler}
                            color={BRAND_RED}
                            style={{ width: style.locatorButtonWidth.width }}
                        />
                    ) : (
                        <LocatorButton
                            textValue={submitText ? submitText : 'Submit'}
                            type='Primary'
                            width={style.locatorButtonWidth.width}
                            handler={() => {
                                if(!submitHandler) {
                                    return;
                                }
                                
                                setRunningHandler(true);
                                submitHandler()
                                .then(() => {
                                    setRunningHandler(false);
                                })
                                .catch(err => {
                                    setRunningHandler(false);
                                });
                            }}
                        />
                    )
                }
            </View>
        </View>
    );
}

const style = StyleSheet.create({
    rootContainer: {
        padding: 10,
        justifyContent: 'center',
        height: '90%',
        gap: 20
    },
    titleContainer: {
        flexDirection: 'row',
        justifyContent: 'center'
    },
    title: {
        fontWeight: 'bold',
        fontSize: 25
    },
    promptContainer: {},
    prompt: {
        fontWeight: '600',
        fontSize: 18
    },
    formContainer: {
        flexDirection: 'row',
        width: '100%',
        columnGap: 20
    },
    textInput: {
        borderColor: BRAND_RED,
        borderStyle: 'solid',
        borderWidth: 2,
        borderRadius: 10,
        flex: 1,
        padding: 10
    },
    locatorButtonWidth: {
        width: 130
    }
});
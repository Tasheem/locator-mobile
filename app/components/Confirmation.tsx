import { StyleSheet, Text, View, TextInput, ActivityIndicator } from "react-native"
import LocatorButton from "./LocatorButton";
import { useState } from "react";
import { BRAND_RED, CARD_SECONDARY_COLOR } from "../constants/colors";

type Props = {
    title: string
    prompt?: string
    inputPlaceholder?: string
    submitText?: string
    submitHandler?: (text?: string) => Promise<void>
    elementInFocus?: React.JSX.Element
    useTextField?: boolean
}

export default function Confirmation({ title, prompt, inputPlaceholder, submitText, submitHandler, elementInFocus, useTextField }: Props) {
    const [userInput, setUserInput] = useState<string | undefined>();
    const [runningHandler, setRunningHandler] = useState(false);

    const style = StyleSheet.create({
        rootContainer: {
            padding: 10,
            height: '80%',
            gap: 40,
            justifyContent: 'center'
        },
        elementContainer: {
            justifyContent: 'center'
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
            fontWeight: '500',
            fontSize: 18
        },
        formContainer: {
            flexDirection: 'row',
            width: '100%',
            columnGap: 20,
            justifyContent: useTextField ? 'flex-start' : 'center'
        },
        textInput: {
            borderColor: CARD_SECONDARY_COLOR,
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

    return (
        <View style={style.rootContainer}>
            <View style={style.titleContainer}>
                <Text style={style.title}>{ title }</Text>
            </View>

            <View style={style.promptContainer}>
                <Text style={style.prompt}>{ prompt }</Text>
            </View>
            
            {
                elementInFocus ? (
                    <View style={style.elementContainer}>
                        { elementInFocus }
                    </View>
                ) : null
            }

            <View
                style={style.formContainer}
            >
                {
                    useTextField ? (
                        <TextInput
                            placeholder={inputPlaceholder}
                            value={userInput}
                            onChangeText={setUserInput}
                            style={style.textInput}
                            autoCapitalize='none'
                        />
                    ) : null
                }

                {
                    runningHandler ? (
                        <ActivityIndicator
                            animating={runningHandler}
                            color={BRAND_RED}
                            style={{ width: style.locatorButtonWidth.width, marginTop: 10, marginBottom: 10 }}
                        />
                    ) : (
                        <LocatorButton
                            textValue={submitText ? submitText : 'Submit'}
                            type='Primary'
                            width={style.locatorButtonWidth.width}
                            fontSize={20}
                            handler={() => {
                                if(!submitHandler) {
                                    return;
                                }
                                
                                setRunningHandler(true);
                                submitHandler(userInput)
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
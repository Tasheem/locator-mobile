import { Modal, SafeAreaView, TouchableOpacity, TouchableWithoutFeedback, Image, StyleSheet, Dimensions, ActivityIndicator, View } from "react-native";
import { Gesture, GestureDetector, GestureHandlerRootView } from "react-native-gesture-handler";
import { LocatorImageData } from "../models/locator-media";
import Animated, { useAnimatedStyle, useSharedValue } from "react-native-reanimated";
import { useContext, useState } from "react";
import { BRAND_RED } from "../constants/colors";
import { ScreenContext } from "../utils/context";

type Props = {
    modalVisible: boolean
    photo: LocatorImageData | null
    onClose: (() => void)
}

function clamp(val: number, min: number, max: number) {
    return Math.min(Math.max(val, min), max);
}

export default function PhotoModal({ modalVisible, photo, onClose }: Props) {
    const screenContext = useContext(ScreenContext);

    const [imageLoading, setImageLoading] = useState(false);
    const translationY = useSharedValue(0);
    const prevTranslationY = useSharedValue(0);
  
    const animatedStyles = useAnimatedStyle(() => ({
      transform: [
        { translateY: translationY.value }
      ],
    }));

    const pan = Gesture.Pan()
    .minDistance(1)
    .onStart(() => {
      prevTranslationY.value = translationY.value;
    })
    .onUpdate((event) => {
      const maxTranslateY = screenContext.height / 2 - 50;

      translationY.value = clamp(
        prevTranslationY.value + event.translationY,
        -maxTranslateY,
        maxTranslateY
      );
    })
    .onEnd((event) => {
        if(Math.abs(translationY.value) > 200) {
            onClose()
        }

        translationY.value = 0;
        prevTranslationY.value = 0;
    })
    .runOnJS(true);
    
    return (
        <Modal
            animationType='fade'
            visible={modalVisible}
            transparent={true}
            onRequestClose={onClose}
        >
            <SafeAreaView style={{
                backgroundColor: 'rgba(0, 0, 0, 0.9)'
            }}>
                <GestureHandlerRootView>
                    <GestureDetector gesture={pan}>
                        <Animated.View style={animatedStyles}>
                            <TouchableOpacity
                                style={modalStyle.rootContainer}
                                onPress={onClose}
                            >
                                <TouchableWithoutFeedback>
                                    <View style={modalStyle.imageContainer}>
                                        {
                                            imageLoading ? (
                                                <ActivityIndicator
                                                    animating={imageLoading}
                                                    color={BRAND_RED}
                                                    style={{
                                                        top: '45%'
                                                    }}
                                                    size={screenContext.widthRatio > 1.5 ? 'large' : 'small'}
                                                />
                                            ) : null
                                        }
                                        <Image
                                            source={{ uri: photo?.publicUrl }}
                                            style={modalStyle.image}
                                            onLoadStart={() => {
                                                setImageLoading(true);
                                            }}
                                            onLoadEnd={() => {
                                                setImageLoading(false);
                                            }}
                                        />
                                    </View>
                                </TouchableWithoutFeedback>
                            </TouchableOpacity>
                        </Animated.View>
                    </GestureDetector>
                </GestureHandlerRootView>
            </SafeAreaView>
        </Modal>
    );
}

const modalStyle = StyleSheet.create({
    rootContainer: {
        height: '100%',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    imageContainer: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    image: {
        width: Dimensions.get('window').width - 50,
        height: Dimensions.get('window').height - 300
    }
});
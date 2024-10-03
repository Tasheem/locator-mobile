import { Modal, SafeAreaView, TouchableOpacity, TouchableWithoutFeedback, Image, StyleSheet, Dimensions } from "react-native";
import { Gesture, GestureDetector, GestureHandlerRootView } from "react-native-gesture-handler";
import { LocatorImageData } from "../models/locator-media";
import Animated, { useAnimatedStyle, useSharedValue } from "react-native-reanimated";

type Props = {
    modalVisible: boolean
    photo: LocatorImageData | null
    onClose: (() => void)
}

function clamp(val: number, min: number, max: number) {
    return Math.min(Math.max(val, min), max);
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('screen');

export default function PhotoModal({ modalVisible, photo, onClose }: Props) {
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
      const maxTranslateY = screenHeight / 2 - 50;

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
                                    <Image
                                        source={{ uri: photo?.publicUrl }}
                                        style={modalStyle.image}
                                    />
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
    image: {
        width: Dimensions.get('window').width - 50,
        height: Dimensions.get('window').height - 300
    }
});
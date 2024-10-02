import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../../App";
import { SafeAreaView, Image, StyleSheet, Dimensions, Modal } from "react-native";
import { useEffect, useState } from "react";
import { fetchUserImages } from "../services/media-service";
import { ScrollView, TouchableOpacity, TouchableWithoutFeedback, GestureDetector, Gesture, GestureHandlerRootView } from "react-native-gesture-handler";
import Animated, { useAnimatedStyle, useSharedValue } from "react-native-reanimated";

type Props = {
    navigation: NativeStackNavigationProp<
        RootStackParamList,
        'Photos',
        undefined
    >;
    route: RouteProp<RootStackParamList, 'Photos'>;
};

function clamp(val: number, min: number, max: number) {
    return Math.min(Math.max(val, min), max);
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('screen');

export default function PhotosScreen({}: Props) {
    const [photoUrls, setPhotoUrls] = useState<LocatorImageData[]>([]);
    const [enlargedPhotoVisible, setEnlargedPhotoVisible] = useState(false);
    const [photoInFocus, setPhotoInFocus] = useState<LocatorImageData | null>(null);

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
      const maxTranslateX = screenWidth / 2 - 50;
      const maxTranslateY = screenHeight / 2 - 50;

      translationY.value = clamp(
        prevTranslationY.value + event.translationY,
        -maxTranslateY,
        maxTranslateY
      );
    })
    .onEnd((event) => {
        if(Math.abs(translationY.value) > 200) {
            setPhotoInFocus(null);
            setEnlargedPhotoVisible(false);
        }

        translationY.value = 0;
        prevTranslationY.value = 0;
    })
    .runOnJS(true);

    useEffect(() => {
        fetchUserImages()
        .then(response => {
            if(response.ok) {
                return response.json();
            }

            return Promise.resolve([]);
        })
        .then((urls: LocatorImageData[]) => {
            setPhotoUrls(urls);
        })
    }, []);

    const renderedPhotos = photoUrls.map((imageData, index) => {
        const startItem = index % 4 === 0;
        const endItem = index % 4 === 3;

        return (
            <TouchableOpacity
                key={imageData.publicUrl}
                onPress={() => {
                    setPhotoInFocus(imageData);
                    setEnlargedPhotoVisible(true);
                }}
            >
                <Image
                    source={{ uri: imageData.publicUrl }}
                    style={[style.image, {
                        marginLeft: startItem ? 0 : 1,
                        marginRight: endItem ? 0 : 1
                    }]}
                />
            </TouchableOpacity>
        );
    });

    return (
        <SafeAreaView style={{
            height: '100%'
        }}>
            <ScrollView contentContainerStyle={style.listContainer}>
                { renderedPhotos }
            </ScrollView>

            <Modal
                animationType='fade'
                visible={enlargedPhotoVisible}
                transparent={true}
                onRequestClose={() => {
                    setEnlargedPhotoVisible(false);
                }}
            >
                <SafeAreaView style={{
                    backgroundColor: 'rgba(0, 0, 0, 0.9)'
                }}>
                    <GestureHandlerRootView>
                        <GestureDetector gesture={pan}>
                            <Animated.View style={animatedStyles}>
                                <TouchableOpacity
                                    style={modalStyle.rootContainer}
                                    onPress={() => {
                                        setEnlargedPhotoVisible(false);
                                        setPhotoInFocus(null);
                                    }}
                                >
                                    <TouchableWithoutFeedback>
                                        <Image
                                            source={{ uri: photoInFocus?.publicUrl }}
                                            style={modalStyle.image}
                                        />
                                    </TouchableWithoutFeedback>
                                </TouchableOpacity>
                            </Animated.View>
                        </GestureDetector>
                    </GestureHandlerRootView>
                </SafeAreaView>
            </Modal>
        </SafeAreaView>
    );
}

/* console.log(`Screen width: ${Dimensions.get('window').width}`);
console.log(`Image width: ${(Dimensions.get('window').width / 4) - 1.5}`); */

const style = StyleSheet.create({
    listContainer: {
        width: '100%',
        margin: 'auto',
        flexDirection: 'row',
        flexWrap: 'wrap',
        rowGap: 2
    },
    image: {
        width: (Dimensions.get('window').width / 4) - 1.5,
        height: (Dimensions.get('window').width / 4) - 1.5
    }
});

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
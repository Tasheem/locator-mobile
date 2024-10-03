import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../../App";
import { SafeAreaView, Image, StyleSheet, Dimensions, Modal, Alert, View, ActivityIndicator } from "react-native";
import { useEffect, useState } from "react";
import { fetchUserImages, uploadImages } from "../services/media-service";
import { ScrollView, TouchableOpacity, TouchableWithoutFeedback, GestureDetector, Gesture, GestureHandlerRootView } from "react-native-gesture-handler";
import Animated, { useAnimatedStyle, useSharedValue } from "react-native-reanimated";
import Ionicons from "react-native-vector-icons/Ionicons";
import { BRAND_RED } from "../constants/colors";
import { launchImageLibraryAsync, MediaTypeOptions, useMediaLibraryPermissions } from "expo-image-picker";
import { ImageOperationResult, LocatorImageData } from "../models/locator-media";

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
    const [photos, setPhotos] = useState<LocatorImageData[]>([]);
    const [enlargedPhotoVisible, setEnlargedPhotoVisible] = useState(false);
    const [photoInFocus, setPhotoInFocus] = useState<LocatorImageData | null>(null);
    const [mediaPermissionStatus, requestMediaPermission] = useMediaLibraryPermissions();
    const [mediaLibraryLoading, setMediaLibraryLoading] = useState(false);
    const [performingImageOperating, setPerformingImageOperation] = useState(false);

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
        .then((photos: LocatorImageData[]) => {
            setPhotos(photos);
        })
    }, []);

    const renderedPhotos = photos.map((imageData, index) => {
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

    renderedPhotos.push((
        <TouchableOpacity
            style={style.addBtnContainer}
            key={'AddBtn'}
            onPress={async () => {
                if(!mediaPermissionStatus || !mediaPermissionStatus?.granted) {
                    if(!mediaPermissionStatus || mediaPermissionStatus?.canAskAgain) {
                        const response = await requestMediaPermission();
                        if(response.granted) {
                            setMediaLibraryLoading(true);
                            await handleImageSelection(setPhotos);
                            setMediaLibraryLoading(false);
                        }
                    }

                    return;
                }

                setMediaLibraryLoading(true);
                await handleImageSelection(setPhotos);
                setMediaLibraryLoading(false);
            }}
        >
            {
                mediaLibraryLoading || performingImageOperating ? (
                    <ActivityIndicator
                        animating={mediaLibraryLoading || performingImageOperating}
                        color={BRAND_RED}
                    />
                ) : (
                    <Ionicons
                        name='add-circle-outline'
                        //style={styles.trashcan}
                        size={40}
                        color={BRAND_RED}
                    />
                )
            }
        </TouchableOpacity>
    ));

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

const handleImageSelection = async (setPhotos: React.Dispatch<React.SetStateAction<LocatorImageData[]>>) => {
    const result = await launchImageLibraryAsync({
        allowsMultipleSelection: true,
        mediaTypes: MediaTypeOptions.Images,
        selectionLimit: 10
    });

    if(result.assets) {
        const uploadResponse = await uploadImages(result.assets);
        if(uploadResponse.ok) {
            const responseBody = await uploadResponse.json() as ImageOperationResult;
            if(responseBody.errorCount > 0) {
                const message = `${responseBody.errorCount} ${responseBody.errorCount > 1 ? 'images' : 'image'} out of ${responseBody.imageCount} failed to upload.`;
                Alert.alert('Error', message);
            }

            const response = await fetchUserImages();
            if(response.ok) {
                const photos = await response.json() as LocatorImageData[];
                setPhotos(photos);
            }
        } else {
            const message = `An error occurred while uploading your ${result.assets.length > 1 ? 'images' : 'image'}`;
            Alert.alert('Error', message);
        }
    }
}

/* console.log(`Screen width: ${Dimensions.get('window').width}`);
console.log(`Image width: ${(Dimensions.get('window').width / 4) - 1.5}`); */

const style = StyleSheet.create({
    btnContainer: {
        flexDirection: 'row',
        height: 100,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10
    },
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
    },
    addBtnContainer: {
        width: (Dimensions.get('window').width / 4) - 1.5,
        height: (Dimensions.get('window').width / 4) - 1.5,
        justifyContent: 'center',
        alignItems: 'center'
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
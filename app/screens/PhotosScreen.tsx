import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../../App";
import { SafeAreaView, Image, StyleSheet, View, Dimensions, Modal } from "react-native";
import { useEffect, useState } from "react";
import { fetchUserImages } from "../services/media-service";
import { TouchableOpacity, TouchableWithoutFeedback } from "react-native-gesture-handler";

type Props = {
    navigation: NativeStackNavigationProp<
        RootStackParamList,
        'Photos',
        undefined
    >;
    route: RouteProp<RootStackParamList, 'Photos'>;
};

export default function PhotosScreen({}: Props) {
    const [photoUrls, setPhotoUrls] = useState<LocatorImageData[]>([]);
    const [enlargedPhotoVisible, setEnlargedPhotoVisible] = useState(false);
    const [photoInFocus, setPhotoInFocus] = useState<LocatorImageData | null>(null);

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
            <View style={style.imageContainer}>
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
            </View>
        );
    });

    return (
        <SafeAreaView style={{
            height: '100%'
        }}>
            <View style={style.listContainer}>
                { renderedPhotos }
            </View>

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
    imageContainer: {
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
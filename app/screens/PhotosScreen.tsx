import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../../App";
import { FlatList, SafeAreaView, Image, StyleSheet, View, Dimensions } from "react-native";
import { useEffect, useState } from "react";
import { fetchUserImages } from "../services/media-service";

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

    useEffect(() => {
        fetchUserImages()
        .then(response => {
            if(response.ok) {
                return response.json();
            }
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
                <Image key={imageData.publicUrl}
                    source={{ uri: imageData.publicUrl }}
                    style={[style.image, {
                        marginLeft: startItem ? 0 : 1,
                        marginRight: endItem ? 0 : 1,
                        alignSelf: endItem ? 'flex-end' : 'auto'
                    }]}
                />
            </View>
        );
    });

    return (
        <SafeAreaView style={{
            height: '100%',
            alignItems: 'center'
        }}>
            <View style={style.listContainer}>
                { renderedPhotos }
            </View>
        </SafeAreaView>
    );
}

console.log(`Screen width: ${Dimensions.get('window').width}`);
console.log(`Image width: ${(Dimensions.get('window').width / 4) - 1.5}`);

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
})
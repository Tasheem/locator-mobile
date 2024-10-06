import { FlatList, Modal, SafeAreaView, StyleSheet, TextInput, TouchableOpacity, View, Image, Text, ActivityIndicator, Alert } from "react-native";
import { BRAND_RED, CARD_PRIMARY_COLOR, CARD_SECONDARY_COLOR } from "../constants/colors";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useContext, useState } from "react";
import { UserSearchResult } from "../models/user";
import { searchUsers } from "../services/search-service";
import { LocatorImageData } from "../models/locator-media";
import PhotoModal from "./PhotoModal";
import { TouchableHighlight } from "react-native-gesture-handler";
import { sendJoinRoomRequest } from "../services/room-service";
import { Room } from "../models/room";
import { ScreenContext } from "../utils/context";

type Props = {
    modalVisible: boolean
    onClose: (() => void)
    room: Room
}

let debouceDuration = 500;
let timeoutId: NodeJS.Timeout | null = null;

export default function SearchModal({ modalVisible, onClose, room }: Props) {
    const { widthRatio } = useContext(ScreenContext);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [displayingPhotoModal, setDisplayingPhotoModal] = useState(false);
    const [photoInFocus, setPhotoInFocus] = useState<LocatorImageData | null>(null);
    const [searchInFocus, setSearchInFocus] = useState(false);

    const testData = [{
        id: 1,
        username: 'Tasheem18',
        firstname: 'Tasheem',
        lastname: 'Hargrove',
        profilePictureUrl: ''
    }];
    const [searchResults, setSearchResults] = useState<UserSearchResult[]>([]);

    const onChangeText = (text: string) => {
        setSearchTerm(text.trim());

        if(text.trim().length < 2) {
            if(timeoutId) {
                clearTimeout(timeoutId);
                setLoading(false);
            }
            
            setSearchResults([]);
            return;
        }

        if(timeoutId) {
            clearTimeout(timeoutId);
        }
        
        timeoutId = setTimeout(async () => {
            try {
                setLoading(true);
                timeoutId = null;
                
                const response = await searchUsers(text);
                const results = await response.json() as UserSearchResult[];
    
                setSearchResults(results);
            } catch(err) {
                setSearchResults([]);
            } finally {
                setLoading(false);
            }
        }, debouceDuration);
    }

    const closeModal = () => {
        setSearchInFocus(false);
        onClose();
    }

    return (
        <Modal
            visible={modalVisible}
            onRequestClose={closeModal}
        >
            <SafeAreaView style={{
                height: '100%'
            }}>
                <View style={style.formContainer}>
                    <TouchableOpacity
                        style={style.exitContainer}
                        onPress={closeModal}
                    >
                        <Ionicons
                            name='close-circle-outline'
                            size={30}
                            color={BRAND_RED}
                        />
                    </TouchableOpacity>
                    <View style={style.searchInputContainer}>
                        <TextInput
                            placeholder='Search for people'
                            style={style.searchInput}
                            value={searchTerm}
                            onChangeText={onChangeText}
                            onFocus={() => {
                                setSearchInFocus(true);
                            }}
                            onBlur={() => {
                                setSearchInFocus(false);
                            }}
                        />
                        {
                            searchInFocus ? (
                                <Ionicons
                                    name='search'
                                    size={20}
                                    color={BRAND_RED}
                                />
                            ) : null
                        }
                    </View>
                </View>

                {
                    loading ? (
                        <ActivityIndicator
                            animating={loading}
                            color={BRAND_RED}
                            style={{
                                paddingTop: 15
                            }}
                            size={widthRatio > 1.5 ? 'large' : 'small'}
                        />
                    ) : null
                }
                
                <FlatList
                    data={searchResults}
                    numColumns={1}
                    keyExtractor={(item) => item.id + ''}
                    contentContainerStyle={{
                        marginTop: 15,
                        rowGap: 20,
                        marginLeft: 10,
                        marginRight: 10
                    }}
                    renderItem={({ item }) => {
                        return (
                            <TouchableOpacity
                                style={style.resultContainer}
                                onPress={() => {
                                    // Open modal to ask to send join request to user.
                                    const userId = item.id;

                                    if (item == null) {
                                    return;
                                    }

                                    const username = item.username
                                    Alert.alert(
                                        'Request',
                                        `Are you sure you want to send a request to ${username ? username : 'this user' } to join this room?`,
                                        [
                                            {
                                                text: 'No',
                                                style: 'cancel'
                                            },
                                            {
                                                text: 'Yes',
                                                onPress: () => {
                                                    sendJoinRoomRequest(room.id, Number(userId))
                                                    .then((response) => {
                                                        if (response.status === 201) {
                                                        Alert.alert(
                                                            'Success',
                                                            'The request has been sent successfully.'
                                                        );
                                                        } else if (response.status === 409) {
                                                        Alert.alert(
                                                            'Error',
                                                            `${username} is already a member of the room or they've already received a request.`
                                                        )
                                                        } else {
                                                        Alert.alert(
                                                            'Error',
                                                            'An error occurred while sending the request.'
                                                        );
                                                        }
                                                    })
                                                    .catch(() => {
                                                        Alert.alert(
                                                        'Error',
                                                        'An error occurred while sending the request.'
                                                        );
                                                    });
                                                },
                                            }
                                        ]
                                    );
                                }}
                            >
                                <View style={style.itemContainer}>
                                    <TouchableOpacity
                                        onPress={() => {
                                            if(item.profilePictureUrl) {
                                                setPhotoInFocus({
                                                    publicUrl: item.profilePictureUrl,
                                                    imageType: '',
                                                    createDate: ''
                                                });

                                                setDisplayingPhotoModal(true);
                                            }
                                        }}
                                    >
                                        <Image
                                            source={
                                                item.profilePictureUrl ? 
                                                {
                                                    uri: item.profilePictureUrl
                                                } : require('../assets/no-profile-pic.png')
                                            }
                                            style={{
                                                width: 50,
                                                height: 50,
                                                borderRadius: 40,
                                                borderColor: 'black',
                                                borderWidth: 2
                                            }}
                                        />
                                    </TouchableOpacity>
                                    <View style={style.textContainer}>
                                        <View style={style.highlightContainer}>
                                            {
                                                item.usernameHighlight ? (
                                                    <Text style={style.highlightText}>
                                                        { item.usernameHighlight.substring(0, searchTerm.length) }
                                                    </Text>
                                                ) : null
                                            }
                                            {
                                                item.usernameHighlight ? (
                                                    <Text style={style.text}>
                                                        { item.usernameHighlight.substring(searchTerm.length) }
                                                    </Text>
                                                ) : (
                                                    <Text style={style.text}>
                                                        { item.username }
                                                    </Text>
                                                )
                                            }
                                        </View>
                                        <View style={style.highlightContainer}>
                                            {
                                                item.firstnameHighlight ? (
                                                    <Text style={style.highlightText}>
                                                        { item.firstnameHighlight.substring(0, searchTerm.length) }
                                                    </Text>
                                                ) : null
                                            }
                                            {
                                                item.firstnameHighlight ? (
                                                    <Text style={style.text}>
                                                        { item.firstnameHighlight.substring(searchTerm.length) }
                                                    </Text>
                                                ) : (
                                                    <Text style={style.text}>
                                                        { item.firstname }
                                                    </Text>
                                                )
                                            }
                                        </View>
                                        <View style={style.highlightContainer}>
                                            {
                                                item.lastnameHighlight ? (
                                                    <Text style={style.highlightText}>
                                                        { item.lastnameHighlight.substring(0, searchTerm.length) }
                                                    </Text>
                                                ) : null
                                            }
                                            {
                                                item.lastnameHighlight ? (
                                                    <Text style={style.text}>
                                                        { item.lastnameHighlight.substring(searchTerm.length) }
                                                    </Text>
                                                ) : (
                                                    <Text style={style.text}>
                                                        { item.lastname }
                                                    </Text>
                                                )
                                            }
                                        </View>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        );
                    }}
                />

                <PhotoModal
                    modalVisible={displayingPhotoModal}
                    photo={photoInFocus}
                    onClose={() => {
                        setDisplayingPhotoModal(false);
                        setPhotoInFocus(null);
                    }}
                />
            </SafeAreaView>
        </Modal>
    )
}

const style = StyleSheet.create({
    formContainer: {
        flexDirection: 'row-reverse',
        alignItems: 'center',
        gap: 15,
        marginTop: 10,
        paddingLeft: 15
    },
    exitContainer: {
        width: '20%',
        flexDirection: 'row',
        justifyContent: 'flex-end'
    },
    searchInputContainer: {
        flexDirection: 'row',
        width: '50%',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: BRAND_RED,
        borderRadius: 20,
        paddingLeft: 10,
        paddingRight: 10
    },
    searchInput: {
        flex: 1,
        borderRadius: 20,
        height: 30
    },
    resultContainer: {
        borderRadius: 40
    },
    itemContainer: {
        borderColor: CARD_SECONDARY_COLOR,
        borderWidth: 2,
        borderRadius: 40,
        backgroundColor: CARD_PRIMARY_COLOR,
        flexDirection: 'row',
        alignItems: 'center'
    },
    textContainer: {
        flex: 1,
        flexDirection: 'row',
        gap: 15,
        padding: 10
    },
    highlightContainer: {
        flexDirection: 'row',
        flex: 1,
        flexWrap: 'wrap'
    },
    text: {
    },
    highlightText: {
        fontWeight: 'bold'
    }
});
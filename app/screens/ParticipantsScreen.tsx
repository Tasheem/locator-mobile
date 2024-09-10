import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StyleSheet, View, Image, Text, FlatList, TextInput, Dimensions, Alert } from "react-native";
import { RoomDetailsParamList } from "./RoomDetailsScreen";
import { RouteProp } from "@react-navigation/native";
import { BRAND_RED, CARD_PRIMARY_COLOR, CARD_SECONDARY_COLOR } from "../constants/colors";
import LokatorButton from "../components/LokatorButton";
import { useEffect, useRef, useState } from "react";
import { AutocompleteDropdown, AutocompleteDropdownItem, IAutocompleteDropdownRef } from "react-native-autocomplete-dropdown";
import { searchUsers } from "../services/user-service";
import { UserSearchResult } from "../models/user";
import { disconnectParticipantsSocket, establishParticipantsConnection, participantsObservable, sendJoinRoomRequest } from "../services/room-service";

type Props = {
    navigation: NativeStackNavigationProp<RoomDetailsParamList, "Participants", undefined>
    route: RouteProp<RoomDetailsParamList, "Participants">
}


export default function ParticipantsScreen({ route }: Props) {
    const dropdownController = useRef<IAutocompleteDropdownRef | null>(null);

    const room = route.params.room;
    const [suggestions, setSuggestions] = useState<AutocompleteDropdownItem[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [members, setMembers] = useState(room.members);

    useEffect(() => {
        establishParticipantsConnection(room.id);
        const subscription = participantsObservable().subscribe(newMember => {
            const updatedList = [...members, newMember];
            setMembers(updatedList);
        });

        return () => {
            subscription.unsubscribe();
            disconnectParticipantsSocket();
        }
    }, []);

    return (
        <View style={style.rootContainer}>
            <View style={style.formContainer}>
                <AutocompleteDropdown
                    controller={controller => {
                        dropdownController.current = controller
                    }}
                    dataSet={suggestions}
                    onChangeText={async (text) => {
                        // Fetch suggestions...
                        setIsLoading(true);

                        try {
                            const response = await searchUsers(text);
                            const result = await response.json() as UserSearchResult[];
                            const listItems = result.map((searchResult) => {
                                /* return {
                                    id: searchResult.id + "",
                                    title: `${searchResult.usernameHighlight ? searchResult.usernameHighlight : searchResult.username} ${searchResult.firstnameHighlight ? searchResult.firstnameHighlight : searchResult.firstname} ${searchResult.lastnameHighlight ? searchResult.lastnameHighlight : searchResult.lastname}`
                                } as AutocompleteDropdownItem */
                                return {
                                    id: searchResult.id + "",
                                    title: `${searchResult.username} ${searchResult.firstname} ${searchResult.lastname}`
                                } as AutocompleteDropdownItem
                            });
    
                            setSuggestions(listItems);
                        } finally {
                            setIsLoading(false);
                        }
                    }}
                    onSelectItem={(item) => {
                        // Open modal to ask to send join request to user.
                        const userId = item?.id;
                        console.log("logging item");
                        console.log(item);

                        if(item == null) {
                            return;
                        }

                        const username = item?.title?.split(" ")[0];
                        Alert.alert("Request", `Are you sure you want to send a request to ${username ? username : "this user"} to join this room?`,[
                            {
                                text: "No",
                                onPress: () => console.log("Cancel Pressed"),
                                style: "cancel",
                            },
                            {
                                text: "Yes", 
                                onPress: () => {
                                    sendJoinRoomRequest(room.id, Number(userId))
                                    .then((response) => {
                                        if(response.status === 201) {
                                            Alert.alert("Success", "The request has been sent successfully.");
                                        } else {
                                            Alert.alert("Error", "An error occurred while sending the request.");
                                        }
                                    })
                                    .catch(() => {
                                        Alert.alert("Error", "An error occurred while sending the request.");
                                    });
                                }
                            }
                        ])
                    }}
                    onClear={() => {
                        setSuggestions([]);
                    }}
                    debounce={600}
                    suggestionsListMaxHeight={Dimensions.get('window').height * 0.4}
                    loading={isLoading}
                    textInputProps={{
                        placeholder: 'Search for people',
                        autoCorrect: false,
                        autoCapitalize: 'none',
                        style: {
                          borderRadius: 25,
                          backgroundColor: CARD_PRIMARY_COLOR,
                          color: 'black',
                          paddingLeft: 18,
                          width: 200
                        },
                    }}
                    rightButtonsContainerStyle={{
                        right: 8,
                        height: 30,
                        alignSelf: 'center'
                    }}
                    inputContainerStyle={{
                        backgroundColor: CARD_PRIMARY_COLOR,
                        borderRadius: 25,
                        borderColor: BRAND_RED,
                        borderWidth: 2
                    }}
                    suggestionsListContainerStyle={{
                        backgroundColor: "rgba(256, 256, 256, 0.9)"
                    }}
                    renderItem={(item, text) => <Text style={{ color: 'black', padding: 15 }}>{ item.title }</Text>}
                />
                {/* <LokatorButton type="Primary" textValue="+ Add" handler={() => {}} /> */}
            </View>

            <FlatList
            data={members}
            numColumns={2}
            keyExtractor={item => item.id + ""}
            contentContainerStyle={{
                marginTop: 15,
                rowGap: 40
            }}
            renderItem={({ item }) => (
                <View style={ style.itemContainer }>
                    <Image source={require("../assets/no-profile-pic.png")}
                    style={{
                        width: 50,
                        height: 50,
                        borderRadius: 40,
                        borderColor: "black",
                        borderWidth: 2
                    }} />
                    <Text style={style.username}>{ item.username }</Text>
                </View>
            )} />
        </View>
    )
}

const style = StyleSheet.create({
    rootContainer: {
        alignItems: "center",
        marginTop: 10
    },
    formContainer: {
        flexDirection: "row"
    },
    textInput: {
        marginRight: 10,
        borderWidth: 2,
        borderColor: BRAND_RED,
        borderRadius: 10,
        paddingLeft: 10,
        width: "45%"
    },
    itemContainer: {
        borderColor: CARD_SECONDARY_COLOR,
        borderWidth: 2,
        borderRadius: 40,
        backgroundColor: CARD_PRIMARY_COLOR,
        flexDirection: "row",
        alignItems: "center",
        minWidth: "45%",
        marginLeft: 10,
        marginRight: 10
    },
    username: {
        paddingLeft: 10
    }
});
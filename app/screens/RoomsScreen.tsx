import { SafeAreaView, View, StyleSheet, Text, TouchableHighlight, FlatList, Modal, TextInput, ActivityIndicator } from "react-native";
import Logo from "../components/Logo";
import { BRAND_RED, CARD_PRIMARY_COLOR, CARD_SECONDARY_COLOR } from "../constants/colors";
import { useEffect, useState } from "react";
import { Room } from "../models/room";
import LokatorButton from "../components/LokatorButton";
import { createRoom, getRoomsForUser } from "../services/room-service";
import { requestUser } from "../services/user-service";
import { NavigationProp, RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../../App";

type Props = {
    route: RouteProp<RootStackParamList, "Rooms">,
    navigation: NavigationProp<RootStackParamList, "Rooms">
}

export default function RoomsScreen({ route, navigation }: Props) {
    // const [user, setUser] = useState<User | null>(null);
    const [rooms, setRooms] = useState<Room[]>([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [newRoomName, setNewRoomName] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    
    useEffect(() => {
        getRoomsForUser()
        .then(response => {
            return response.json() as Promise<Room[]>;
        })
        .then(rooms => {
            setRooms(rooms);
        })
        .catch(err => {
            setRooms([]);
        });
    }, []);

    return (
        <SafeAreaView style={{flex: 1}}>
            <View style={styles.buttonContainer}>
                <LokatorButton type="Secondary" textValue="New Room" handler={() => {
                    setIsModalVisible(true);
                }} />
            </View>
                                    
            <FlatList
                data={rooms}
                keyExtractor={(item) => item.id + ""}
                renderItem={(itemInfo) => (
                    <TouchableHighlight 
                        onPress={() => {
                            navigation.navigate("RoomDetails", {
                                room: itemInfo.item,
                                user: route.params.user
                            });
                        }} 
                        style={ styles.viewContainer } 
                        underlayColor={"red"}>
                        <View style={ styles.roomContainer }>
                            <Logo height={50} width={50} />
                            <View style={ styles.descriptionContainer }>
                                <Text style={ styles.description }>{ itemInfo.item.name }</Text>
                                <Text style={ styles.description }>Participants: { itemInfo.item.members.length }</Text>
                            </View>
                        </View>
                    </TouchableHighlight>
                )}
            />

            <Modal
                animationType="slide"
                visible={isModalVisible}
                onRequestClose={() => {
                    setIsModalVisible(false);
                }}>
                <SafeAreaView>
                    <LokatorButton type="Secondary" textValue="Close"
                    handler={() => {
                        setIsModalVisible(false);
                    }} />

                    <View style={modalStyle.rootContainer}>
                        <View style={{
                            alignItems: "center"
                        }}>
                            <Logo width={100} height={100} />

                            <Text style={modalStyle.title}>
                                Create a Room
                            </Text>

                            {
                                isError && !isLoading ? (
                                    <Text style={modalStyle.errorText}>
                                        An error occurred while creating a new room.
                                    </Text>
                                ) : null
                            }

                            <View style={modalStyle.formContainer}>
                                <TextInput
                                    placeholder="Room Name"
                                    value={newRoomName}
                                    onChangeText={setNewRoomName}
                                    style={modalStyle.textInput}
                                />

                                {
                                    isLoading ? (
                                        <View style={modalStyle.loaderContainer}>
                                            <ActivityIndicator 
                                                animating={isLoading}
                                                color={BRAND_RED}
                                            />
                                        </View>
                                    ) : (
                                        <LokatorButton type="Primary" textValue="Submit"
                                        handler={async () => {
                                            setIsLoading(true);
        
                                            try {
                                                const response = await createRoom(newRoomName);
                                                if(response.status === 201) {
                                                    // const rooms = await response.json() as Room[];
                                                    const userRequestResult = await requestUser();
                                                    if(userRequestResult.status === 200) {
                                                        setIsError(false);
                                                        setIsModalVisible(false);
                                                    } else {
                                                        setIsError(true);
                                                    }
                                                } else {
                                                    setIsError(true);
                                                }
                                            } catch(err: any) {
                                                setIsError(true);
                                            } finally {
                                                setIsLoading(false);
                                            }
                                        }} />
                                    )
                                }
                            </View>
                        </View>
                    </View>
                </SafeAreaView>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    buttonContainer: {
        alignItems: "center",
        marginTop: 15
    },
    viewContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 10
    },
    roomContainer: {
        flexDirection: 'row',
        borderWidth: 2,
        borderColor: CARD_SECONDARY_COLOR,
        backgroundColor: CARD_PRIMARY_COLOR,
        borderRadius: 8,
        width: '98%',
        padding: 10
    },
    descriptionContainer: {
        marginLeft: 10,
        justifyContent: 'space-between'
    },
    description: {
        fontSize: 18
    }
});

const modalStyle = StyleSheet.create({
    rootContainer: {
        justifyContent: "center",
        height: "80%"
    },
    formContainer: {
        flexDirection: "row",
        gap: 15
    },
    title: {
        color: BRAND_RED,
        fontSize: 28,
        marginTop: 50,
        marginBottom: 30
    },
    textInput: {
        borderColor: BRAND_RED,
        borderStyle: "solid",
        borderWidth: 2,
        borderRadius: 10,
        width: 150,
        paddingLeft: 5,
        paddingTop: 10,
        paddingBottom: 10
    },
    loaderContainer: {
        width: 80,
        height: 40,
        justifyContent: "center"
    },
    errorText: {
        color: "red",
        marginBottom: 10
    }
});
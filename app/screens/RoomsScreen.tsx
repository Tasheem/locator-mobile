import { SafeAreaView, View, StyleSheet, Text, TouchableHighlight, FlatList, Modal, TextInput, ActivityIndicator, TouchableOpacity } from "react-native";
import Logo from "../components/Logo";
import { BRAND_RED, CARD_PRIMARY_COLOR, CARD_SECONDARY_COLOR } from "../constants/colors";
import { useEffect, useState } from "react";
import { Room } from "../models/room";
import LokatorButton from "../components/LokatorButton";
import { acceptedRoomObservable, createRoom, disconnectRoomsConnection, emitRooms, establishRoomsConnection, getRoomsForUser } from "../services/room-service";
import { requestUser } from "../services/user-service";
import { NavigationProp, RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../../App";
import Ionicons from "@expo/vector-icons/Ionicons";

type Props = {
    route: RouteProp<RootStackParamList, "Rooms">,
    navigation: NavigationProp<RootStackParamList, "Rooms">
}

export default function RoomsScreen({ route, navigation }: Props) {
    // const [user, setUser] = useState<User | null>(null);
    const [rooms, setRooms] = useState<Room[]>([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [newRoomName, setNewRoomName] = useState("");
    const [isRoomsLoading, setIsRoomsLoading] = useState(false);
    const [isModalButtonLoading, setIsModalButtonLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    
    useEffect(() => {
        setIsRoomsLoading(true);
        getRoomsForUser()
        .then(response => {
            return response.json() as Promise<Room[]>;
        })
        .then(rooms => {
            emitRooms(rooms);
        })
        .catch(err => {
            emitRooms([]);
        })
        .finally(() => {
            setIsRoomsLoading(false);
        });
        
        const userId = route.params.user.id;
        if(!userId) {
            return;  
        }

        establishRoomsConnection(userId);
        const subscription = acceptedRoomObservable().subscribe(rooms => {
            setRooms(rooms);
        });

        return () => {
            subscription.unsubscribe();
            disconnectRoomsConnection();
        }
    }, []);

    return (
        <SafeAreaView style={{flex: 1}}>
            <View style={styles.buttonContainer}>
                <LokatorButton type="Secondary" textValue="New Room" handler={() => {
                    setIsModalVisible(true);
                }} />
            </View>

            {
                isRoomsLoading ? (
                    <ActivityIndicator 
                        animating={true}
                        color={BRAND_RED}
                        style={{
                            marginTop: 10
                        }}
                    />
                ) : null
            }

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
                        underlayColor={BRAND_RED}>
                        <View style={ styles.roomContainer }>
                            <Logo height={50} width={50} />
                            <View style={ styles.descriptionContainer }>
                                <Text style={ styles.description }>{ itemInfo.item.name }</Text>
                                <Text style={ styles.description }>Participants: { itemInfo.item.members.length }</Text>
                            </View>
                            <TouchableOpacity style={styles.trashcanContainer}>
                                <Ionicons name="trash" style={styles.trashcan} size={30} color={BRAND_RED} />
                            </TouchableOpacity>
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
                                isError && !isModalButtonLoading ? (
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
                                    isModalButtonLoading ? (
                                        <View style={modalStyle.loaderContainer}>
                                            <ActivityIndicator 
                                                animating={isModalButtonLoading}
                                                color={BRAND_RED}
                                            />
                                        </View>
                                    ) : (
                                        <LokatorButton type="Primary" textValue="Submit"
                                        handler={async () => {
                                            setIsModalButtonLoading(true);
        
                                            try {
                                                const response = await createRoom(newRoomName);
                                                if(response.status === 201) {
                                                    const room = await response.json() as Room;
                                                    setRooms([...rooms, room]);
                                                    setIsModalVisible(false);
                                                } else {
                                                    setIsError(true);
                                                }
                                            } catch(err: any) {
                                                setIsError(true);
                                            } finally {
                                                setIsModalButtonLoading(false);
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
        marginTop: 10,
        marginLeft: 10,
        marginRight: 10,
        borderRadius: 8
    },
    roomContainer: {
        flexDirection: 'row',
        borderWidth: 2,
        borderColor: CARD_SECONDARY_COLOR,
        backgroundColor: CARD_PRIMARY_COLOR,
        borderRadius: 8,
        width: '100%',
        padding: 10,
        alignItems: "center"
    },
    descriptionContainer: {
        marginLeft: 10,
        justifyContent: 'space-between'
    },
    description: {
        fontSize: 18
    },
    trashcanContainer: {
        flexDirection: "row",
        justifyContent: "flex-end",
        flexBasis: "50%"
    },
    trashcan: {
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
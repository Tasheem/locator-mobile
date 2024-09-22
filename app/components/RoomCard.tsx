import { StyleSheet, TouchableHighlight, TouchableOpacity, View, Text, DimensionValue } from "react-native";
import Logo from "./Logo";
import Ionicons from "react-native-vector-icons/Ionicons";
import { deleteRoom, deleteRoomAndEmit, emitRooms } from "../services/room-service";
import { BRAND_RED, CARD_PRIMARY_COLOR, CARD_SECONDARY_COLOR } from "../constants/colors";
import { Room } from "../models/room";
import { NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "../../App";
import { User } from "../models/user";

type Props = {
    room: Room
    user: User
    navigation: NavigationProp<RootStackParamList, "Rooms">
    width?: DimensionValue
}

export default function RoomCard({ room, user, navigation, width }: Props) {
    const styles = StyleSheet.create({
        viewContainer: {
            flexDirection: "row",
            justifyContent: "center",
            borderRadius: 8,
        },
        roomContainer: {
            flexDirection: "row",
            borderWidth: 2,
            borderColor: CARD_SECONDARY_COLOR,
            backgroundColor: CARD_PRIMARY_COLOR,
            borderRadius: 8,
            width: width,
            padding: 10,
            alignItems: "center",
        },
        descriptionContainer: {
            marginLeft: 10,
            justifyContent: "space-between",
            flex: 1,
        },
        description: {
            fontSize: 18,
        },
        trashcanContainer: {},
        trashcan: {}
    });

    return (
        <TouchableHighlight
            onPress={() => {
                navigation.navigate("RoomDetails", {
                    room: room,
                    user: user
                });
            }}
            style={styles.viewContainer}
            underlayColor={BRAND_RED}
        >
            <View style={styles.roomContainer}>
                <Logo height={50} width={50} />
                <View style={styles.descriptionContainer}>
                    <Text style={styles.description}>{room.name}</Text>
                    <Text style={styles.description}>
                        Participants: {room.members.length}
                    </Text>
                </View>
                <TouchableOpacity
                    style={styles.trashcanContainer}
                    onPress={async () => {
                        const response = await deleteRoom(room.id);
                        if (response.ok) {
                            deleteRoomAndEmit(room);
                        }
                    }}
                >
                    <Ionicons
                        name="trash"
                        style={styles.trashcan}
                        size={30}
                        color={BRAND_RED}
                    />
                </TouchableOpacity>
            </View>
        </TouchableHighlight>
    )
}
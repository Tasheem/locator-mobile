import { StyleSheet, TouchableHighlight, TouchableOpacity, View, Text, DimensionValue, Alert } from 'react-native';
import Logo from './Logo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { deleteRoom, deleteRoomAndEmit } from '../services/room-service';
import { BRAND_RED, CARD_PRIMARY_COLOR, CARD_SECONDARY_COLOR } from '../constants/colors';
import { Room } from '../models/room';
import { useContext } from 'react';
import { ScreenContext } from '../utils/context';

type Props = {
    room: Room
    width?: DimensionValue
    onPress: () => void
    onLongPress?: () => void
    deleteDisabled?: boolean
}

export default function RoomCard({ room, width, onPress, onLongPress, deleteDisabled }: Props) {
    const { widthRatio } = useContext(ScreenContext);

    const styles = StyleSheet.create({
        viewContainer: {
            flexDirection: 'row',
            justifyContent: 'center',
            borderRadius: 8,
        },
        roomContainer: {
            flexDirection: 'row',
            borderWidth: 2,
            borderColor: CARD_SECONDARY_COLOR,
            backgroundColor: CARD_PRIMARY_COLOR,
            borderRadius: 8,
            width: width,
            padding: 10,
            alignItems: 'center',
        },
        descriptionContainer: {
            marginLeft: 10,
            justifyContent: 'space-between',
            flex: 1,
        },
        description: {
            fontSize: 18 * widthRatio,
        },
        trashcanContainer: {},
        trashcan: {}
    });

    return (
        <TouchableHighlight
            onPress={onPress}
            onLongPress={onLongPress}
            style={styles.viewContainer}
            underlayColor={BRAND_RED}
        >
            <View style={styles.roomContainer}>
                <Logo height={50 * widthRatio} width={50 * widthRatio} />
                <View style={styles.descriptionContainer}>
                    <Text style={styles.description}>{room.name}</Text>
                    <Text style={styles.description}>
                        Participants: {room.members.length}
                    </Text>
                </View>
                
                <TouchableOpacity
                    style={styles.trashcanContainer}
                    onPress={async () => {
                        Alert.alert(
                            'Delete',
                            `Are you sure you want to delete ${room.name}?`,
                            [
                                {
                                    text: 'cancel',
                                    style: 'cancel',
                                },
                                {
                                    text: 'delete',
                                    style: 'destructive',
                                    onPress: async () => {
                                        const response = await deleteRoom(room.id);
                                        if (response.ok) {
                                            deleteRoomAndEmit(room);
                                        }
                                    }
                                }
                            ]
                        )
                    }}
                    disabled={deleteDisabled}
                >
                    <Ionicons
                        name='trash'
                        style={styles.trashcan}
                        size={30 * widthRatio}
                        color={deleteDisabled ? CARD_SECONDARY_COLOR : BRAND_RED}
                    />
                </TouchableOpacity>
            </View>
        </TouchableHighlight>
    )
}
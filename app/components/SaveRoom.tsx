import { View, Text, ActivityIndicator, TextInput, StyleSheet } from "react-native";
import Logo from "./Logo";
import LocatorButton from "./LocatorButton";
import { addRoomAndEmit, createRoom, updateRoom, updateRoomAndEmit } from "../services/room-service";
import { Room } from "../models/room";
import { useContext, useState } from "react";
import { BRAND_RED } from "../constants/colors";
import { ScreenContext } from "../utils/context";

type Props = {
    setIsModalVisible: React.Dispatch<React.SetStateAction<boolean>>
    room?: Room
}

export default function SaveRoom({ setIsModalVisible, room }: Props) {
    const { widthRatio } = useContext(ScreenContext);

    const [newRoomName, setNewRoomName] = useState('');
    const [isModalButtonLoading, setIsModalButtonLoading] = useState(false);
    const [isError, setIsError] = useState(false);

    return (
        <View>
            <LocatorButton
                type='Secondary'
                textValue='Close'
                handler={() => {
                    setIsModalVisible(false);
                }}
            />

            <View style={modalStyle.rootContainer}>
                <View
                    style={{
                        alignItems: 'center',
                    }}
                >
                    <Logo width={100} height={100} />

                    <Text style={modalStyle.title}>{ room ? 'Update Room' : 'Create a Room' }</Text>

                    {isError && !isModalButtonLoading ? (
                        <Text style={modalStyle.errorText}>
                            {room ? 'An error occurred while updating the room' 
                                : 'An error occurred while creating a new room.'}
                        </Text>
                    ) : null}

                    <View style={modalStyle.formContainer}>
                        <TextInput
                            placeholder='Room Name'
                            value={newRoomName}
                            onChangeText={setNewRoomName}
                            style={modalStyle.textInput}
                            autoCapitalize='none'
                        />

                        {isModalButtonLoading ? (
                            <View style={modalStyle.loaderContainer}>
                                <ActivityIndicator
                                    animating={isModalButtonLoading}
                                    color={BRAND_RED}
                                    size={widthRatio > 1.5 ? 'large' : 'small'}
                                />
                            </View>
                        ) : (
                            <LocatorButton
                                type='Primary'
                                textValue='Submit'
                                handler={async () => {
                                    setIsModalButtonLoading(true);

                                    if(room) {
                                        try {
                                            const response = await updateRoom(room.id, newRoomName);
                                            if(response.ok) {
                                                const updatedRoom = await response.json() as Room;
                                                updateRoomAndEmit(updatedRoom);

                                                setNewRoomName('');
                                                setIsModalVisible(false);
                                            } else {
                                                setIsError(true);
                                            }
                                        } catch (err: any) {
                                            setIsError(true);
                                        } finally {
                                            setIsModalButtonLoading(false);
                                        }
                                    } else {
                                        try {
                                            const response = await createRoom(newRoomName);
                                            if (response.status === 201) {
                                                const room = await response.json() as Room;
                                                addRoomAndEmit(room);
    
                                                setNewRoomName('');
                                                setIsModalVisible(false);
                                            } else {
                                                setIsError(true);
                                            }
                                        } catch (err: any) {
                                            setIsError(true);
                                        } finally {
                                            setIsModalButtonLoading(false);
                                        }
                                    }
                                }}
                            />
                        )}
                    </View>
                </View>
            </View>
        </View>
    )
}

const modalStyle = StyleSheet.create({
    rootContainer: {
      justifyContent: 'center',
      height: '80%',
    },
    formContainer: {
      flexDirection: 'row',
      gap: 15,
    },
    title: {
      color: BRAND_RED,
      fontSize: 28,
      marginTop: 50,
      marginBottom: 30,
    },
    textInput: {
      borderColor: BRAND_RED,
      borderStyle: 'solid',
      borderWidth: 2,
      borderRadius: 10,
      width: 150,
      paddingLeft: 5,
      paddingTop: 10,
      paddingBottom: 10,
    },
    loaderContainer: {
      width: 80,
      height: 40,
      justifyContent: 'center',
    },
    errorText: {
      color: 'red',
      marginBottom: 10,
    },
});

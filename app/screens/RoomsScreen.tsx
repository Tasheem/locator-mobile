import {
  SafeAreaView,
  View,
  StyleSheet,
  Text,
  TouchableHighlight,
  FlatList,
  Modal,
  TextInput,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import Logo from "../components/Logo";
import {
  BRAND_RED,
  CARD_PRIMARY_COLOR,
  CARD_SECONDARY_COLOR,
} from "../constants/colors";
import { useEffect, useState } from "react";
import { Room } from "../models/room";
import LocatorButton from "../components/LocatorButton";
import {
  acceptedRoomObservable,
  createRoom,
  deleteRoom,
  disconnectRoomsConnection,
  emitRooms,
  establishRoomsConnection,
  getRoomsForUser,
} from "../services/room-service";
import { NavigationProp, RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../../App";
import Ionicons from "@expo/vector-icons/Ionicons";
import RoomCard from "../components/RoomCard";

type Props = {
  route: RouteProp<RootStackParamList, "Rooms">;
  navigation: NavigationProp<RootStackParamList, "Rooms">;
};

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
      .then((response) => {
        return response.json() as Promise<Room[]>;
      })
      .then((rooms) => {
        emitRooms(rooms);
      })
      .catch((err) => {
        emitRooms([]);
      })
      .finally(() => {
        setIsRoomsLoading(false);
      });

    const userId = route.params.user.id;
    if (!userId) {
      return;
    }

    establishRoomsConnection(userId);
    const subscription = acceptedRoomObservable().subscribe((rooms) => {
      setRooms(rooms);
    });

    return () => {
      subscription.unsubscribe();
      disconnectRoomsConnection();
    };
  }, []);

  const roomCards = rooms.map(room => {
    return (
      <RoomCard room={room} user={route.params.user} navigation={navigation} width={'95%'} key={room.id} />
    );
  })

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.buttonContainer}>
        <LocatorButton
          type="Secondary"
          textValue="New Room"
          handler={() => {
            setIsModalVisible(true);
          }}
        />
      </View>

      {isRoomsLoading ? (
        <ActivityIndicator
          animating={true}
          color={BRAND_RED}
          style={{
            marginTop: 10,
          }}
        />
      ) : null}

      <ScrollView contentContainerStyle={styles.roomsList}>
        { roomCards }
      </ScrollView>

      <Modal
        animationType="slide"
        visible={isModalVisible}
        onRequestClose={() => {
          setIsModalVisible(false);
        }}
      >
        <SafeAreaView>
          <LocatorButton
            type="Secondary"
            textValue="Close"
            handler={() => {
              setIsModalVisible(false);
            }}
          />

          <View style={modalStyle.rootContainer}>
            <View
              style={{
                alignItems: "center",
              }}
            >
              <Logo width={100} height={100} />

              <Text style={modalStyle.title}>Create a Room</Text>

              {isError && !isModalButtonLoading ? (
                <Text style={modalStyle.errorText}>
                  An error occurred while creating a new room.
                </Text>
              ) : null}

              <View style={modalStyle.formContainer}>
                <TextInput
                  placeholder="Room Name"
                  value={newRoomName}
                  onChangeText={setNewRoomName}
                  style={modalStyle.textInput}
                />

                {isModalButtonLoading ? (
                  <View style={modalStyle.loaderContainer}>
                    <ActivityIndicator
                      animating={isModalButtonLoading}
                      color={BRAND_RED}
                    />
                  </View>
                ) : (
                  <LocatorButton
                    type="Primary"
                    textValue="Submit"
                    handler={async () => {
                      setIsModalButtonLoading(true);

                      try {
                        const response = await createRoom(newRoomName);
                        if (response.status === 201) {
                          const room = (await response.json()) as Room;
                          emitRooms([...rooms, room]);

                          setNewRoomName("");
                          setIsModalVisible(false);
                        } else {
                          setIsError(true);
                        }
                      } catch (err: any) {
                        setIsError(true);
                      } finally {
                        setIsModalButtonLoading(false);
                      }
                    }}
                  />
                )}
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
    marginTop: 15,
  },
  roomsList: {
    alignItems: 'center',
    rowGap: 15,
    marginTop: 15
  }
});

const modalStyle = StyleSheet.create({
  rootContainer: {
    justifyContent: "center",
    height: "80%",
  },
  formContainer: {
    flexDirection: "row",
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
    borderStyle: "solid",
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
    justifyContent: "center",
  },
  errorText: {
    color: "red",
    marginBottom: 10,
  },
});

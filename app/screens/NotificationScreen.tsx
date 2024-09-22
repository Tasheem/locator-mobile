import { NavigationProp, RouteProp } from "@react-navigation/native";
import { StyleSheet, View, Text, FlatList, Image } from "react-native";
import { RootStackParamList } from "../../App";
import { useEffect, useState } from "react";
import {
  emitJoinRequests,
  getJoinRoomRequests,
  notificationObservable,
  sendJoinRoomResponse,
} from "../services/room-service";
import { JoinRoom } from "../models/room";
import {
  BRAND_RED,
  CARD_PRIMARY_COLOR,
  CARD_RED_PRIMARY_COLOR,
} from "../constants/colors";
import LocatorButton from "../components/LocatorButton";
import { Alert } from "react-native";

type Props = {
  route: RouteProp<RootStackParamList, "Notifications">;
  navigation: NavigationProp<RootStackParamList, "Notifications">;
};

export default function NotificationScreen({ route, navigation }: Props) {
  const user = route.params.user;
  const [requests, setRequests] = useState<JoinRoom[]>([]);

  useEffect(() => {
    if (!user.id) {
      return;
    }

    const subscription = notificationObservable().subscribe((joinRequests) => {
      setRequests(joinRequests);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <View style={style.rootContainer}>
      <Text style={style.header}>
        {requests.length} {requests.length === 1 ? "Request" : "Requests"}
      </Text>

      <FlatList
        data={requests}
        keyExtractor={(item) => Math.floor(Math.random() * 100) + ""}
        renderItem={({ item }) => {
          return (
            <View style={style.itemContainer}>
              <View style={style.imageContainer}>
                <Image
                  source={require("../assets/no-profile-pic.png")}
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: 40,
                    borderColor: "black",
                    borderWidth: 2,
                  }}
                />
              </View>

              <View style={style.contentContainer}>
                <View style={style.sentByContainer}>
                  <Text style={style.contentText}>
                    Sent By: {item.sourceUser.username}{" "}
                  </Text>
                </View>
                <View style={style.roomNameContainer}>
                  <Text style={style.contentText}>
                    Room: {item.targetRoom.name}
                  </Text>
                </View>
              </View>
              <View style={style.btnContainer}>
                <LocatorButton
                  type="Secondary"
                  textValue="Decline"
                  handler={() => {
                    const errorTitle = "Error";
                    const errorMessage =
                      "Sorry. The action could not be completed.";

                    sendJoinRoomResponse(item.id, false)
                      .then((response) => {
                        if (
                          response.status === 204 ||
                          response.status === 200
                        ) {
                          const updatedList = requests.filter(
                            (request) => request.id !== item.id
                          );
                          emitJoinRequests(updatedList);
                        } else {
                          Alert.alert(errorTitle, errorMessage);
                        }
                      })
                      .catch(() => {
                        Alert.alert(errorTitle, errorMessage);
                      });
                  }}
                />
                <LocatorButton
                  type="Primary"
                  textValue="Accept"
                  handler={() => {
                    const errorTitle = "Error";
                    const errorMessage =
                      "Sorry. The action could not be completed.";

                    sendJoinRoomResponse(item.id, true)
                      .then((response) => {
                        if (
                          response.status === 204 ||
                          response.status === 200
                        ) {
                          const updatedList = requests.filter(
                            (request) => request.id !== item.id
                          );
                          emitJoinRequests(updatedList);
                        } else {
                          Alert.alert(errorTitle, errorMessage);
                        }
                      })
                      .catch(() => {
                        Alert.alert(errorTitle, errorMessage);
                      });
                  }}
                />
              </View>
            </View>
          );
        }}
      />
    </View>
  );
}

const style = StyleSheet.create({
  rootContainer: {
    alignItems: "center",
  },
  header: {
    color: BRAND_RED,
    fontSize: 28,
    paddingTop: 10,
    paddingBottom: 10,
  },
  itemContainer: {
    backgroundColor: CARD_PRIMARY_COLOR,
    borderColor: CARD_RED_PRIMARY_COLOR,
    borderWidth: 2,
    borderRadius: 40,
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 10,
    paddingRight: 10,
    gap: 15,
    height: 100,
    marginTop: 10,
    marginBottom: 10,
  },
  imageContainer: {
    borderRightWidth: 2,
    borderRightColor: BRAND_RED,
    paddingRight: 10,
    height: "100%",
    justifyContent: "center",
    paddingTop: 10,
    paddingBottom: 10,
  },
  contentContainer: {
    height: "100%",
    paddingTop: 10,
    paddingBottom: 10,
    justifyContent: "center",
    gap: 10,
  },
  btnContainer: {
    borderLeftWidth: 2,
    borderLeftColor: BRAND_RED,
    paddingLeft: 10,
    justifyContent: "space-between",
    height: "100%",
    paddingTop: 10,
    paddingBottom: 10,
  },
  sentByContainer: {},
  roomNameContainer: {},
  contentText: {},
});

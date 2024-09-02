import { SafeAreaView, View, StyleSheet, Text, TouchableHighlight, FlatList } from "react-native";
import { RoomsNavigationProps } from "../../App";
import Logo from "../components/Logo";
import { CARD_PRIMARY_COLOR, CARD_SECONDARY_COLOR } from "../constants/colors";
import { useEffect, useState } from "react";
import { User } from "../models/user";
import { userObservable } from "../services/auth-service";
import { Room } from "../models/room";

export default function RoomsScreen(navigationProps: RoomsNavigationProps) {
    // const [user, setUser] = useState<User | null>(null);
    const [rooms, setRooms] = useState<Room[]>([]);

    
    useEffect(() => {
        const userSubscription = userObservable().subscribe((nextValue) => {
            // setUser(nextValue);
            setRooms(nextValue?.rooms ? nextValue.rooms : []);
        });

        return () => {
            userSubscription.unsubscribe();
        };
    }, []);

    return (
        <SafeAreaView style={{flex: 1}}>
            <FlatList
            data={rooms}
            keyExtractor={(item) => item.id + ""}
            renderItem={(itemInfo) => (
                <TouchableHighlight 
                    onPress={() => {
                        navigationProps.navigation.navigate("RoomDetails", {
                            room: itemInfo.item
                        });
                    }} 
                    style={ styles.viewContainer } 
                    underlayColor={"red"}>
                    <View style={ styles.roomContainer }>
                        <Logo height={50} width={50} />
                        <View style={ styles.descriptionContainer }>
                            <Text style={ styles.description }>{ itemInfo.item.name }</Text>
                            <Text style={ styles.description }>{ itemInfo.item.members.length }</Text>
                        </View>
                    </View>
                </TouchableHighlight>
            )}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
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
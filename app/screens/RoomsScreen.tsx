import {
  SafeAreaView,
  View,
  StyleSheet,
  Modal,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import {
  BRAND_RED,
} from '../constants/colors';
import { useContext, useEffect, useState } from 'react';
import { Room } from '../models/room';
import LocatorButton from '../components/LocatorButton';
import {
  roomsObservable,
  disconnectRoomsConnection,
  emitRooms,
  establishRoomsConnection,
  getRoomsForUser,
} from '../services/room-service';
import { NavigationProp, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../App';
import RoomCard from '../components/RoomCard';
import SaveRoom from '../components/SaveRoom';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { DrawerContext } from '../utils/context';

type Props = {
  route: RouteProp<RootStackParamList, 'Rooms'>;
  navigation: NavigationProp<RootStackParamList, 'Rooms'>;
};

export default function RoomsScreen({ route, navigation }: Props) {
  const drawerNavigation = useContext(DrawerContext);

  const user = route.params.user;
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isRoomsLoading, setIsRoomsLoading] = useState(false);
  const [roomInFocus, setRoomInFocus] = useState<Room | null>(null);

  useEffect(() => {
    // Workaround for react native bug on iOS: https://github.com/software-mansion/react-native-screens/issues/432
    // Had to move this from the options prop on the Stack.Screen in HomeScreen.tsx
    setTimeout(() => {
      navigation.setOptions({
        headerLeft: () => {
          return (
            <Ionicons
              name='menu'
              size={30}
              color={BRAND_RED}
              onPress={() => {
                drawerNavigation?.toggleDrawer();
              }}
            />
          );
        }
      });
    }, 1500);

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

    const userId = user.id;
    if (!userId) {
      return;
    }

    establishRoomsConnection(userId);
    const subscription = roomsObservable().subscribe((rooms) => {
      setRooms(rooms);
    });

    return () => {
      subscription.unsubscribe();
      disconnectRoomsConnection();
    };
  }, []);

  const roomCards = rooms.map(room => {
    const onPress = () => {
        navigation.navigate('RoomDetails', {
            room: room,
            user: user
        });
    };

    const userCreatedThisRoom = user.id && room.creator.id == user.id;
    if(userCreatedThisRoom) {
      return (
        <RoomCard 
          room={room}
          width={'95%'}
          key={room.id}
          onPress={onPress}
          onLongPress={() => {
            setRoomInFocus(room);
            setIsModalVisible(true);
          }}
        />
      );
    }

    return (
      <RoomCard 
        room={room}
        width={'95%'}
        key={room.id}
        onPress={onPress}
        deleteDisabled={true}
      />
    );
  })

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.buttonContainer}>
        <LocatorButton
          type='Secondary'
          textValue='New Room'
          handler={() => {
            setRoomInFocus(null);
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
        animationType='slide'
        visible={isModalVisible}
        onRequestClose={() => {
          setIsModalVisible(false);
        }}
      >
        <SafeAreaView>
          {
            roomInFocus ? (
              <SaveRoom setIsModalVisible={setIsModalVisible} room={roomInFocus} />
            ) : (
              <SaveRoom setIsModalVisible={setIsModalVisible} />
            )
          }
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    alignItems: 'center',
    marginTop: 15,
  },
  roomsList: {
    alignItems: 'center',
    rowGap: 15,
    marginTop: 15
  }
});

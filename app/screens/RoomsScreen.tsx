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
import { DrawerContext, ScreenContext, UserContext } from '../utils/context';
import { TouchableOpacity } from 'react-native-gesture-handler';
import HamburgerMenu from '../components/HamburgerMenu';

type Props = {
  route: RouteProp<RootStackParamList, 'Rooms'>;
  navigation: NavigationProp<RootStackParamList, 'Rooms'>;
};

export default function RoomsScreen({ route, navigation }: Props) {
  const drawerNavigation = useContext(DrawerContext);
  const [user, setUser] = useContext(UserContext);
  const { widthRatio } = useContext(ScreenContext);

  const [rooms, setRooms] = useState<Room[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isRoomsLoading, setIsRoomsLoading] = useState(false);
  const [roomInFocus, setRoomInFocus] = useState<Room | null>(null);

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

    const userId = user?.id;
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

  useEffect(() => {
    const focusUnsubscribe = navigation?.addListener('focus', () => {
      drawerNavigation?.setOptions({
        headerLeft: () => {
          return (
            <HamburgerMenu />
          )
        }
      });
    });

    const blurUnsubscribe = navigation?.addListener('blur', () => {
      const currentNavigationState = navigation.getState();
      /**
       * The RoomsScreen is the first screen on the stack, so if navigating to other screens on the stack
       * the index should be anything but 0. But if navigating to a screen that is unrelated to the stack,
       * this will still be zero.
       */
      if(currentNavigationState.index > 0) {
        drawerNavigation?.setOptions({
          headerLeft: () => {
            return (
              <TouchableOpacity 
                style={{
                  width: 40,
                  flexDirection: 'row',
                  justifyContent: 'center'
                }}
                onPress={() => {
                  navigation.goBack();
                }}
              >
                <Ionicons 
                  name='chevron-back'
                  size={30}
                  color={BRAND_RED}
                />
              </TouchableOpacity>
            );
          }
        })
      }
    });

    return () => {
      if(focusUnsubscribe) {
        focusUnsubscribe();
      }

      if(blurUnsubscribe) {
        blurUnsubscribe();
      }
    }
  }, [navigation]);

  const roomCards = rooms.map(room => {
    const onPress = () => {
        navigation.navigate('RoomDetails', {
            room: room
        });
    };

    const userCreatedThisRoom = user?.id && room.creator.id == user.id;
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
          size={widthRatio > 1.5 ? 'large' : 'small'}
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

import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  StyleSheet,
  View,
  Image,
  Text,
  FlatList,
  ActivityIndicator
} from 'react-native';
import { RoomDetailsParamList } from './RoomDetailsScreen';
import { RouteProp } from '@react-navigation/native';
import {
  BRAND_RED,
  CARD_PRIMARY_COLOR,
  CARD_RED_PRIMARY_COLOR,
  CARD_RED_SECONDARY_COLOR,
  CARD_SECONDARY_COLOR,
} from '../constants/colors';
import { useContext, useEffect, useState } from 'react';
import { User } from '../models/user';
import {
  disconnectParticipantsSocket,
  emitParticipants,
  emitRooms,
  establishParticipantsConnection,
  getRoomsForUser,
  participantsObservable
} from '../services/room-service';
import { Room } from '../models/room';
import { UserContext } from '../utils/context';
import { TouchableOpacity } from 'react-native-gesture-handler';
import PhotoModal from '../components/PhotoModal';
import { LocatorImageData } from '../models/locator-media';
import Ionicons from 'react-native-vector-icons/Ionicons';
import SearchModal from '../components/SearchModal';

type Props = {
  navigation: NativeStackNavigationProp<
    RoomDetailsParamList,
    'Participants',
    undefined
  >;
  route: RouteProp<RoomDetailsParamList, 'Participants'>;
};

export default function ParticipantsScreen({ route }: Props) {
  const [currentUser, setCurrentUser] = useContext(UserContext);

  const room = route.params.room;
  const [members, setMembers] = useState<User[]>([]);
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [imageInFocus, setImageInFocus] = useState<LocatorImageData | null>(null);
  const [searchModalVisible, setSearchModalVisible] = useState(false);

  useEffect(() => {
    // Set initial list of members/participants with initial emit to the participants subject.
    emitParticipants(room.members);

    establishParticipantsConnection(room.id);
    const subscription = participantsObservable().subscribe((members) => {
      setMembers(members);

      // Refresh rooms screen to account for updated participant.
      getRoomsForUser()
        .then((response) => {
          return response.json() as Promise<Room[]>;
        })
        .then((rooms) => {
          emitRooms(rooms);
        });
    });

    return () => {
      subscription.unsubscribe();
      disconnectParticipantsSocket();
    };
  }, []);

  useEffect(() => {
    const updatedMembers = [...room.members];
    for(let index in updatedMembers) {
      if(updatedMembers[index].username && currentUser?.username && updatedMembers[index].username == currentUser.username) {
        updatedMembers[index] = {...currentUser}
      }
    }

    setMembers(updatedMembers);
  }, [currentUser]);

  return (
    <View style={style.rootContainer}>
      <View style={style.addBtnContainer}>
        {
          <TouchableOpacity
            style={style.addBtnTouchable}
            key={'AddBtn'}
            onPress={async () => {
                setSearchModalVisible(true);
            }}
          >
            <Ionicons
                name='add-circle-outline'
                size={40}
                color={BRAND_RED}
            />
          </TouchableOpacity>
        }
      </View>

      <FlatList
        data={members}
        numColumns={2}
        keyExtractor={(item) => item.id + ''}
        contentContainerStyle={{
          marginTop: 15,
          rowGap: 40,
        }}
        renderItem={({ item }) => (
          <View
            style={
              item.id === currentUser?.id
                ? [style.itemContainer, style.itemContainerUser]
                : style.itemContainer
            }
          >
            <TouchableOpacity
              onPress={() => {
                if(item.profilePictureUrl) {
                  setImageInFocus({
                    publicUrl: item.profilePictureUrl,
                    imageType: '',
                    createDate: ''
                  });

                  setImageModalVisible(true);
                }
              }}
            >
              <Image
                source={
                    item.profilePictureUrl ? 
                    {
                      uri: item.profilePictureUrl
                    } : require('../assets/no-profile-pic.png')
                }
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 40,
                  borderColor: 'black',
                  borderWidth: 2
                }}
              />
            </TouchableOpacity>
            <Text
              style={
                item.id === currentUser?.id
                  ? [style.username, style.mainUser]
                  : style.username
              }
            >
              {item.username}
            </Text>
          </View>
        )}
      />

      <PhotoModal
        modalVisible={imageModalVisible}
        photo={imageInFocus}
        onClose={() => {
          setImageModalVisible(false);
          setImageInFocus(null);
        }}
      />

      <SearchModal
        modalVisible={searchModalVisible}
        onClose={() => {
          setSearchModalVisible(false);
        }}
        room={room}
      />
    </View>
  );
}

const style = StyleSheet.create({
  rootContainer: {
    alignItems: 'center',
    height: '100%'
  },
  addBtnContainer: {
    flexDirection: 'row',
    marginTop: 10
  },
  textInput: {
    marginRight: 10,
    borderWidth: 2,
    borderColor: BRAND_RED,
    borderRadius: 10,
    paddingLeft: 10,
    width: '45%',
  },
  itemContainer: {
    borderColor: CARD_SECONDARY_COLOR,
    borderWidth: 2,
    borderRadius: 40,
    backgroundColor: CARD_PRIMARY_COLOR,
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: '45%',
    marginLeft: 10,
    marginRight: 10
  },
  itemContainerUser: {
    borderColor: CARD_RED_SECONDARY_COLOR,
    backgroundColor: CARD_RED_PRIMARY_COLOR,
  },
  username: {
    paddingLeft: 10,
  },
  mainUser: {
    color: 'white',
  },
  addBtnTouchable: {
    justifyContent: 'center',
    alignItems: 'center'
  }
});

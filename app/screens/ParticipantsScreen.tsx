import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  StyleSheet,
  View,
  FlatList,
  Modal,
  SafeAreaView,
  TouchableOpacity
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
import { Blocked, User } from '../models/user';
import {
  disconnectParticipantsSocket,
  emitParticipants,
  emitRooms,
  establishParticipantsConnection,
  getRoomsForUser,
  participantsObservable
} from '../services/room-service';
import { Room } from '../models/room';
import { BlockedContext, UserContext } from '../utils/context';
import PhotoModal from '../components/PhotoModal';
import { LocatorImageData } from '../models/locator-media';
import Ionicons from 'react-native-vector-icons/Ionicons';
import SearchModal from '../components/SearchModal';
import { blockUser, getBlockedUsers, unblockUser } from '../services/user-service';
import Confirmation from '../components/Confirmation';
import Participant from '../components/Participant';

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
  const [blockedUsers, setBlockedUsers] = useContext(BlockedContext);

  const room = route.params.room;
  const [members, setMembers] = useState<User[]>([]);
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [imageInFocus, setImageInFocus] = useState<LocatorImageData | null>(null);
  const [searchModalVisible, setSearchModalVisible] = useState(false);
  const [blockModalVisible, setBlockModalVisible] = useState(false);
  const [blockUserTarget, setBlockUserTarget] = useState<{
    target: User,
    isBlocked: boolean
    handler: ((text?: string) => Promise<void>)
  } | null>(null);

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
    
    getBlockedUsers()
    .then((response) => {
      return response.json() as Promise<Blocked[]>
    })
    .then((blocks) => {
      for(let block of blocks) {
        const target = block.target;
        if(target.id) {
          blockedUsers.set(target.id, block);
        }
      }

      setBlockedUsers(new Map([...blockedUsers]));
    })

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
        renderItem={({ item }) => {
          return (
            <Participant
              isBlockedUser={blockedUsers.has(item.id)}
              isCurrentUser={item.id === currentUser?.id}
              imageUrl={item.profilePictureUrl}
              username={item.username}
              onImagePress={() => {
                if(item.profilePictureUrl) {
                  setImageInFocus({
                    publicUrl: item.profilePictureUrl,
                    imageType: '',
                    createDate: ''
                  });

                  setImageModalVisible(true);
                }
              }}
              onLongPress={() => {
                if(item.id === currentUser?.id) {
                  return;
                }
                
                const blockRequest = async (text?: string) => {
                  const response = await blockUser(item.id, text);
                  if(response.ok) {
                    const blocked = await response.json() as Blocked;
  
                    blockedUsers.set(blocked.target.id, blocked);
                    setBlockedUsers(new Map([...blockedUsers]));
                    setBlockModalVisible(false);
                  }
                }
                
                const unblockRequest = async (text?: string) => {
                  const block = blockedUsers.get(item.id);
                  if(!block) {
                    return;
                  }
                  
                  const response = await unblockUser(block.id);
                  if(response.ok) {
                    blockedUsers.delete(item.id);
                    setBlockedUsers(new Map([...blockedUsers]));
                    setBlockModalVisible(false);
                  }
                }
                
                setBlockUserTarget({
                  target: item,
                  isBlocked: blockedUsers.has(item.id),
                  handler: blockedUsers.has(item.id) ? unblockRequest : blockRequest
                });
                setBlockModalVisible(true);
              }}
            />
          );
        }}
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

      <Modal
        animationType='fade'
        visible={blockModalVisible}
        onRequestClose={() => {
          setBlockUserTarget(null);
          setBlockModalVisible(false);
        }}
      >
        <SafeAreaView>
          <TouchableOpacity
            style={style.backArrowContainer}
            onPress={() => {
              setBlockUserTarget(null);
              setBlockModalVisible(false);
            }}
          >
            <Ionicons
              name='arrow-back-circle'
              color={BRAND_RED}
              size={30}
            />
          </TouchableOpacity>

          <Confirmation
            title={`${blockUserTarget?.isBlocked ? 'Unblock' : 'Block'} ${blockUserTarget?.target.username}`}
            prompt={
              blockUserTarget?.isBlocked ?
              `Are you sure you want to unblock ${blockUserTarget.target.username}? This will remove any filtering of their chat messages.` :
              `Are you sure you want to block ${blockUserTarget?.target.username}? This will filter their chat messages. A reason can be given in the field below.`
            }
            inputPlaceholder='Reason'
            submitText={blockUserTarget?.isBlocked ? 'Unblock' : 'Block'}
            submitHandler={blockUserTarget?.handler}
            useTextField={!blockUserTarget?.isBlocked}
          />
        </SafeAreaView>
      </Modal>
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
  },
  blockedContainer: {
    borderColor: 'rgba(28, 28, 28, 1)',
    backgroundColor: 'rgba(54, 53, 53, 0.9)'
  },
  blockedUser: {
    color: 'white'
  },
  backArrowContainer: {
    flexDirection: 'row',
    marginLeft: 10,
    marginTop: 10
  }
});

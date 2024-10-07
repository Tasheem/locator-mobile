import { useEffect, useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  TextInput,
  View,
  Text,
  Modal,
  Alert,
  ScrollView
} from 'react-native';
import { BRAND_RED, CARD_RED_SECONDARY_COLOR } from '../constants/colors';
import { PlaceType } from '../models/places';
import LocatorButton from '../components/LocatorButton';
import { User } from '../models/user';
import { register } from '../services/auth-service';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import Preferences from '../components/Preferences';
import { fetchPlaceTypes } from '../services/places-service';

type PageProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Register'>;
};

export default function RegisterScreen({ navigation }: PageProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [displayingSuccess, setDisplayingSuccess] = useState(false);
  const [placeTypes, setPlaceTypes] = useState<PlaceType[]>([]);
  const [placeTypesLoading, setPlaceTypesLoading] = useState(false);
  const [selectedPreferences, setSelectedPreferences] = useState(new Set<number>());

  useEffect(() => {
    setPlaceTypesLoading(true);

    fetchPlaceTypes()
    .then((response) => {
      if(!response.ok) {
        return [];
      }

      return response.json() as Promise<PlaceType[]>;
    })
    .then((types) => {
      setPlaceTypes(types);
    })
    .finally(() => {
      setPlaceTypesLoading(false);
    });
  }, []);

  const isFormValid: () => boolean = () => {
    if (password.length < 3) {
      Alert.alert(
        'Invalid',
        'Your password must be at least 3 characters long.'
      );
      return false;
    }

    if (password !== confirmPassword) {
      Alert.alert('Invalid', 'Password and Confirm Password do not match.');
      return false;
    }

    if (selectedPreferences.size === 0) {
      Alert.alert('Invalid', 'At least 1 preference is needed.');
      return false;
    }

    return true;
  };

  /* useEffect(() => {
    console.log('-------------------------- useEffect() --------------------------------');
    console.log(selectedPreferences);
  }, [selectedPreferences]); */

  const submitData = async () => {
    if (!isFormValid()) {
      return;
    }

    const payload: User = {
      username: username,
      password: password,
      firstname: firstName,
      lastname: lastName,
      email: email,
      preferences: Array.from(selectedPreferences).map((preferenceId) => {
        return {
          id: preferenceId,
        } as PlaceType;
      }),
    };

    try {
      const response = await register(payload);
      if(response.status === 201) {
        setDisplayingSuccess(true);
        setTimeout(() => {
          setDisplayingSuccess(false);
          navigation.goBack();
        }, 3500);
      } else if(response.status === 409) {
        Alert.alert(
          'Error',
          `Either the username "${username}" is already taken or the email "${email}" is taken. Please log in if you have an account linked to that email or choose another username.`
        );
      } else if(response.status === 400) {
        Alert.alert(
          'Error',
          'An error occurred when creating your account. Please try again later.'
        );
      }
    } catch (error: any) {
      console.log(error);
      Alert.alert(
        'Error',
        'An error occurred when creating your account. Please try again later.'
      );
    }
  };

  return (
    <SafeAreaView>
      <View style={style.rootContainer}>
        {displayingSuccess ? (
          <Text style={style.successMessage}>
            Profile Successfully Created...
          </Text>
        ) : null}
        <Text style={style.title}>Create Profile</Text>

        <View style={style.formContainer}>
          <View style={style.leftContainer}>
            <TextInput
              placeholder='Username'
              onChangeText={setUsername}
              value={username}
              style={style.textBox}
              autoCapitalize='none'
            />
            <TextInput
              placeholder='Password'
              onChangeText={setPassword}
              value={password}
              style={style.textBox}
              autoCapitalize='none'
              secureTextEntry
            />
            <TextInput
              placeholder='First Name'
              onChangeText={setFirstName}
              value={firstName}
              style={style.textBox}
              autoCapitalize='none'
            />
          </View>

          <View style={style.rightContainer}>
            <TextInput
              placeholder='Email'
              onChangeText={setEmail}
              value={email}
              style={style.textBox}
              autoCapitalize='none'
            />
            <TextInput
              placeholder='Confirm Password'
              onChangeText={setConfirmPassword}
              value={confirmPassword}
              style={style.textBox}
              autoCapitalize='none'
              secureTextEntry
            />
            <TextInput
              placeholder='Last Name'
              onChangeText={setLastName}
              value={lastName}
              style={style.textBox}
              autoCapitalize='none'
            />
          </View>
        </View>

        <View style={style.btnContainer}>
          <LocatorButton
            type='Secondary'
            textValue='Preferences'
            handler={() => {
              setModalVisible(true);
            }}
          />

          {displayingSuccess ? null : (
            <LocatorButton
              type='Primary'
              textValue='Submit'
              handler={submitData}
            />
          )}
        </View>

        <Modal
          animationType='fade'
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(false);
          }}
        >
          <SafeAreaView>
            <ScrollView>
              <LocatorButton
                type='Secondary'
                textValue='Close'
                handler={() => {
                  setModalVisible(false);
                }}
              />

              <Preferences 
                placeTypes={placeTypes}
                placeTypesLoading={placeTypesLoading}
                selectedPlaceTypes={selectedPreferences}
                setSelectedPreferences={setSelectedPreferences}
              />
            </ScrollView>
          </SafeAreaView>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

const style = StyleSheet.create({
  successMessage: {
    color: 'green',
    fontSize: 20,
  },
  rootContainer: {
    height: '90%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  formContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  leftContainer: {
    flex: 1,
    alignItems: 'center',
    gap: 35,
  },
  rightContainer: {
    flex: 1,
    alignItems: 'center',
    gap: 35,
  },
  textBox: {
    width: 160,
    height: 40,
    borderColor: BRAND_RED,
    borderWidth: 2,
    borderRadius: 25,
    paddingLeft: 10,
  },
  btnContainer: {
    marginTop: 40,
    flexDirection: 'row',
    width: '80%',
    justifyContent: 'space-between',
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: BRAND_RED,
    borderWidth: 2,
    height: 50,
    width: 160,
    marginBottom: 20,
    paddingLeft: 15,
  },
  title: {
    fontSize: 20,
    color: CARD_RED_SECONDARY_COLOR,
    marginTop: 15,
    marginBottom: 15
  },
});

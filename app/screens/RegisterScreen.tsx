import { useContext, useEffect, useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  TextInput,
  View,
  Text,
  Modal,
  Alert,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity
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
import { ScreenContext } from '../utils/context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Checkbox from 'expo-checkbox';
import EULA from '../components/EULA';
import Logo from '../components/Logo';

type PageProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Register'>;
};

export default function RegisterScreen({ navigation }: PageProps) {
  const { widthRatio } = useContext(ScreenContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [preferencesModalVisible, setPreferencesModalVisible] = useState(false);
  const [creatingUser, setCreatingUser] = useState(false);
  const [displayingSuccess, setDisplayingSuccess] = useState(false);
  const [placeTypes, setPlaceTypes] = useState<PlaceType[]>([]);
  const [placeTypesLoading, setPlaceTypesLoading] = useState(false);
  const [selectedPreferences, setSelectedPreferences] = useState(new Set<number>());
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [eulaModalVisible, setEulaModalVisible] = useState(false);

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

    if(!agreedToTerms) {
      Alert.alert('Error', 'You must agree to terms to use this application.');
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

    const payload: Omit<User, 'id'> = {
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

    setCreatingUser(true);
    try {
      const response = await register(payload);
      setCreatingUser(false);

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
      setCreatingUser(false);

      console.log(error);
      Alert.alert(
        'Error',
        'An error occurred when creating your account. Please try again later.'
      );
    }
  };

  const style = getStyle(widthRatio);
  return (
    <SafeAreaView>
      <View style={style.rootContainer}>
        <Logo height={100} width={100} />

        <Text style={style.successMessage}>
          { displayingSuccess ? 'Profile Successfully Created...' : ''}
        </Text>

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

        <View style={style.termsContainer}>
          <Checkbox
            color={BRAND_RED}
            value={agreedToTerms}
            style={style.checkbox}
            onValueChange={(isChecked) => {
              setAgreedToTerms(isChecked);
            }}
          />

          <View style={style.termsTextContainer}>
            <Text style={{paddingRight: 4}}>
              I agree to the terms of the
            </Text>
            <TouchableOpacity
              onPress={() => {
                setEulaModalVisible(true);
              }}
            >
              <Text style={{color: BRAND_RED}}>
                Locator User Agreement
              </Text>
            </TouchableOpacity>
            <Text>.</Text>
          </View>
        </View>

        <View style={style.btnContainer}>
          <LocatorButton
            type='Secondary'
            textValue='Preferences'
            handler={() => {
              setPreferencesModalVisible(true);
            }}
          />

          {displayingSuccess || creatingUser ? null : (
            <LocatorButton
              type='Primary'
              textValue='Submit'
              handler={submitData}
            />
          )}

          {
            creatingUser ? (
              <ActivityIndicator
                animating={true}
                color={BRAND_RED}
                style={{
                  marginRight: 25
                }}
              />
            ) : null
          }

          {
            displayingSuccess ? (
              <Ionicons
                name='checkmark'
                size={30}
                color={'green'}
                style={{
                  marginRight: 25
                }}
              />
            ) : null
          }
        </View>

        <Modal
          animationType='fade'
          visible={preferencesModalVisible}
          onRequestClose={() => {
            setPreferencesModalVisible(false);
          }}
        >
          <SafeAreaView>
            <ScrollView>
              <TouchableOpacity
                style={style.backArrowContainer}
                onPress={() => {
                  setPreferencesModalVisible(false);
                }}
              >
                <Ionicons
                  name='arrow-back-circle'
                  color={BRAND_RED}
                  size={30}
                />
              </TouchableOpacity>

              <Preferences 
                placeTypes={placeTypes}
                placeTypesLoading={placeTypesLoading}
                selectedPlaceTypes={selectedPreferences}
                setSelectedPreferences={setSelectedPreferences}
              />
            </ScrollView>
          </SafeAreaView>
        </Modal>

        <Modal
          animationType='fade'
          visible={eulaModalVisible}
          onRequestClose={() => {
            setEulaModalVisible(false);
          }}
        >
          <SafeAreaView>
            <ScrollView>
              <TouchableOpacity
                style={style.backArrowContainer}
                onPress={() => {
                  setEulaModalVisible(false);
                }}
              >
                <Ionicons
                  name='arrow-back-circle'
                  color={BRAND_RED}
                  size={30}
                />
              </TouchableOpacity>
              <EULA />
            </ScrollView>
          </SafeAreaView>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

const getStyle = (widthRatio: number) => {
  const style = StyleSheet.create({
    successMessage: {
      color: 'green',
      fontSize: 20,
      padding: 10
    },
    rootContainer: {
      height: '95%',
      justifyContent: 'center',
      alignItems: 'center'
    },
    formContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      width: '100%',
      gap: widthRatio > 1.8 ? 40 : 10,
      padding: 10
    },
    leftContainer: {
      flex: 1,
      alignItems: 'center',
      gap: 35
    },
    rightContainer: {
      flex: 1,
      alignItems: 'center',
      gap: 35
    },
    textBox: {
      width: '100%',
      height: 40,
      borderColor: BRAND_RED,
      borderWidth: 2,
      borderRadius: 25,
      paddingLeft: 10
    },
    termsContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: widthRatio > 1.8 ? 40 : 10,
      padding: 20
    },
    checkbox: {
    },
    termsTextContainer: {
      flexDirection: 'row'
    },
    btnContainer: {
      marginTop: 10,
      flexDirection: 'row',
      width: '80%',
      justifyContent: 'space-between'
    },
    itemContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      borderColor: BRAND_RED,
      borderWidth: 2,
      height: 50,
      width: 160,
      marginBottom: 20,
      paddingLeft: 15
    },
    title: {
      fontSize: 20,
      color: CARD_RED_SECONDARY_COLOR,
      marginTop: 15,
      marginBottom: 15
    },
    backArrowContainer: {
      flexDirection: 'row',
      marginLeft: 10,
      marginTop: 10
    }
  });
  
  return style;
}

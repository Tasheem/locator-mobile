import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Dimensions,
  ActivityIndicator
} from 'react-native';
import LocatorButton from '../components/LocatorButton';
import Logo from '../components/Logo';
import { useContext, useState } from 'react';
import { login } from '../services/auth-service';
import { BRAND_RED } from '../constants/colors';
import { ScreenContext } from '../utils/context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';

export default function LoginScreen(navigationProp: NativeStackScreenProps<RootStackParamList, 'Login'>) {
  const { heightRatio, widthRatio } = useContext(ScreenContext);

  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const style = getStyle(heightRatio, widthRatio);

  return (
    <View style={style.formContainer}>
      {/* <Logo height={100 * widthRatio} width={100 * widthRatio} /> */}
      <Logo height={100} width={100} />

      {
        isLoggingIn ? (
          <ActivityIndicator
            animating={isLoggingIn}
            color={BRAND_RED}
            size={widthRatio > 1.5 ? 'large' : 'small'}
          />
        ) : null
      }

      <View style={style.inputContainer}>
        {error && !isLoggingIn ? (
          <View style={style.errorContainer}>
            <Text
              style={{
                color: 'red'
              }}
            >
              { errorMessage }
            </Text>
          </View>
        ) : null}
        <TextInput
          placeholder='Username'
          style={[style.inputField, style.usernameInput]}
          onChangeText={setUsername}
          value={username}
          autoCapitalize='none'
        />
        <TextInput
          secureTextEntry
          placeholder='Password'
          style={[style.inputField, style.passwordInput]}
          onChangeText={setPassword}
          value={password}
          autoCapitalize='none'
        />
      </View>

      <LocatorButton
        handler={async () => {
          setIsLoggingIn(true);

          try {
            const response = await login(username, password);

            if(!response.ok) {
              setErrorMessage('Incorrect username/password.');
              setError(true);
            }
          } catch (error: any) {
            setErrorMessage('The server is down for maintainence. Please try again later.')
            setError(true);
            console.log(error);
          } finally {
            setIsLoggingIn(false);
          }
        }}
        type='Primary'
        // fontSize={20 * widthRatio}
        padding='wide'
        textValue='Login'
      />

      <LocatorButton
        type='Secondary'
        textValue='Register'
        handler={() => {
          navigationProp.navigation.navigate('Register');
        }}
        // fontSize={14 * widthRatio}
      />
    </View>
  );
}

const getStyle = (heightRatio: number, widthRatio: number) => {
  return StyleSheet.create({
    logo: {
      width: 50,
      height: 50
    },
    errorContainer: {
      width: Dimensions.get('window').width - 80
    },
    formContainer: {
      height: '95%',
      justifyContent: 'center',
      alignItems: 'center',
      // rowGap: 25 * heightRatio
      rowGap: 25
    },
    inputContainer: {
      // rowGap: 25 * heightRatio
      rowGap: 25
    },
    inputField: {
      borderColor: BRAND_RED,
      borderWidth: 2,
      borderRadius: 8,
      // height: 40 * heightRatio,
      height: 40,
      width: Dimensions.get('window').width - 80,
      // paddingLeft: 8 * widthRatio
      paddingLeft: 8
    },
    usernameInput: {
      // fontSize: 14 * widthRatio
    },
    passwordInput: {
      // fontSize: 14 * widthRatio
    }
  });
}

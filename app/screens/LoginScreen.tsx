import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Dimensions,
  ActivityIndicator,
  Button,
} from 'react-native';
import { LoginNavigationProps } from '../../App';
import LocatorButton from '../components/LocatorButton';
import Logo from '../components/Logo';
import { useState } from 'react';
import { login } from '../services/auth-service';
import { BRAND_RED } from '../constants/colors';

export default function LoginScreen(navigationProp: LoginNavigationProps) {
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  return (
    <View style={styles.formContainer}>
      <Logo height={100} width={100} />

      <ActivityIndicator
        animating={isLoggingIn}
        color={brandColor}
        style={{
          height: isLoggingIn ? 'auto' : 0,
        }}
        />

      <View style={styles.inputContainer}>
        {error && !isLoggingIn ? (
          <View style={styles.errorContainer}>
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
          style={[styles.inputField, styles.usernameInput]}
          onChangeText={setUsername}
          value={username}
        />
        <TextInput
          secureTextEntry
          placeholder='Password'
          style={[styles.inputField, styles.passwordInput]}
          onChangeText={setPassword}
          value={password}
        />
      </View>

      <LocatorButton
        handler={async () => {
          setIsLoggingIn(true);
          console.log('username:', username);
          console.log('password:', password);

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
        fontSize={20}
        padding='wide'
        textValue='Login'
      />

      <Button
        title='Register'
        color={BRAND_RED}
        onPress={() => {
          navigationProp.navigation.navigate('Register');
        }}
      />
    </View>
  );
}

const brandColor = '#c96b6b';
const styles = StyleSheet.create({
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
    rowGap: 25
  },
  inputContainer: {
    rowGap: 25
  },
  inputField: {
    borderColor: brandColor,
    borderWidth: 1,
    borderRadius: 8,
    height: 40,
    width: Dimensions.get('window').width - 80,
    paddingLeft: 5
  },
  usernameInput: {},
  passwordInput: {},
});

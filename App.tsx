import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Button, Image, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';

export default function App() {
  const [diet, setDiet] = useState('');
  const [location, setLocation] = useState<string | null>(null);

  const [open, setOpen] = useState(false);
  const [cities, setCities] = useState([
    {label: 'Alabama', value: 'Alabama', disabled: true, labelStyle: { opacity: 0.5 }},
    {label: 'Birmingham', value: 'Birmingham, Alabama', parent: 'Alabama'},

    {label: 'Georgia', value: 'Georgia', disabled: true, labelStyle: { opacity: 0.5 }},
    {label: 'Atlanta', value: 'Atlanta, Georgia', parent: 'Georgia'}
  ]);

  useEffect(() => {
    console.log(location);
  }, [location]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.formContainer}>
        <View style={styles.inputContainer}>
          <TextInput style={[
            styles.inputField, 
            {
              flexBasis: '100%'
            }
          ]}
          placeholder='Diet' />
          <View style={[ styles.inputField, { borderWidth: 0 } ]}>
            <DropDownPicker
              open={open}
              value={location}
              items={cities}
              setOpen={setOpen}
              setValue={setLocation}
              setItems={setCities}
            />
          </View>
        </View>
        <View style={styles.formBtnContainer}>
          <Button title='Search' />
        </View>
      </View>

      <View style={styles.resultsContainer}>
        <Image source={require('./assets/favicon.png')} />
        <View style={styles.informationContainer}>
          <Text>
            <Text style={styles.label}>Name:</Text>
            <Text>Starbucks</Text>
          </Text>

          <Text>
            <Text style={styles.label}>Address:</Text>
            <Text>600 Congress Ave</Text>
          </Text>

          <Text>
            <Text style={styles.label}>Type:</Text>
            <Text>Coffee shop</Text>
          </Text>
        </View>
      </View>

      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  formContainer: {
    flexDirection: 'row',
    marginLeft: 5,
    /* marginBottom: 20 */
  },
  inputContainer: {
    flex: 2,
    flexDirection: 'row',
    flexWrap: 'wrap',
    rowGap: 5,
  },
  inputField: {
    flex: 1,
    justifyContent: 'space-between',
    borderColor: '#bfbfbf',
    borderWidth: 1,
    height: 40,
    paddingLeft: 5
  },
  formBtnContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  resultsContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  thumbnail: {
    width: 50,
    height: 50
  },
  label: {
    fontWeight: 'bold'
  },
  informationContainer: {

  }
});

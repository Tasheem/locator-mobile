import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Button, Image, SafeAreaView, SectionList, SectionListRenderItem, StyleSheet, Text, TextInput, View } from 'react-native';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import DropDownPicker from 'react-native-dropdown-picker';

type Section = {
  title: string
  data: SectionData[]
}

type SectionData = {
  imageSrc: string
  name: string
  address: string
  type: string
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  formContainer: {
    flexDirection: 'row',
    marginLeft: 5,
    marginBottom: 20,
    zIndex: 2
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
  }
});

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

  const sections: Section[] = [
    {
      title: 'Coffee',
      data: [
        {
          imageSrc: './assets/favicon.png',
          name: 'Starbucks',
          address: '600 Congress Ave',
          type: 'Coffee shop'
        },
        {
          imageSrc: './assets/favicon.png',
          name: 'Item 2',
          address: 'Some Address',
          type: 'Restaurant'
        },
        {
          imageSrc: './assets/favicon.png',
          name: 'Item 3',
          address: 'Some Other Address',
          type: 'Fast Food'
        }
      ]
    }
  ]

  useEffect(() => {
    console.log(`Diet: ${diet}`)
    console.log(`Location: ${location}`);
  }, [diet, location]);

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
          placeholder='Diet'
          onChangeText={setDiet}
          value={diet} />

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

      <SectionList
        sections={sections}
        keyExtractor={(item, index) => '' + index}
        renderItem={renderResultRow}
        renderSectionHeader={({section: {title}}) => (
          <Text style={{ fontSize: 24 }}>{title}</Text>
        )}
      ></SectionList>

      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const renderResultRow: SectionListRenderItem<SectionData, Section> = (sectionData) => {
  const resultsStyle = StyleSheet.create({
    resultsRowContainer: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 10,
      zIndex: 1
    },
    thumbnail: {
      width: 70,
      height: 70
    },
    informationContainer: {
      height: 70,
      justifyContent: 'space-between',
      flex: 4,
      paddingLeft: 20
    },
    detailsRow: {
      flexDirection: 'row'
    },
    label: {
      fontWeight: 'bold',
      paddingRight: 5
    },
    checkbox: {
      flex: 1
    }
  });

  return (
    <View style={resultsStyle.resultsRowContainer}>
      <Image style={resultsStyle.thumbnail} source={require('./assets/favicon.png')} />
      <View style={resultsStyle.informationContainer}>
        <View style={resultsStyle.detailsRow}>
          <Text style={resultsStyle.label}>Name:</Text>
          <Text>{sectionData.item.name}</Text>
        </View>

        <View style={resultsStyle.detailsRow}>
          <Text style={resultsStyle.label}>Address:</Text>
          <Text>{sectionData.item.address}</Text>
        </View>

        <View style={resultsStyle.detailsRow}>
          <Text style={resultsStyle.label}>Type:</Text>
          <Text>{sectionData.item.type}</Text>
        </View>
      </View>
      <BouncyCheckbox
        size={25}
        fillColor="#007AFF"
        unfillColor="#FFFFFF"
        iconStyle={{ borderColor: "#007AFF" }}
        innerIconStyle={{ borderWidth: 2 }}
        style={resultsStyle.checkbox}
      />
    </View>
  )
}

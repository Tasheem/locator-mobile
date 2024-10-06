import { ActivityIndicator, StyleSheet, View, Text } from 'react-native';
import { BRAND_RED, CARD_RED_SECONDARY_COLOR } from '../constants/colors';
import { PlaceType } from '../models/places';
import Checkbox from 'expo-checkbox';
import { useContext } from 'react';
import { ScreenContext } from '../utils/context';


type Props = {
    placeTypes: PlaceType[]
    placeTypesLoading: boolean
    selectedPlaceTypes: Set<number>
    setSelectedPreferences: React.Dispatch<React.SetStateAction<Set<number>>>
}

export default function Preferences({ placeTypes, placeTypesLoading, selectedPlaceTypes, setSelectedPreferences }: Props) {
    return (
        <View style={style.rootContainer}>
            <Text style={style.title}>Choose Preferences</Text>
            { renderPlaceTypes(placeTypes, placeTypesLoading, selectedPlaceTypes, setSelectedPreferences) }
        </View>
    );
}

const renderPlaceTypes = (placeTypes: PlaceType[], placeTypesLoading: boolean, selectedPlaceTypes: Set<number>, setSelectedPreferences: React.Dispatch<React.SetStateAction<Set<number>>>) => {
    const { widthRatio } = useContext(ScreenContext);
    const items = placeTypes.map(item => {
        return (
            <View style={style.itemContainer} key={item.id}>
                <View style={style.itemTextContainer}>
                    <Text>{item.displayName}</Text>
                </View>
                <Checkbox
                    color={BRAND_RED}
                    value={selectedPlaceTypes.has(item.id)}
                    style={style.checkbox}
                    onValueChange={(isChecked) => {
                        if (isChecked) {
                            addPreference(item.id, selectedPlaceTypes, setSelectedPreferences);
                        } else {
                            removePreference(item.id, selectedPlaceTypes, setSelectedPreferences);
                        }
                    }}
                />
            </View>
        );
    });

    return (
      <View>
        <ActivityIndicator
            animating={placeTypesLoading}
            color={BRAND_RED}
            size={widthRatio > 1.5 ? 'large' : 'small'}
        />
        <View style={style.listContainer}>
            { items }
        </View>
      </View>
    );
};

function addPreference(preferenceId: number, selectedPreferences: Set<number>, setSelectedPreferences: React.Dispatch<React.SetStateAction<Set<number>>>) {
    const updatedSet = new Set([...selectedPreferences]);
    updatedSet.add(preferenceId);
    setSelectedPreferences(updatedSet);
}

function removePreference(preferenceId: number, selectedPreferences: Set<number>, setSelectedPreferences: React.Dispatch<React.SetStateAction<Set<number>>>) {
    const updatedSet = new Set(selectedPreferences);
    updatedSet.delete(preferenceId);
    setSelectedPreferences(updatedSet);
}

const style = StyleSheet.create({
    rootContainer: {
        alignItems: 'center'
    },
    listContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        columnGap: 15,
        rowGap: 20,
        justifyContent: 'center'
    },
    title: {
        fontSize: 20,
        color: CARD_RED_SECONDARY_COLOR,
        marginTop: 15
    },
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: BRAND_RED,
        borderWidth: 2,
        height: 50,
        width: 160,
        paddingLeft: 15
    },
    itemTextContainer: {
        flexDirection: 'row',
        width: '70%'
    },
    checkbox: {
        borderRadius: 15,
        padding: 10
    }
})
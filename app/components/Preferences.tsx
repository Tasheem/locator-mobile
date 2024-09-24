import { ActivityIndicator, FlatList, StyleSheet, View, Text, ScrollView } from 'react-native';
import { BRAND_RED, CARD_RED_SECONDARY_COLOR } from '../constants/colors';
import { PlaceType } from '../models/places';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import { useEffect, useState } from 'react';
import { fetchPlaceTypes } from '../services/places-service';

type Props = {
    placeTypes: PlaceType[]
    placeTypesLoading: boolean
    selectedPlaceTypes: Set<number>
}

export default function Preferences({ placeTypes, placeTypesLoading, selectedPlaceTypes }: Props) {
    return (
        <View style={style.rootContainer}>
            <Text style={style.title}>Choose Preferences</Text>
            { renderPlaceTypes(placeTypes, placeTypesLoading, selectedPlaceTypes) }
        </View>
    );
}

const renderPlaceTypes = (placeTypes: PlaceType[], placeTypesLoading: boolean, selectedPlaceTypes: Set<number>) => {
    const items = placeTypes.map(item => {
        return (
            <View style={style.itemContainer} key={item.id}>
                <View style={style.itemTextContainer}>
                    <Text>{item.displayName}</Text>
                </View>
                <BouncyCheckbox
                    size={25}
                    fillColor={BRAND_RED}
                    unfillColor='#FFFFFF'
                    iconStyle={{ borderColor: BRAND_RED }}
                    innerIconStyle={{ borderWidth: 2 }}
                    isChecked={selectedPlaceTypes.has(item.id)}
                    onPress={(isChecked) => {
                    if (isChecked) {
                        selectedPlaceTypes.add(item.id);
                    } else {
                        selectedPlaceTypes.delete(item.id);
                    }
                    }}
                />
            </View>
        );
    });

    return (
      <View>
        <ActivityIndicator animating={placeTypesLoading} color={BRAND_RED} />
        <View style={style.listContainer}>
            { items }
        </View>
      </View>
    );
};

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
    }
})
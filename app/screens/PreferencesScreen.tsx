import { Alert, SafeAreaView, ScrollView, StyleSheet, View } from "react-native"
import Preferences from "../components/Preferences"
import { RootStackParamList } from "../../App"
import { DrawerScreenProps } from "@react-navigation/drawer"
import { useEffect, useState } from "react";
import { PlaceType } from "../models/places";
import { fetchPlaceTypes } from "../services/places-service";
import { getUserPreferences, updateUserPreferences } from "../services/user-service";
import LocatorButton from "../components/LocatorButton";

const selectedPlaceTypes = new Set<number>();

export default function PreferencesScreen({ route, navigation }: DrawerScreenProps<RootStackParamList, 'Preferences'>) {
    const user = route.params.user;
    const [placeTypes, setPlaceTypes] = useState<PlaceType[]>([]);
    const [placeTypesLoading, setPlaceTypesLoading] = useState(false);

    useEffect(() => {
        if (selectedPlaceTypes.size > 0) {
            selectedPlaceTypes.clear();
        }
        setPlaceTypesLoading(true);
    
        fetchPlaceTypes()
        .then((types) => {
            setPlaceTypes(types);
        })
        .finally(() => {
            setPlaceTypesLoading(false);
        });
        
        getUserPreferences()
        .then(response => {
            return response.json();
        })
        .then((preferences: PlaceType[]) => {
            for(let preference of preferences) {
                selectedPlaceTypes.add(preference.id);
            }
        })
        .catch(() => {
            setPlaceTypes([]); // to prevent user from selecting preferences even though their persisted preferences aren't showing.
            Alert.alert('Error', 'An error occurred while loading your save preferences. Please try again later.', [
                {
                    'text': 'OK'
                }
            ]);
        });
    }, []);

    return (
        <SafeAreaView>
            <ScrollView>
                <LocatorButton type="Primary" textValue="Save" handler={() => {
                    updateUserPreferences(Array.from(selectedPlaceTypes))
                    .then(response => {
                        if(response.ok) {
                            Alert.alert('Success', 'Your new preferences have been saved.');
                        } else {
                            Alert.alert('Error', 'An error occurred while saving your preferences. Please try again later.');
                        }
                    })
                    .catch(() => {
                        Alert.alert('Error', 'An error occurred while saving your preferences. Please try again later.');
                    });
                }} />
                <Preferences 
                    placeTypes={placeTypes}
                    placeTypesLoading={placeTypesLoading}
                    selectedPlaceTypes={selectedPlaceTypes}
                />
            </ScrollView>
        </SafeAreaView>
    );
}
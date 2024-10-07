import { ActivityIndicator, Alert, SafeAreaView, ScrollView } from "react-native"
import Preferences from "../components/Preferences"
import { RootStackParamList } from "../../App"
import { DrawerScreenProps } from "@react-navigation/drawer"
import { useContext, useEffect, useState } from "react";
import { PlaceType } from "../models/places";
import { fetchPlaceTypes } from "../services/places-service";
import { getUserPreferences, updateUserPreferences } from "../services/user-service";
import LocatorButton from "../components/LocatorButton";
import { BRAND_RED } from "../constants/colors";
import { ScreenContext } from "../utils/context";


export default function PreferencesScreen({ route, navigation }: DrawerScreenProps<RootStackParamList, 'Preferences'>) {
    const { widthRatio } = useContext(ScreenContext);

    const [placeTypes, setPlaceTypes] = useState<PlaceType[]>([]);
    const [placeTypesLoading, setPlaceTypesLoading] = useState(false);
    const [originalPreferences, setOriginalPreferences] = useState(new Set<number>());
    const [selectedPreferences, setSelectedPreferences] = useState(new Set<number>());
    const [saving, setSaving] = useState(false);

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
            getUserPreferences()
            .then(response => {
                if(!response.ok) {
                    return [];
                }

                return response.json();
            })
            .then((preferences: PlaceType[]) => {
                const original = new Set<number>();
                const selected = new Set<number>();
                for(let preference of preferences) {
                    original.add(preference.id);
                    selected.add(preference.id);
                }
    
                setOriginalPreferences(original);
                setSelectedPreferences(selected);
                setPlaceTypes(types);
            })
            .catch(() => {
                setPlaceTypes([]); // to prevent user from selecting preferences even though their persisted preferences aren't showing.
                Alert.alert('Error', 'An error occurred while loading your save preferences. Please try again later.', [
                    {
                        'text': 'OK'
                    }
                ]);
            });
        })
        .finally(() => {
            setPlaceTypesLoading(false);
        });
    }, []);

    useEffect(() => {
        const blurUnsubscribe = navigation.addListener('blur', () => {
            setSelectedPreferences(new Set([...originalPreferences]));
        });

        return () => {
            blurUnsubscribe();
        }
    }, [originalPreferences])

    return (
        <SafeAreaView>
            <ScrollView>
                {
                    saving ? (
                        <ActivityIndicator
                            animating={saving}
                            color={BRAND_RED}
                            size={widthRatio > 1.5 ? 'large' : 'small'}
                        />
                    ) : (
                        <LocatorButton
                            type="Primary"
                            textValue="Save"
                            handler={() => {
                                setSaving(true);

                                updateUserPreferences(Array.from(selectedPreferences))
                                .then(response => {
                                    if(response.ok) {
                                        setOriginalPreferences(new Set([...selectedPreferences]));
                                        Alert.alert('Success', 'Your new preferences have been saved.');
                                    } else {
                                        Alert.alert('Error', 'An error occurred while saving your preferences. Please try again later.');
                                    }
                                })
                                .catch(() => {
                                    Alert.alert('Error', 'An error occurred while saving your preferences. Please try again later.');
                                })
                                .finally(() => {
                                    setSaving(false);
                                });
                            }}
                        />
                    )
                }
                <Preferences 
                    placeTypes={placeTypes}
                    placeTypesLoading={placeTypesLoading}
                    selectedPlaceTypes={selectedPreferences}
                    setSelectedPreferences={setSelectedPreferences}
                />
            </ScrollView>
        </SafeAreaView>
    );
}
import { useState } from "react";
import { SafeAreaView, StyleSheet, TextInput, View, Text, FlatList, Modal } from "react-native";
import { BRAND_RED, CARD_RED_SECONDARY_COLOR } from "../constants/colors";
import { PlaceType } from "../models/lokator-place-type";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import LokatorButton from "../components/LokatorButton";
import { fetchPlaceTypes } from "../services/places-service";

export default function RegisterScreen() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [placeTypes, setPlaceTypes] = useState<PlaceType[]>([]);
    const [modalVisible, setModalVisible] = useState(false);

    fetchPlaceTypes()
    .then(types => {
        setPlaceTypes(types);
    });

    return (
        <SafeAreaView>
            <View style={style.rootContainer}>
                <Text style={style.title}>Create Profile</Text>

                <View style={style.formContainer}>
                    <View style={style.leftContainer}>
                        <TextInput
                            placeholder="Username"
                            onChangeText={setUsername}
                            value={username}
                            style={style.textBox}
                        />
                        <TextInput
                            placeholder="Password"
                            onChangeText={setPassword}
                            value={password}
                            style={style.textBox}
                            secureTextEntry
                        />
                        <TextInput
                            placeholder="First Name"
                            onChangeText={setFirstName}
                            value={firstName}
                            style={style.textBox}
                        />
                    </View>

                    <View style={style.rightContainer}>
                        <TextInput
                            placeholder="Email"
                            onChangeText={setEmail}
                            value={email}
                            style={style.textBox}
                        />
                        <TextInput
                            placeholder="Confirm Password"
                            onChangeText={setConfirmPassword}
                            value={confirmPassword}
                            style={style.textBox}
                            secureTextEntry
                        />
                        <TextInput
                            placeholder="Last Name"
                            onChangeText={setLastName}
                            value={lastName}
                            style={style.textBox}
                        />
                    </View>
                </View>

                <View style={style.btnContainer}>
                    <LokatorButton type="Secondary" textValue="Preferences"
                    handler={() => {
                        setModalVisible(true);
                    }} />

                    <LokatorButton type="Primary" textValue="Submit"
                        handler={() => {

                        }} 
                    />
                </View>

                <Modal
                animationType="slide"
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(false);
                }}>
                    <SafeAreaView>
                        <LokatorButton type="Secondary" textValue="Close"
                        handler={() => {
                            setModalVisible(false);
                        }} />
                        <View style={style.preferencesContainer}>
                            <Text style={style.title}>Choose Preferences</Text>
                            { renderPlaceTypes(placeTypes) }
                        </View>
                    </SafeAreaView>
                </Modal>
            </View>
        </SafeAreaView>
    );
}

const renderPlaceTypes = (placeTypes: PlaceType[]) => {
    return (
        <FlatList
            data={placeTypes}
            numColumns={2}
            columnWrapperStyle={{
                gap: 30
            }}
            contentContainerStyle={style.flatListContainer}
			keyExtractor={ placeType => placeType.id + "" }
			renderItem={({ item }) => (
                <View style={style.itemContainer}>
                    <View style={style.itemTextContainer}>
                        <Text>{ item.displayName }</Text>
                    </View>
                    <BouncyCheckbox
						size={25}
						fillColor={BRAND_RED}
						unfillColor="#FFFFFF"
						iconStyle={{ borderColor: BRAND_RED }}
						innerIconStyle={{ borderWidth: 2 }}
					/>
                </View>
            )}
        />
    )
}

const style = StyleSheet.create({
    rootContainer: {
        height: "90%",
        justifyContent: "center",
        alignItems: "center"
    },
    formContainer: {
        flexDirection: "row",
        alignItems: "center",
        width: "100%"
    },
    leftContainer: {
        flex: 1,
        alignItems: "center",
        gap: 35
    },
    rightContainer: {
        flex: 1,
        alignItems: "center",
        gap: 35
    },
    textBox: {
        width: 160,
        height: 40,
        borderColor: BRAND_RED,
        borderWidth: 2,
        borderRadius: 25,
        paddingLeft: 10
    },
    title: {
        fontSize: 20,
        color: CARD_RED_SECONDARY_COLOR,
        marginTop: 15,
        marginBottom: 15
    },
    btnContainer: {
        marginTop: 40,
        flexDirection: "row",
        width: "75%",
        justifyContent: "space-between"
    },
    preferencesContainer: {
        alignItems: "center"
    },
    flatListContainer: {
        paddingBottom: "40%" // React Native FlatList has issue with bottom part of list cutting off.
        /* flexDirection: "row",
        flexWrap: "wrap" */
    },
    itemContainer: {
        flexDirection: "row",
        alignItems: "center",
        borderColor: BRAND_RED,
        borderWidth: 2,
        height: 50,
        width: 160,
        marginBottom: 20,
        paddingLeft: 15
    },
    itemTextContainer: {
        flexDirection: "row",
        width: "70%"
    },
    itemText: {
        flexWrap: "wrap"
    }
});
import { SafeAreaView, View, StyleSheet, Text, Image } from "react-native";
import { HomeNavigationProps } from "../../App";
import Logo from "../components/Logo";
import { BRAND_RED, CARD_PRIMARY_COLOR, CARD_SECONDARY_COLOR } from "../constants/colors";

export default function RoomsScreen(navgationProps: HomeNavigationProps) {
    return (
        <SafeAreaView>
            <View style={ styles.viewContainer }>
                <View style={ styles.roomContainer }>
                    <Logo height={50} width={50} />
                    <View style={ styles.descriptionContainer }>
                        <Text style={ styles.description }>Our Room</Text>
                        <Text style={ styles.description }>Participants: 20</Text>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    viewContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 10
    },
    roomContainer: {
        flexDirection: 'row',
        borderWidth: 2,
        borderColor: CARD_SECONDARY_COLOR,
        backgroundColor: CARD_PRIMARY_COLOR,
        borderRadius: 8,
        width: '98%',
        padding: 10
    },
    descriptionContainer: {
        marginLeft: 10,
        justifyContent: 'space-between'
    },
    description: {
        fontSize: 18
    }
});
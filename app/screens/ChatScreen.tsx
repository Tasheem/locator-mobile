import { View, Text, StyleSheet, Image, FlatList } from "react-native";
import renderImage from "../utils/renderImage";
import { CARD_PRIMARY_COLOR, CARD_SECONDARY_COLOR } from "../constants/colors";

export default function ChatScreen() {
    const messages: {}[] = ['temp'];
    return (
        <FlatList
            data={messages}
            style={style.container}
            renderItem={({ item }) => (
                <View style={style.messageContainer}>
                    <View style={style.imageContainer}>
                        <Image source={require("../assets/no-profile-pic.png")}
                        style={{
                            width: 50,
                            height: 50,
                            borderRadius: 40,
                            borderColor: "black",
                            borderWidth: 2
                        }} />
                    </View>
                    <View style={style.textContainer}>
                        <View style={style.messageDetailsContainer}>
                            <Text>Tasheem Hargrove</Text>
                            <Text>Today 11:00pm</Text>
                        </View>
                        <View style={style.messageContentsContainer}>
                            <Text>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Rerum a perspiciatis consequuntur veritatis est vero fugit officia, doloremque numquam ex, nesciunt cum incidunt inventore corrupti molestias repellat dolore tempora rem?</Text>
                        </View>
                    </View>
                </View>
            )} 
        />
    )
}

const style = StyleSheet.create({
    container: {
        padding: 10,
    },
    messageContainer: {
        flexDirection: "row",
        borderColor: CARD_SECONDARY_COLOR,
        borderWidth: 2,
        borderStyle: "solid",
        borderRadius: 18,
        backgroundColor: CARD_PRIMARY_COLOR
    },
    imageContainer: {
        borderRightColor: CARD_SECONDARY_COLOR,
        borderRightWidth: 2,
        justifyContent: "center",
        paddingLeft: 5,
        paddingRight: 5
    },
    textContainer: {
        flex: 1
    },
    messageDetailsContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        borderBottomColor: CARD_SECONDARY_COLOR,
        borderBottomWidth: 2,
        paddingLeft: 5,
        paddingRight: 5
    },
    messageContentsContainer: {
        paddingLeft: 5,
        paddingRight: 5
    }
});
import { View, Text, StyleSheet, Image, FlatList } from "react-native";
import renderImage from "../utils/renderImage";
import { CARD_RED_PRIMARY_COLOR, CARD_RED_SECONDARY_COLOR, CARD_PRIMARY_COLOR, CARD_SECONDARY_COLOR } from "../constants/colors";

export default function ChatScreen() {
    const messages = [1, 2];
    return (
        <FlatList
            data={messages}
            style={style.container}
            renderItem={({ item }) => (
                <View style={item === 1 ? [style.messageContainer, style.redMessageContainer] : style.messageContainer}>
                    <View style={item === 1 ? [style.imageContainer, style.redImageContainer] : style.imageContainer}>
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
                        <View style={item === 1 ? [style.messageDetailsContainer, style.redDetailsContainer] : style.messageDetailsContainer}>
                            <Text style={item === 1 ? [style.text, style.whiteText] : style.text}>
                                {item === 1 ? "Tasheem Hargrove" : "John Doe"}
                            </Text>
                            <Text style={item === 1 ? [style.text, style.whiteText] : style.text}>
                                {item === 1 ? "Yesterday 11:14pm" : "Today 8:23am"}
                            </Text>
                        </View>
                        <View style={style.messageContentsContainer}>
                            <Text style={item === 1 ? [style.text, style.whiteText] : style.text}>
                                Lorem, ipsum dolor sit amet consectetur adipisicing elit. Rerum a perspiciatis consequuntur veritatis est vero fugit officia, doloremque numquam ex, nesciunt cum incidunt inventore corrupti molestias repellat dolore tempora rem?
                            </Text>
                        </View>
                    </View>
                </View>
            )} 
        />
    )
}

const style = StyleSheet.create({
    container: {
        padding: 10
    },
    messageContainer: {
        flexDirection: "row",
        borderColor: CARD_SECONDARY_COLOR,
        borderWidth: 2,
        borderStyle: "solid",
        borderRadius: 18,
        backgroundColor: CARD_PRIMARY_COLOR,
        marginBottom: 10,
    },
    redMessageContainer: {
        borderColor: CARD_RED_SECONDARY_COLOR,
        backgroundColor: CARD_RED_PRIMARY_COLOR
    },
    imageContainer: {
        borderRightColor: CARD_SECONDARY_COLOR,
        borderRightWidth: 2,
        justifyContent: "center",
        paddingLeft: 5,
        paddingRight: 5,
    },
    redImageContainer: {
        borderRightColor: CARD_RED_SECONDARY_COLOR
    },
    textContainer: {
        flex: 1
    },
    text: {
        color: "black",
        lineHeight: 18
    },
    whiteText: {
        color: "white"
    },
    messageDetailsContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        borderBottomColor: CARD_SECONDARY_COLOR,
        borderBottomWidth: 2,
        paddingLeft: 5,
        paddingRight: 5
    },
    redDetailsContainer: {
        borderBottomColor: CARD_RED_SECONDARY_COLOR
    },
    messageContentsContainer: {
        paddingLeft: 5,
        paddingRight: 5
    }
});
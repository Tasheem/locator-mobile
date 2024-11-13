import { StyleSheet, TouchableOpacity, Image, Text } from "react-native";
import { BRAND_RED, CARD_PRIMARY_COLOR, CARD_RED_PRIMARY_COLOR, CARD_RED_SECONDARY_COLOR, CARD_SECONDARY_COLOR } from "../constants/colors";

type Props = {
    isBlockedUser: boolean
    isCurrentUser: boolean // Flag used to tell whether the participant is the currently logged in user
    onImagePress?: () => void
    onLongPress?: () => void
    imageUrl?: string
    username: string
}

export default function Participant({ isBlockedUser, isCurrentUser, onImagePress, onLongPress, imageUrl, username }: Props) {
    return (
        <TouchableOpacity
            style={
                isBlockedUser ? ([style.itemContainer, style.blockedContainer]) : (isCurrentUser
                    ? [style.itemContainer, style.itemContainerUser]
                    : style.itemContainer)
            }
            onLongPress={onLongPress}
        >
            <TouchableOpacity
                onPress={onImagePress}
            >
            <Image
                source={
                    imageUrl ? 
                    {
                        uri: imageUrl
                    } : require('../assets/no-profile-pic.png')
                }
                style={{
                    width: 50,
                    height: 50,
                    borderRadius: 40,
                    borderColor: 'black',
                    borderWidth: 2
                }}
            />
            </TouchableOpacity>
            <Text
                style={
                    isBlockedUser ? ([style.username, style.blockedUser]) : (
                        isCurrentUser ? [style.username, style.mainUser] : style.username
                    )
                }
            >
                { username }
            </Text>
        </TouchableOpacity>
    );
}

const style = StyleSheet.create({
    rootContainer: {
        alignItems: 'center',
        height: '100%'
    },
    addBtnContainer: {
        flexDirection: 'row',
        marginTop: 10
    },
    textInput: {
        marginRight: 10,
        borderWidth: 2,
        borderColor: BRAND_RED,
        borderRadius: 10,
        paddingLeft: 10,
        width: '45%',
    },
    itemContainer: {
        borderColor: CARD_SECONDARY_COLOR,
        borderWidth: 2,
        borderRadius: 40,
        backgroundColor: CARD_PRIMARY_COLOR,
        flexDirection: 'row',
        alignItems: 'center',
        minWidth: '45%',
        marginLeft: 10,
        marginRight: 10
    },
    itemContainerUser: {
        borderColor: CARD_RED_SECONDARY_COLOR,
        backgroundColor: CARD_RED_PRIMARY_COLOR,
    },
    username: {
        paddingLeft: 10,
    },
    mainUser: {
        color: 'white',
    },
    addBtnTouchable: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    blockedContainer: {
        borderColor: 'rgba(28, 28, 28, 1)',
        backgroundColor: 'rgba(54, 53, 53, 0.9)'
    },
    blockedUser: {
        color: 'white'
    },
    backArrowContainer: {
        flexDirection: 'row',
        marginLeft: 10,
        marginTop: 10
    }
});
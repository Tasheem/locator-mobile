import { View, Text, Image, StyleSheet } from 'react-native'
import { ChatMessage } from '../models/room'
import { User } from '../models/user'
import { CARD_PRIMARY_COLOR, CARD_RED_PRIMARY_COLOR, CARD_RED_SECONDARY_COLOR, CARD_SECONDARY_COLOR } from '../constants/colors'
import moment from 'moment'

type Props = {
    chatMessage: ChatMessage
    user: User
    timezone?: string
}

export default function Chat({ chatMessage, user, timezone = 'UTC' }: Props) {
    return (
        <View style={chatMessage.source.id === user?.id ? [style.messageContainer, style.redMessageContainer] : style.messageContainer}>
            <View style={chatMessage.source.id === user?.id ? [style.imageContainer, style.redImageContainer] : style.imageContainer}>
                <Image source={require('../assets/no-profile-pic.png')}
                style={{
                    width: 50,
                    height: 50,
                    borderRadius: 40,
                    borderColor: 'black',
                    borderWidth: 2
                }} />
            </View>
            <View style={style.textContainer}>
                <View style={chatMessage.source.id === user?.id ? [style.messageDetailsContainer, style.redDetailsContainer] : style.messageDetailsContainer}>
                    <View style={style.nameContainer}>
                        <Text style={chatMessage.source.id === user?.id ? [style.text, style.whiteText] : style.text}>
                            { chatMessage.source.username }
                        </Text>
                    </View>
                    <View style={style.dateContainer}>
                        <Text style={chatMessage.source.id === user?.id ? [style.text, style.whiteText] : style.text}>
                            { moment.utc(chatMessage.createDate).tz(timezone).format('MMM Do YYYY') }
                        </Text>
                        <Text style={chatMessage.source.id === user?.id ? [style.text, style.whiteText] : style.text}>
                            { moment.utc(chatMessage.createDate).tz(timezone).format('h:mm:ss a') }
                        </Text>
                    </View>
                </View>
                <View style={style.messageContentsContainer}>
                    <Text style={chatMessage.source.id === user?.id ? [style.text, style.whiteText] : style.text}>
                        { chatMessage.message }
                    </Text>
                </View>
            </View>
        </View>
    )
}

const style = StyleSheet.create({
    messageContainer: {
        flexDirection: 'row',
        borderColor: CARD_SECONDARY_COLOR,
        borderWidth: 2,
        borderStyle: 'solid',
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
        justifyContent: 'center',
        paddingLeft: 5,
        paddingRight: 5,
    },
    redImageContainer: {
        borderRightColor: CARD_RED_SECONDARY_COLOR
    },
    textContainer: {
        flex: 1,
        flexGrow: 1
    },
    text: {
        color: 'black',
        lineHeight: 18
    },
    whiteText: {
        color: 'white'
    },
    messageDetailsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottomColor: CARD_SECONDARY_COLOR,
        borderBottomWidth: 2,
        paddingLeft: 5,
        paddingRight: 5,
        flexWrap: 'wrap',
        flex: 1
    },
    nameContainer: {
        flex: 1
    },
    dateContainer: {
        flex: 1,
        alignItems: 'flex-end'
    },
    redDetailsContainer: {
        borderBottomColor: CARD_RED_SECONDARY_COLOR
    },
    messageContentsContainer: {
        paddingLeft: 5,
        paddingRight: 5
    }
})
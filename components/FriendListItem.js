import { StyleSheet, Text, View, TouchableOpacity, Image, TouchableHighlight } from 'react-native'
import React from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { database } from '../firebase';
import {
    doc, getDoc
} from 'firebase/firestore'



const FriendListItem = ({ item, icon, onPressIcon }) => {
    const [changeLayout, setChangeLayout] = React.useState(false);

    const onPress = async () => {
        const docFriend = doc(database, "users", item.idDoc);
        await onPressIcon(docFriend);
        setChangeLayout(true)
    }

    return (
        <View style={changeLayout ? [styles.container, { opacity: 0.5 }] : styles.container}>
            <TouchableHighlight style={styles.TouchableHigh}
            >
                <View style={styles.cardContainer}>
                    <View style={styles.imageContainer}>
                        <Image
                            source={{ uri: item.avatar }}
                            style={{ flex: 1, borderBottomRightRadius: 10, borderTopRightRadius: 10, width: 70, height: 60 }}
                        />
                    </View>
                    <View style={styles.inFlexContainer}>
                        <View style={styles.usernameContainer}>
                            <Text style={styles.text}>{item.username}</Text>
                        </View>
                    </View>
                    <View style={styles.inFlexContainer}>
                        <TouchableOpacity
                            style={styles.chatButton}
                            onPress={onPress}
                            disabled={changeLayout}
                        >
                            <FontAwesomeIcon icon={icon.image} size={icon.size} color='black' />
                        </TouchableOpacity>
                    </View>
                </View>
            </TouchableHighlight>
        </View>
    )
}

export default FriendListItem

const styles = StyleSheet.create({
    container: {
        height: 80,
        width: '100%',
    },
    chatButton: {
        width: 32,
        height: 32,
        fontWeight: 'bold',
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },
    text: {
        fontWeight: 'bold',
        fontSize: 17
    },
    inFlexContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    usernameContainer: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        paddingLeft: '20%',

    },
    cardContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: 'white'
    },
    imageContainer: {
        borderRadius: 20,
        justifyContent: 'center',
    },
    TouchableHigh:{
        flex: 1,
        borderRadius: 10,
        marginHorizontal: 10,
        marginVertical: 5,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        elevation: 2,
        overflow:'hidden'
    }
})
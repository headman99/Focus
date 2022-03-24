import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";


const FriendListItem = ({ item, icon, onPress}) => {
    return (
        <View style={styles.container}>
            <View style={styles.inFlexContainer}>
                <View style={styles.usernameContainer}>
                    <Text style={styles.text}>{item.username}</Text>
                </View>
            </View>
            <View style={styles.inFlexContainer}>
                <TouchableOpacity
                    style={styles.chatButton}
                    onPress={onPress}
                >
                    <FontAwesomeIcon icon={icon.image} size={icon.size} color='black' />
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default FriendListItem

const styles = StyleSheet.create({
    container: {
        height: 60,
        width: '100%',
        borderBottomWidth: 1,
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        flexDirection: 'row',
       
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
    usernameContainer:{
        width:'100%',
        height:'100%',
        justifyContent:'center',
        paddingLeft:'20%',

    }
})
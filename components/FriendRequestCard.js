import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native'
import React, { useEffect } from 'react'
import { getUserInformationsByUsername } from '../api'
import { database } from '../firebas'



const FriendRequestCard = ({ item, handleAccept, handleReject }) => {
    const [user, setuser] = React.useState();

    useEffect(async () => {
        const user = await getUserInformationsByUsername(database, item.sender);
        setuser(user)
        return () => { }
    }, [])


    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <View style={styles.imageContainer}>
                    <Image
                        source={{ uri: user?.data.avatar }}
                        style={styles.image}
                        resizeMode='contain'
                    />
                </View>
                <View style={styles.descriptionContainer}>
                    <View style={styles.titleContainer}>
                        <Text style={styles.title}>{user?.data.username}</Text>
                    </View>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={[styles.button, { backgroundColor: '#33a621' }]}
                            onPress={handleAccept}
                        ><Text style={styles.textButton}>Accept</Text></TouchableOpacity>
                        <TouchableOpacity style={[styles.button, { backgroundColor: '#d6242d' }]}
                            onPress={handleReject}
                        ><Text style={styles.textButton}>Reject</Text></TouchableOpacity>
                    </View>
                </View>
            </View>
            <View style={styles.separator}></View>
        </View>
    )
}

export default FriendRequestCard

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: 150,
        justifyContent: 'center',
        alignItems: 'center'
    },
    content: {
        width: '100%',
        height: '100%',
        padding: 10,
        flexDirection: 'row',

    },
    imageContainer: {
        flex: 0.4,
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',

    },
    image: {
        width: '75%',
        height: '75%',
        borderRadius: 50
    },
    descriptionContainer: {
        flex: 0.6,
        height: '100%',
        flexDirection: 'column',

    },
    titleContainer: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',

    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 10
    },
    buttonContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    button: {
        width: '45%',
        borderRadius: 5,
        height: '40%',
        elevation: 5,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,

    },
    separator: {
        width: '90%',
        borderWidth: 0.5
    },
    textButton: {
        color: 'white',
        fontWeight: 'bold'
    }
})
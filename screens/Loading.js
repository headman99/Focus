import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../firebase'
const Loading = ({ navigation }) => {

    useEffect( () => {
        setTimeout(() => {
            const unsubscribe =  onAuthStateChanged(auth, user => {
                if (user) {
                    navigation.replace("MainPage")
                } else {
                    navigation.replace("Login")
                }
            })

            return unsubscribe
        }, 1000);
    }, [])

    return (
        <View style={styles.coontainer}>
            <Text style={styles.text}>LOADING</Text>
        </View>
    )
}

export default Loading

const styles = StyleSheet.create({
    coontainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    text: {
        fontSize: 20,
        fontWeight: 'bold',
    },

})
import { StyleSheet, Text, View, KeyboardAvoidingView, TextInput, TouchableOpacity, ScrollView } from 'react-native'
import React from 'react'
import AsyncStorageLib from '@react-native-async-storage/async-storage'
import { useState, useEffect } from 'react'
import { auth } from '../firebase'
import { useNavigation } from '@react-navigation/native'
import { onAuthStateChanged,createUserWithEmailAndPassword,signInWithEmailAndPassword } from 'firebase/auth'
//import { createUserWithEmailAndPassword,signInWithEmailAndPassword } from 'firebase/auth'
//import { onAuthStateChanged  } from 'firebase/auth'
const Login = ({navigation}) => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handleSignUp = () => {
        createUserWithEmailAndPassword(auth,email.trim(), password)
            .then(userCredentials => {
                const user = userCredentials.user;
                console.log('Registered in with:', user.email)
                alert('Registered in with:', user.email)
                navigation.replace("MainPage")
            })
            .catch(error => alert(error.message))
    }

    const handleLogin = () => {
        signInWithEmailAndPassword(auth,email.trim(), password).then(userCredentials => {
            const user = userCredentials.user;
            console.log('Logged in with:', user.email)
            navigation.replace("MainPage")
        })
            .catch(error => alert(error.message))
    }

    return (
        <KeyboardAvoidingView
            style={styles.container}
            
        >            
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder='Email'
                    onChangeText={text => setEmail(text)}
                />
                <TextInput
                    onChangeText={text => setPassword(text)}
                    style={styles.input}
                    placeholder='Password'
                    secureTextEntry
                />
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        onPress={handleLogin}
                        value={email}
                        style={styles.button}
                    >
                        <Text style={styles.buttonText}>Login</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={handleSignUp}
                        value={password}
                        style={[styles.button, styles.buttonOutline]}
                    >
                        <Text style={styles.buttonOutlineText}>Register</Text>
                    </TouchableOpacity>
                </View>

            </View>

        </KeyboardAvoidingView >
   
    )
}

export default Login

const styles = StyleSheet.create({
    container: {
        flex:1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    inputContainer: {
        width: '80%',

    },
    input: {
        backgroundColor: 'white',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 10,
        marginTop: 5
    },
    buttonContainer: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 40
    },
    button: {
        backgroundColor: '#0782F9',
        width: '100%',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center'
    },
    buttonOutline: {
        backgroundColor: 'white',
        marginTop: 5,
        borderColor: '#0782F9',
        borderWidth: 2
    },
    buttonText: {
        color: 'white',
        fontWeight: '700',
        fontSize: 16
    },
    buttonOutlineText: {
        color: '#0782F9',
        fontWeight: '700',
        fontSize: 16
    },
    loading:{
        width:'100%',
        height:'100%',
        justifyContent:'center',
        alignItems:'center',
        zIndex:2,
        position:'absolute',
        backgroundColor:'white'
    }

})
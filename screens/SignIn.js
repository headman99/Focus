import { StyleSheet, Text, View, KeyboardAvoidingView, TextInput, TouchableOpacity, Alert, NativeModules } from 'react-native'
import React, { useState } from 'react'
import { auth, database } from '../firebas'
import { useNavigation } from '@react-navigation/native'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import {
    addDoc,
    collection,
    getDocs,
    query,
    setDoc,
    where,
    doc
} from 'firebase/firestore'

const SignIn = () => {
    const navigation = useNavigation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');

    const verifyValidity = async () => {
        if (email !== '' && password !== '' && username !== '') {
            try {
                const users = await getDocs(query(collection(database, 'users'), where('username', '==', username)));
                if (users?.docs?.length>0) {
                    throw "Username already taken"
                }
            }catch(error){
                throw error
            }
        }
    }

    const createUser = () =>{
        createUserWithEmailAndPassword(auth, email.trim(), password)
            .then(async (userCredentials) => {
                const user = userCredentials.user;
                console.log('Registered in with:', user.email)
                try {
                    await setDoc(doc(database, 'users',auth.currentUser.uid), {
                        avatar: 'https://i.pravatar.cc/99',
                        email: user.email,
                        username: username
                    });
                } catch (error) {
                    console.log('errore verificato qui 2');
                    console.log(error.message)
                    Alert.alert(
                        "Sign IN",
                        "An error occurred during signIn,please try again or reload the app",
                        [
                            {
                                text: 'cancel',
                                onPress: () => { console.log("cancel pressed") },
                                style: 'cancel'
                            },
                            {
                                text: 'reboot',
                                onPress: () => NativeModules.DevSettings.reload(),
                                style: 'default'
                            }
                        ]
                    )
                }
            }).catch(error =>{
                alert(error.message)
            });
    }

    const handleSignUp = async() => {
        try{
            await verifyValidity();
        }catch(error){
            console.log('errore verificato qui 3');
            alert(error)
            return;
        }
        
        createUser();
    }

    return (
        <KeyboardAvoidingView
            style={styles.container}

        >
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder='Email'
                    onChangeText={text => setEmail(text.replace(' ',''))}
                />
                <TextInput
                    onChangeText={text => setPassword(text)}
                    style={styles.input}
                    placeholder='Password'
                    secureTextEntry
                />
                <TextInput
                    style={styles.input}
                    placeholder='Username'
                    onChangeText={text => setUsername(text.replace(' ',''))}
                    value={username}
                />
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        onPress={() => handleSignUp()}
                        value={password}
                        style={styles.button}
                    >
                        <Text style={styles.buttonText}>Confirm</Text>
                    </TouchableOpacity>
                </View>

            </View>

        </KeyboardAvoidingView >
    )
}

export default SignIn

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
    loading: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 2,
        position: 'absolute',
        backgroundColor: 'white'
    }
})
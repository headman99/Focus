import { StyleSheet, Text, View, TouchableOpacity, LogBox } from 'react-native'
import React, { useState, useEffect, useLayoutEffect, useCallback } from 'react'
import { Avatar, GiftedChat } from 'react-native-gifted-chat'
import {
    collection,
    addDoc,
    orderBy,
    onSnapshot,
    query
} from "firebase/firestore"
import { signOut } from 'firebase/auth'
import { auth, database } from '../firebase'
import { useNavigation } from '@react-navigation/native'

const Chat = () => {
    LogBox.ignoreLogs(["Setting a timer"])
    const navigation = useNavigation();
    const [messages, setMessages] = useState([])


    useLayoutEffect(() => {
        const collectionRef = collection(database, 'chats');
        const q = query(collectionRef, orderBy('createdAt', 'desc')); //ordina per tempo discendente
        const unsubscribe = onSnapshot(q, snapshot => {
            console.log('snapshot');
            setMessages(
                snapshot.docs.map(doc => ({
                    _id: doc.id,
                    createdAt: doc.data().createdAt.toDate(),
                    text: doc.data().text,
                    user: doc.data().user
                }))
            )
        });

        return () => unsubscribe()
    }, [])

    const onSend = useCallback((message) => {
        //setMessages(previousMessages => GiftedChat.append(previousMessages, messages));
        const { _id, createdAt, text, user } = message[0] //il messaggio n-esimo inviato è un array di un solo elemento 
        addDoc(collection(database, 'chats'), {
            _id,
            createdAt,
            text,
            user
        });
    }, [])

    return (
        <GiftedChat
            messages={messages}
            onSend={message =>onSend(message)}
            user={{
                _id: auth?.currentUser.email,
                avatar: 'https://i.pravatar.cc/300'
            }}

            messagesContainerStyle={{
                backgroundColor: '#fff'
            }}
            showUserAvatar={true}

        />
    )
}

export default Chat

const styles = StyleSheet.create({})
import { StyleSheet, Text, View, FlatList, Button, TouchableOpacity } from 'react-native'
import react, { useState } from 'react'
import React from 'react'
import {
    addDoc,
    collection,
    doc,
    getDoc,
    getDocs,
    setDoc,
    onSnapshot,
    query,
    orderBy,
    runTransaction,
    arrayUnion,
    updateDoc,
    Timestamp,
    where,
} from 'firebase/firestore'
import { auth, database } from '../firebase'
import { userInformationsContext } from '../Stacks/TabNavigator'
import { useEffect, useLayoutEffect } from 'react'
import uuid from 'react-native-uuid';
import Toast from 'react-native-toast-message'
import { getUserInformationsByUsername } from '../api'






const UserRequest = () => {
    const [notifiche, setNotifiche] = useState([]);
    const { userInfo, friendsField } = React.useContext(userInformationsContext);
    const { friends, setFriends } = friendsField;

    useEffect(()=>{
        setNotifiche(notifiche.sort((a,b)=> a.createdAt - b.createdAt));
    },[notifiche])

    useEffect(() => {
        console.log("sono qui")
        const collectionRef = collection(database, 'notifications', userInfo.idDoc, 'userRequests');
        const q = query(collectionRef, where('type', '==', 'received')); //ordina per tempo discendente e prende tutte le notifiche pending
        const unsubscribe = onSnapshot(q, snapshot => {
            setNotifiche(
                snapshot.docs.map(doc => ({
                    requestRef: doc.data().requestRef,
                    id: doc.data().id,
                    createdAt: doc.data().createdAt,
                    sender: doc.data().sender,
                    idDoc:doc.id
                }))
            )

        });

        return () => unsubscribe();
    }, []);

    const acceptRequest = async (item) => { //item = notifiche n-esima. Devo accedere al mittente attraverso il campo sender (item.sender)
        try {
            let amico;
            await runTransaction(database, async (transaction) => {
                const senderDoc = await transaction.get(item.requestRef);
                
                const friend = await transaction.get(doc(database,'users',item.idDoc)); 
            
                if (!senderDoc.exists()) {
                    throw "documento inesistente"
                }

                amico = {
                    username: friend.data().username,
                    id: friend.data().id,
                    avatar: friend.data().avatar
                }


                transaction.update(item.requestRef, {
                    state: 'accepted'
                });

               // console.log(friend.idDoc)
                transaction.update(doc(database,'users',userInfo.idDoc),{
                    friendsRef:arrayUnion(doc(database,'users',item.idDoc))
                })

                transaction.delete(doc(database,'notifications',userInfo.idDoc,'userRequests',item.idDoc));
            });

            Toast.show({
                type: 'success',
                text1: 'FRIEND ADDED',
                text2: 'Friend added succesfully',
                position: 'bottom',
                visibilityTime: 2000,
            });
            return amico
        } catch (err) {
            console.log(err);
            Toast.show({
                type: 'error',
                text1: 'ADD FRIEND',
                text2: 'Impossible to add friend',
                position: 'bottom',
                visibilityTime: 2000,
            })
            return null
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.listContainer}>
                <FlatList
                    data={notifiche}
                    renderItem={({ item }) => (
                        <View>
                            <Text>richiesta  da {item.sender}</Text>
                            <TouchableOpacity
                                style={{ width: 100, height: 50, backgroundColor: 'blue' }}
                                onPress={async () => {
                                    const amico = await acceptRequest(item);
                                    setFriends([...friends, amico]);
                                    setNotifiche(notifiche.filter(notif => notif.id !== notif.id))
                                }}
                            >
                                <Text style={{ color: 'white' }}>Accept</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                    keyExtractor={(notifica, index) => index}
                >
                </FlatList>
            </View>
            <Toast />
        </View>
    )
}

export default UserRequest

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',

    },
    listContainer: {
        flex: 1
    },

})
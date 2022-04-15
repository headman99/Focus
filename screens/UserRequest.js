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
    writeBatch,
} from 'firebase/firestore'
import { auth, database } from '../firebase'
import { userInformationsContext } from '../Stacks/TabNavigator'
import { useEffect, useLayoutEffect } from 'react'
import uuid from 'react-native-uuid';
import Toast from 'react-native-toast-message'
import { getUserInformationsByUsername } from '../api'
import FriendRequestCard from '../components/FriendRequestCard'






const UserRequest = () => {
    const { userInfo, friendsField, notifications } = React.useContext(userInformationsContext);
    const { friends, setFriends } = friendsField;

    useEffect(async()=>{
        try{
            const q = query(collection(database,'notifications',userInfo.idDoc,'userRequests'),where("read", '==', false));
            const querySnap = await getDocs(q);
            querySnap.forEach(async (d)=>{
                await updateDoc(doc(database,'notifications',userInfo.idDoc,'userRequests',d.id),{
                    read:true
                })
            });
        }catch(err){
            alert(err.message)
        }

        return ()=>{}
    },[])

    const acceptRequest = async (item) => { //item = notifiche n-esima. Devo accedere al mittente attraverso il campo sender (item.sender)

        try {
            let amico;
            await runTransaction(database, async (transaction) => {
                const senderDoc = await transaction.get(item.requestRef);
                const friend = await transaction.get(doc(database, 'users', item.idDoc));
                if (!senderDoc.exists()) {
                    throw "documento inesistente"
                }
                transaction.update(item.requestRef, {
                    state: 'accepted'
                });

                // se l'amico esiste gia tra la sua lista allora non lo aggiunge, ma accetta solo la richiesta
                if (!friends.map(amico => amico.username).includes(item.sender)) {
                    transaction.set(doc(database, 'users', userInfo.idDoc, 'friends', item.idDoc), {
                        friend: doc(database, 'users', item.idDoc)
                    })
                    Toast.show({
                        type: 'warning',
                        text1: 'FRIEND ADDED',
                        text2: 'The user was already your friend',
                        position: 'bottom',
                        visibilityTime: 2000
                    })

                }

                transaction.delete(doc(database, 'notifications', userInfo.idDoc, 'userRequests', item.idDoc));
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

    const denyRequest = async (item) => {
        try {
            const batch = writeBatch(database);
            batch.update(item.requestRef, {
                state: 'denied'
            });
            batch.delete(doc(database, 'notifications', userInfo.idDoc, 'userRequests', item.idDoc));
            batch.commit();
            Toast.show({
                type: 'success',
                text1: 'FRIEND REQUEST DENIED',
                text2: 'Friend request denied succesfully',
                position: 'bottom',
                visibilityTime: 2000,
            });
        }catch(err){
            Toast.show({
                type: 'error',
                text1: 'DENY REQUEST',
                text2: 'Error in rejection, try again',
                position: 'bottom',
                visibilityTime: 2000,
            })
        }
       
    }

    return (
        <View style={styles.container}>
            <View style={styles.listContainer}>
                <FlatList
                    data={notifications.sort((a, b) => a.createdAt - b.createdAt)}
                    renderItem={({ item }) => (
                        <FriendRequestCard
                            item={item}
                            handleAccept={() => acceptRequest(item)}
                            handleReject={() => denyRequest(item)}
                        />
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
    },
    listContainer: {
        width: '100%',
        height: '100%',
    },

})
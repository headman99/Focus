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
    arrayUnion
} from 'firebase/firestore'
import { auth, database } from '../firebase'
import { userInformationsContext } from '../Stacks/TabNavigator'
import { useEffect, useLayoutEffect } from 'react'
import uuid from 'react-native-uuid';
import Toast from 'react-native-toast-message'





const UserRequest = () => {
    const [notifiche, setNotifiche] = useState([]);
    const { userInfo, friendsField } = React.useContext(userInformationsContext);
    const { friends, setFriends } = friendsField;

    useLayoutEffect(() => {
        const collectionRef = collection(database, 'users',userInfo.idDoc, 'userRequests');
        const q = query(collectionRef, orderBy("createdAt")); //ordina per tempo discendente
        const unsubscribe = onSnapshot(q, snapshot => {
            console.log("eseguo")
            setNotifiche(
                snapshot.docs.filter(doc => doc.data()?.state!=='pending').map(doc => ({
                    text: doc.data().text,
                    id: doc.data().id,
                    sender: doc.data().sender,   //sender contiene username ed idDoc del mittente. idDoc -> sender.idDoc, username= sender.username
                    createdAt: doc.data().createdAt.toDate(),
                    idDoc:doc.id
                }))
            )

        })

        return () => unsubscribe();
    }, []);

    const acceptRequest = async (item) => { //item = notifiche n-esima. Devo accedere al mittente attraverso il campo sender (item.sender)
        try {
            let amico;
            await runTransaction(database, async (transaction) => {
                const docRef = doc(database, 'users', item.sender.idDoc)
                const sfDoc = await transaction.get(docRef);
                if (!sfDoc.exists()) {
                    throw "Document does not exists!";
                }
                amico = {
                    username: sfDoc.data().username,
                    id: sfDoc.data().id,
                    avatar: sfDoc.data().avatar
                };

                //modifico 
                transaction.update(doc(database, "users", userInfo.idDoc), {
                    friendsRef: arrayUnion(docRef)
                });

                transaction.delete(doc(database,'users',userInfo.idDoc,'userRequests',item.idDoc))
                //transaction.delete(doc(database,'users',))
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
                            <Text>{item.text} da {item?.sender?.username}</Text>
                            <TouchableOpacity
                                style={{ width: 100, height: 50, backgroundColor: 'blue' }}
                                onPress={async() => {
                                    const amico = await acceptRequest(item);
                                    setFriends([...friends,amico]);
                                    setNotifiche(notifiche.filter(not => not.id!==item.id))
                                }}
                            >
                                <Text style={{ color: 'white' }}>Accept</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                    keyExtractor={(notifica) => notifica.id}
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
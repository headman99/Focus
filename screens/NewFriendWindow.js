import {
    StyleSheet,
    View,
    SafeAreaView,
    TouchableOpacity,
    Modal,
    Alert,
    TextInput,
    Text
} from 'react-native'
import React, { useState, useEffect, useLayoutEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FlatList } from 'react-native-gesture-handler';
import FriendListItem from '../components/FriendListItem';
import { getUsersBySimilarUsername, getPossibleFriendsBySimilarUsername, sendFriendRequest } from '../api';
import { database } from '../firebase';
import { faUserPlus } from "@fortawesome/free-solid-svg-icons";
import {
    arrayUnion,
    doc,
    getDoc,
    updateDoc,
    writeBatch,
    collection,
    Timestamp,
    onSnapshot
} from 'firebase/firestore';
import { userInformationsContext } from '../Stacks/TabNavigator';
import Toast from 'react-native-toast-message'
import uuid from 'react-native-uuid'

const NewFriendWindow = () => {
    const [newFriends, setNewFriends] = useState([]);
    const [pendingFriends, setPendingFriends] = useState([]); //oggetto {idDoc,username} degli amici in pending
    const [filter, setFilter] = useState('');
    const { userInfo, friendsField } = React.useContext(userInformationsContext);



    /*useEffect(() => {
        const q = query(collection(database, "users", userInfo.idDoc, 'userRequests'), where("state", "==", "pending"));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            setPendingFriends(
                querySnapshot.docs.map(doc =>doc.data().receiver) //viene passato l'oggetto {idDoc,username} del ricevente
            )
        });

        return ()=>unsubscribe()
    }, [])*/

    const onPressSendRequest = async (item) => {
        console.log("entro")
        try {
            const batch = writeBatch(database);
            //setto la notifica al ricevitore
            const collReceiver = doc(database, "users", item.idDoc, 'userRequests', userInfo.idDoc);
            batch.set(collReceiver, {
                id: uuid.v4(),
                sender: {
                    idDoc: userInfo.idDoc,
                    username: userInfo.data.username
                },
                text: "richiesta di amicizia",
                createdAt: Timestamp.fromDate(new Date())
            });

            //setto la notifica al mittente
            const collSender = doc(database, 'users', userInfo.idDoc, 'userRequests', item.idDoc);
            batch.set(collSender, {
                id: uuid.v4(),
                state: 'pending',
                text: "Attesa conferma richiesta",
                receiver: {
                    idDoc:item.idDoc,
                    username:item.username
                },
                createdAt: Timestamp.fromDate(new Date())
            });

            batch.commit();

            Toast.show({
                type: 'success',
                text1: 'ADD FRIEND ',
                text2: 'Request sent',
                position: 'bottom',
                visibilityTime: 2000,
            })
        } catch (error) {
            console.log(error.message);
            Toast.show({
                type: 'error',
                text1: 'ADD FRIEND',
                text2: 'Impossibile processare la richiesta',
                visibilityTime: 2000
            })
        }

    }


    const handleFilter = async () => {
        if (filter == '') {
            setNewFriends([]);
            return;
        }

        const friends = friendsField.friends;
        console.log(friends)
        let arrayPromises;
        if (friends?.length > 0) {
            arrayPromises = await getPossibleFriendsBySimilarUsername(database, filter, friends.map(friend => friend.username));
        } else {
            arrayPromises = await getUsersBySimilarUsername(database, filter);
        }

        if (arrayPromises) {
            let array = await Promise.all(arrayPromises);
            setNewFriends(array);
        }

    }
    return (
        <View style={styles.container}>
            <SafeAreaView style={styles.content}>
                <View
                    style={{ width: '100%', justifyContent: 'center', alignItems: 'center' }}
                >
                    <TextInput
                        style={styles.textInput}
                        onChangeText={filter => setFilter(filter)}
                        value={filter}
                        placeholder='Search'
                        onEndEditing={handleFilter}
                    />
                </View>
                <View style={styles.mainContent}>
                    <FlatList
                        style={styles.friendlist}
                        data={newFriends}
                        renderItem={({ item }) => (
                            <FriendListItem
                                item={item}
                                icon={{ image: faUserPlus, size: 25 }}
                                onPressIcon={onPressSendRequest}
                                MultiSelectionVisible={false}
                            />
                        )}
                        keyExtractor={(friend) => friend.id}
                    />
                </View>
                <Toast />
            </SafeAreaView>
        </View>

    )
}

export default NewFriendWindow

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    Xbutton: {
        width: 40,
        height: 40,
        backgroundColor: 'red',
        borderBottomLeftRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',

    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 22,
    },
    closeText: {
        fontSize: 24,
        color: '#00479e',
        textAlign: 'center',
    },
    headerContainer: {
        width: '100%',
        flexDirection: 'row-reverse'
    },
    content: {
        flex: 1,
        paddingBottom: '5%',
        flexDirection: 'column',
        justifyContent: 'center',


    },
    textInput: {
        width: '80%',
        height: 50,
        borderColor: 'black',
        borderRadius: 10,
        marginTop: '5%',
        padding: 10,
        borderWidth: 1,
        backgroundColor: 'white'

    },
    mainContent: {
        flex: 1,
        marginTop: 10,

    },
    friendlist: {
        flex: 1,
    },


})
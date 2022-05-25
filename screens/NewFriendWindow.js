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
import { FlatList } from 'react-native-gesture-handler';
import FriendListItem from '../components/FriendListItem';
import { getUsersBySimilarUsername, getPossibleFriendsBySimilarUsername, sendFriendRequest } from '../api';
import { database } from '../firebas';
import { faUserPlus, faArrowLeft, faUser } from "@fortawesome/free-solid-svg-icons";
import {
    arrayUnion,
    doc,
    getDoc,
    updateDoc,
    writeBatch,
    collection,
    Timestamp,
    onSnapshot,
    setDoc,
    deleteDoc,
    WriteBatch,
    runTransaction,
    query,
    getDocs,
    where
} from 'firebase/firestore';
import { userInformationsContext } from '../Stacks/TabNavigator';
import Toast from 'react-native-toast-message'
import uuid from 'react-native-uuid'
import SearchHeaderBar from '../components/SearchHeaderBar';





const NewFriendWindow = ({ navigation }) => {
    const [newFriends, setNewFriends] = useState([]);
    //const [pendingFriends, setPendingFriends] = useState([]); //oggetto {idDoc,username} degli amici in pending
    const [filter, setFilter] = useState('');
    const { userInfo, friendsField } = React.useContext(userInformationsContext);
    const [pendingFriends, setPendingFriends] = React.useState([]);
    const [noUsersAlert, setNoUsersAlert] = React.useState(false)

    useEffect(async () => {
        const q = query(collection(database, 'notifications', userInfo.idDoc, 'userRequests'), where('state', '==', 'pending'));
        const documenti = await getDocs(q);
        //const docPromises = await Promise.all(documenti)
        const array = documenti.docs.map(docm => docm.data().receiver)
        setPendingFriends(array)
        return () => { }
    }, []);

    useEffect(()=>{
        if(pendingFriends.length>0){
            newFriends.filter(item => !pendingFriends.includes(item.username))
        }
    },[pendingFriends.length])



    const onPressSendRequest = async (item) => {
        try {
            await runTransaction(database, async (transaction) => {
                const docSender = doc(database, 'notifications', userInfo.idDoc, 'userRequests', item.idDoc)
                const docReceiver = doc(database, 'notifications', item.idDoc, 'userRequests', userInfo.idDoc)
                const Sender = await getDoc(docSender);
                const Receiver = await getDoc(docReceiver);
                if (Sender.exists() || Receiver.exists()) {
                    throw "Document already exists";
                }
                const casualId = uuid.v4();
                const createdAt = Timestamp.now(new Date())

                transaction.set(docSender, {
                    type: 'sent',
                    state: 'pending',
                    id: casualId,
                    sender: userInfo.data.username,
                    text: 'richiesta di amicizia',
                    receiver: item.username,
                    createdAt: createdAt
                });

                transaction.set(docReceiver, {
                    type: 'received',
                    requestRef: docSender,
                    id: casualId,
                    createdAt: createdAt,
                    sender: userInfo.data.username,
                    read: false
                });

            });

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
                position: 'bottom',
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
        let arrayPromises;
        if (friends?.length > 0) {
            arrayPromises = await getPossibleFriendsBySimilarUsername(database, filter, friends.map(friend => friend.username));
        } else {
            arrayPromises = await getUsersBySimilarUsername(database, filter);
        }

        if (arrayPromises.length > 0) {
            if (noUsersAlert) {
                setNoUsersAlert(false)
            }
            let array = await Promise.all(arrayPromises);
            setNewFriends(array);
        } else {
            if (!noUsersAlert) {
                setNoUsersAlert(true)
            }
        }

    }
    return (
        <View style={styles.container}>
            <SafeAreaView style={styles.content}>
                <SearchHeaderBar
                    filter={filter}
                    setFilter={setFilter}
                    title='Search friends'
                    goBackArrow={true}
                    handleEndEditing={()=> handleFilter()}
                />
                <View style={styles.mainContent}>
                    {
                        noUsersAlert &&
                        <View style={styles.noUsersAlert}>
                            <Text>No user with this username exists</Text>
                        </View>
                    }

                    <FlatList
                        style={styles.friendlist}
                        data={newFriends}
                        renderItem={({ item }) => (
                            <FriendListItem
                                item={item}
                                iconImage={faUserPlus}
                                iconSize={25}
                                onPressIcon={onPressSendRequest}
                                MultiSelectionVisible={false}
                            />
                        )}
                        keyExtractor={(friend) => friend.username}
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
    noUsersAlert: {
        flex:1,
        justifyContent:'center',
        alignItems:'center'
    }

})
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




const NewFriendWindow = ({navigation}) => {
    const [newFriends, setNewFriends] = useState([]);
    //const [pendingFriends, setPendingFriends] = useState([]); //oggetto {idDoc,username} degli amici in pending
    const [filter, setFilter] = useState('');
    const { userInfo, friendsField} = React.useContext(userInformationsContext);
    const [pendingFriends,setPendingFriends] = React.useState([]);

    useEffect(async ()=>{
        const q = query(collection(database,'notifications',userInfo.idDoc,'userRequests'),where('state','==','pending'));
        const documenti = await getDocs(q);
        //const docPromises = await Promise.all(documenti)
        const array = documenti.docs.map(docm => docm.data().receiver)
        setPendingFriends(array)
        return ()=>{}
    },[])

    const onPressSendRequest = async (item) => {
        try {
           await runTransaction(database, async (transaction)=>{
                const docSender = doc(database,'notifications',userInfo.idDoc,'userRequests',item.idDoc)
                const docReceiver= doc(database,'notifications',item.idDoc,'userRequests',userInfo.idDoc)
                const Sender = await getDoc(docSender);
                const Receiver = await getDoc(docReceiver);
                if (Sender.exists() || Receiver.exists()) 
                {
                    throw "Document already exists";
                }
                const casualId = uuid.v4();
                const createdAt = Timestamp.now(new Date())

                transaction.set(docSender,{
                    type:'sent',
                    state:'pending',
                    id:casualId,
                    sender: userInfo.data.username,
                    text:'richiesta di amicizia',
                    receiver:item.username,
                    createdAt: createdAt
                });
            
                transaction.set(docReceiver,{
                    type:'received',
                    requestRef: docSender,
                    id:casualId,
                    createdAt:createdAt,
                    sender: userInfo.data.username   
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
            //console.log(error.message);
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

        if (arrayPromises) {
            let array = await Promise.all(arrayPromises);
            setNewFriends(array);
        }

    }
    return (
        <View style={styles.container}>
            <SafeAreaView style={styles.content}>
                <View
                    style={{ width: '100%', justifyContent: 'center', alignItems: 'center', flexDirection:'row' }}
                >
                    <TextInput
                        style={styles.textInput}
                        onChangeText={filter => setFilter(filter)}
                        value={filter}
                        placeholder='Search'
                        onEndEditing={handleFilter}
                    />
                    <TouchableOpacity
                        onPress={()=>{
                            navigation.navigate("PendingFriends",{
                                pendingFriends:pendingFriends
                            });
                        }}
                        style={{width:'10%',height:'100%',borderWidth:1}}
                    >
                        <Text>PendingRequests</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.mainContent}>
                    <FlatList
                        style={styles.friendlist}
                        data={newFriends.filter(item => !pendingFriends.includes(item.username))}
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
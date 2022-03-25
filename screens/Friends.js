import { StyleSheet, Text, View, TextInput, FlatList, SafeAreaView, TouchableOpacity, LogBox, Animated } from 'react-native'
import React, { useState, useEffect, useLayoutEffect, useCallback } from 'react'
import {
    collection,
    addDoc,
    orderBy,
    onSnapshot,
    query,
    where,
    getDocs,
    doc,
    DocumentReference,
    QueryDocumentSnapshot,
    getDoc,
    updateDoc,
    arrayRemove,
    arrayUnion
} from "firebase/firestore";
import { auth, database } from '../firebase';
import { NavigationContainer } from '@react-navigation/native';
import FriendListItem from '../components/FriendListItem';
import { getUserInformationsById, getUserInformationsByMail } from '../api';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import NewFriendWindow from '../components/NewFriendWindow'
import { setPersistence } from 'firebase/auth';
import { faMessage } from "@fortawesome/free-solid-svg-icons";
import { userInformationsContext } from '../Stacks/Drawer';



const Friends = ({ navigation }) => {
    const [filter, setFilter] = useState('');
    const [friends, setFriends] = useState([]);
    const [pressPlus, setPressPlus] = useState(false);
    const [selectedItem, setSelectedItem] = useState() //elemento selezionato quando premo a lungo su una card, serve per aggiornare l'array di amici senza dover fare ogni volta nuove richieste
    LogBox.ignoreLogs(["Setting a timer", "AsyncStorage has been extracted from react-native core"])
    const userInfo = React.useContext(userInformationsContext);

    /*async function readFriendsWithoutFilter() {
        const arrayAmici = [];

        console.log("Vengo eseguita")
        const collectionRef = collection(database, 'users');
        const q = query(collectionRef, where("id", "==", auth?.currentUser.email.toString()))

        const querySnapshot = getDocs(q).then(snapshots => {
            snapshots.forEach(d => {
                //const arrayPath = d.get("friends")[0]._key.path.segments per ottente il path da un reference
                //const documento = doc(database,d.id, arrayPath.join('/'))
                d.get("friends").forEach(friendDocID => {
                    const documento = doc(database, `users/${friendDocID}`);
                    const promise = getDoc(documento).then(snap => {

                        const id = snap.get("id");
                        const username = snap.get("username").toString();
                        const avatar = snap.get("avatar").toString();

                        arrayAmici.push({
                            id: id,
                            username: username,
                            avatar: avatar
                        })

                        //setFriendsList([...friendsList,f]); 
                        //console.log(friendsList)

                    })

                })

            })
        })  
    }*/

    const addItem = async (item) => {
        try {
            const result = await updateDoc(doc(database, "users", userInfo.idDoc), {
                friendsRef: arrayUnion(item)
            });
        } catch (error) {
            console.log(error.message)
        }
    }

    const handleDeleteItem = async (item) => {
        try {
            const document = doc(database, 'users', userInfo.idDoc);
            await updateDoc(document, {
                friendsRef: arrayRemove(item)
            })
        } catch (error) {
            console.log(error.message)
        }

    }

    useLayoutEffect(() => {
        if (selectedItem) {
            const { item, action } = selectedItem;
            if (action == 'delete') {
                setFriends(friends.filter(friend => friend.username !== item.username))
                handleDeleteItem(doc(database, 'users', item.idDoc))
            }
            if(action == 'add'){
                setFriends([...friends,item])
                addItem(doc(database,'users',item.idDoc))
            }
        }

    }, [selectedItem]);

    useEffect(/*async*/() => {
        //necessario farla cosi perchè mettere async lì dove ho commentato non è possibile
        (async () => {
            const friendsRefPromises = userInfo.data.friendsRef.map(async element => await getDoc(element));
            const friendDocs = await Promise.all(friendsRefPromises);
            const arrayAmici = friendDocs.map(documento => ({
                id: documento.data().id,
                username: documento.data().username,
                avatar: documento.data().avatar,
                idDoc: documento.id
            }));
            setFriends(arrayAmici);
        })();

        return () => {
        }
    }, [])

    const returnFilter = () => {
        if (filter !== '') {
            return friends.filter(friend => friend.username.toUpperCase().startsWith(filter.toUpperCase()))
        } else {
            return friends;
        }
    }


    return (
        <View style={styles.container}>
            <NewFriendWindow
                pressPlus={pressPlus}
                setPressPlus={setPressPlus}
                friends={friends.map(friend => friend.username)}
                setSelectedItem={setSelectedItem}
            />
            <View style={!pressPlus ? [styles.contentContainer] : [styles.contentContainer, { opacity: 0.1 }]}>
                <TextInput
                    style={styles.textInput}
                    onChangeText={text => setFilter(text)}
                    value={filter}
                    placeholder='Search'

                />
                <SafeAreaView style={styles.mainContent}>
                    <FlatList
                        style={styles.friendlist}
                        data={returnFilter()}
                        renderItem={({ item }) => (
                            <FriendListItem
                                item={item}
                                icon={{ image: faMessage, size: 20 }}
                                MultiSelectionVisible={true}
                                setSelectedItem={setSelectedItem}
                            />
                        )}
                        keyExtractor={(friend) => friend.id}

                    />
                </SafeAreaView>
                <View style={styles.plusContainer}>
                    <TouchableOpacity
                        onPress={() => {
                            setPressPlus(true);
                        }}
                    >
                        <FontAwesomeIcon icon={faPlusCircle} size={45} />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

export default Friends

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    textInput: {
        width: '80%',
        height: 50,
        borderColor: 'black',
        borderWidth: 1,
        borderRadius: 10,
        marginTop: '5%',
        padding: 10,
        backgroundColor: 'white'
    },
    mainContent: {
        flex: 1,
        width: '100%',
        marginTop: 20
    },
    plusContainer: {
        position: 'absolute',
        right: '5%',
        bottom: '5%'
    },
    contentContainer: {
        flex: 1,
        justifyContent: 'center',
        flexDirection: 'column',
        alignItems: 'center',
    }
})
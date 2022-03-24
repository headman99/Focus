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
    const [friendsList, setFriendsList] = useState([]);
    const [pressPlus, setPressPlus] = useState(false);
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

    const onFilter = () => {
        if (filter !== '' && filter !== undefined) {
            //const filteredFriend = friends.find(item => item.username.toUpperCase() === filter.toUpperCase())
            const filteredArray = friends.filter(item => item.username.toUpperCase().startsWith(filter.toUpperCase()))
            console.log("filteredArray=", filteredArray)
            if (filteredArray !== undefined && filteredArray.length > 0)
                setFriendsList([...filteredArray])
            else
                setFriendsList([]);
        } else {
            console.log("eseguo senza filtro")
            setFriendsList(friends)
        }

    }

    async function getFriend() {
        const amici = await getUserInformationsByMail(database, auth?.currentUser?.email.toString())
        console.log(amici)
    }

    useEffect(/*async*/() => {
    //necessario farla cosi perchè mettere async lì dove ho commentato non è possibile
        (async() => {
            const friendsRefPromises = userInfo.data.friendsRef.map(async element => await (await getDoc(element)).data())
            const friendsDocsDetails = await Promise.all(friendsRefPromises);
            const arrayAmici = friendsDocsDetails.map(friend => ({
                id: friend.id,
                username: friend.username,
                avatar : friend.avatar
            }));
            setFriends(arrayAmici);
            setFriendsList(arrayAmici);
        })();

        return ()=>{

        }
    }, [])

   

    return (
        <View style={styles.container}>
            <NewFriendWindow pressPlus={pressPlus} setPressPlus={setPressPlus} friends={friends.map(friend => friend.username)} />
            <View style={!pressPlus ? [styles.contentContainer] : [styles.contentContainer, { opacity: 0.1 }]}>
                <TextInput
                    style={styles.textInput}
                    onChangeText={filter => setFilter(filter)}
                    value={filter}
                    placeholder='Search'
                    onEndEditing={() => onFilter()}
                />
                <SafeAreaView style={styles.mainContent}>
                    <FlatList
                        style={styles.friendlist}
                        data={friendsList}
                        renderItem={({ item }) => (
                            <FriendListItem item={item} icon={{ image: faMessage, size: 20 }} />
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
        backgroundColor:'white'
    },
    mainContent: {
        flex: 1,
        width: '100%',
        marginTop:20
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
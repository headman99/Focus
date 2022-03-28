import { StyleSheet, Text, View, TextInput, FlatList, SafeAreaView, TouchableOpacity, LogBox, Animated,Dimensions,StatusBar } from 'react-native'
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
import FriendListItem from '../components/FriendListItem';
import { faMessage } from "@fortawesome/free-solid-svg-icons";
import { userInformationsContext } from '../Stacks/TabNavigator';

const Friends = () => {
    const {userInfo,friendsField} = React.useContext(userInformationsContext);
    const [filter, setFilter] = useState('');
    //const [friends, setFriends] = useState([]);
    const [selectedItem, setSelectedItem] = useState() //elemento selezionato quando premo a lungo su una card, serve per aggiornare l'array di amici senza dover fare ogni volta nuove richieste
    LogBox.ignoreLogs(["Setting a timer", "AsyncStorage has been extracted from react-native core"])

    
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
            const {friends,setFriends} = friendsField;
            const { item, action } = selectedItem;
            if (action == 'delete') {
                setFriends(friends?.filter(friend => friend.username !== item.username))
                handleDeleteItem(doc(database, 'users', item.idDoc))
            }
        }

    }, [selectedItem]);

    const returnFilter = () => {
        if (filter !== '') {
            return friendsField.friends?.filter(friend => friend.username.toUpperCase().startsWith(filter.toUpperCase()))
        } else {
            return friendsField.friends;
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.container}>
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
                </View>
            </View>
        </View>
    )
}

export default Friends

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems:'center'
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
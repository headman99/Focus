import { StyleSheet, Text, View, TextInput, FlatList, SafeAreaView, TouchableOpacity, LogBox, Button } from 'react-native'
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
    arrayUnion,
    deleteDoc
} from "firebase/firestore";
import { auth, database } from '../firebas';
import FriendListItem from '../components/FriendListItem';
import { faMessage } from "@fortawesome/free-solid-svg-icons";
import { userInformationsContext } from '../Stacks/TabNavigator';
import Toast from 'react-native-toast-message'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { useNavigation } from '@react-navigation/native';
import SearchHeaderBar from '../components/SearchHeaderBar';


const Friends = () => {
    const { userInfo, friendsField } = React.useContext(userInformationsContext);
    const navigation = useNavigation();
    const [filter, setFilter] = useState('');
    const [filteredfriends, setFilteredFriends] = useState(friendsField.friends);
    LogBox.ignoreLogs(["Setting a timer", "AsyncStorage has been extracted from react-native core"])

    const deleteItem = (item) => {
        try {
            const document = doc(database, 'users', userInfo.idDoc, 'friends', item);
            deleteDoc(document)
        } catch (error) {
            console.log(error.message)
            Toast.show({
                type: 'error',
                text1: 'DELETE',
                text2: 'Impossible to remove friend',
                position: 'bottom',
                visibilityTime: 2000,

            })
        }

        Toast.show({
            type: 'success',
            text1: 'DELETE',
            text2: 'The friend has been removed succesfully',
            position: 'bottom',
            visibilityTime: 2000,

        })

    }

    useEffect(() => {
        if (filter) {
            setFilteredFriends(friendsField.friends?.filter(friend => friend.username.toUpperCase().startsWith(filter.toUpperCase())));
        } else {
            setFilteredFriends(friendsField?.friends)
        }
    }, [filter])


    const handleDeleteItem = React.useCallback((idDocItem) => {
        deleteItem(idDocItem)
    }, [])

useLayoutEffect(() => {
    console.log("useLayout")
    setFilteredFriends(filter ? friendsField.friends?.filter(friend => friend.username.toUpperCase().startsWith(filter.toUpperCase())) : friendsField.friends)
}, [friendsField.friends])

return (
    <View style={styles.container}>
        <SearchHeaderBar
            filter={filter}
            setFilter={setFilter}
            goBackArrow={false}
        />
        <SafeAreaView style={styles.mainContent}>
            <FlatList
                style={styles.friendlist}
                data={filteredfriends}
                renderItem={({ item }) => (
                    <FriendListItem
                        item={item}
                        iconImage={faMessage}
                        iconSize={20}
                        MultiSelectionVisible={true}
                        handleDelete={handleDeleteItem}
                    />
                )}
                keyExtractor={item => item.idDoc}
            />
            <View style={styles.plusContainer}>
                <TouchableOpacity style={styles.plusButton}
                    onPress={() => {
                        navigation.navigate("SearchFriend")
                    }}
                >
                    <FontAwesomeIcon icon={faPlusCircle} size={50} />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
        <Toast />
    </View >
)
}

export default Friends

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    mainContent: {
        flex: 1,
        width: '100%',
        marginTop: 20
    },
    contentContainer: {
        flex: 1,
        justifyContent: 'center',
        flexDirection: 'column',
        alignItems: 'center',
    },
    plusContainer: {
        position: 'absolute',
        right: '5%',
        bottom: '5%'
    },
})
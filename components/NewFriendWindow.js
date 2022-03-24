import {
    StyleSheet,
    Text,
    View,
    Animated,
    SafeAreaView,
    Dimensions,
    TouchableOpacity,
    Modal,
    Alert,
    TextInput
} from 'react-native'
import React, { useState, useEffect, useLayoutEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FlatList } from 'react-native-gesture-handler';
import FriendListItem from './FriendListItem';
import { getUsersBySimilarUsername, getPossibleFriendsBySimilarUsername } from '../api';
import { database } from '../firebase';
import { faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { arrayUnion, doc, updateDoc } from 'firebase/firestore';
import { userInformationsContext } from '../Stacks/Drawer';


const NewFriendWindow = ({ pressPlus, setPressPlus, friends }) => {
    const [newFriends, setNewFriends] = useState([]);
    const [filter, setFilter] = useState('');
    const userInfo = React.useContext(userInformationsContext);

    const handleFilter = async () => {
        let arrayPromises;
        if(friends?.length>0){
             arrayPromises = await getPossibleFriendsBySimilarUsername(database, filter, friends);
        }else{
            arrayPromises = await getUsersBySimilarUsername(database,filter);
        }
            
        if (arrayPromises != null) {
            let array = await Promise.all(arrayPromises);
            setNewFriends(array);
        }

    }

    const OnPressAddFriend = async (friendDoc) => {
        try{
            const result = await updateDoc(doc(database,"users",userInfo.idDoc),{
            friendsRef: arrayUnion(friendDoc)
        });
            console.log(result) 
        }catch(error){
            console.log(error.message())
        }
    }

    if (!pressPlus) {
        return null
    }

    return (
        <Modal
            animationType='slide'
            transparent={false}
            visible={pressPlus}
            onRequestClose={() => {
                Alert.alert('Modal has now been closed.');
            }}>
            <View style={styles.headerContainer}>
                <TouchableOpacity style={styles.Xbutton}
                    onPress={() => setPressPlus(false)}
                >
                </TouchableOpacity>
            </View>
            <SafeAreaView style={styles.content}>
                <TextInput
                    style={styles.textInput}
                    onChangeText={filter => setFilter(filter)}
                    value={filter}
                    placeholder='Search'
                    onEndEditing={handleFilter}
                />
                <View style={styles.mainContent}>
                    <FlatList
                        style={styles.friendlist}
                        data={newFriends}
                        renderItem={({ item }) => (
                            <FriendListItem item={item}
                                icon = {{ image: faUserPlus, size: 25 }}
                                onPressIcon={OnPressAddFriend}
                            />
                        )}
                        keyExtractor={(friend) => friend.id}
                    />
                </View>
            </SafeAreaView>
        </Modal>

    )
}

export default NewFriendWindow

const styles = StyleSheet.create({

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
        alignItems: 'center'
    },
    textInput: {
        width: '80%',
        height: 50,
        borderColor: 'black',
        borderRadius: 10,
        marginTop: '5%',
        padding: 10,
        borderWidth: 1,
        backgroundColor:'white'

    },
    mainContent: {
        flex: 1,
        marginTop:10
    },
    friendlist: {
        flex: 1
    },

})
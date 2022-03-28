import { StyleSheet, Text, View } from 'react-native'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Friends from '../screens/Friends';
import NewFriendWindow from '../screens/NewFriendWindow';
import React, { useEffect, createContext } from 'react'
import { userInformationsContext } from '../Stacks/TabNavigator';
export const friendsContext = createContext()
import {
    getDoc
} from 'firebase/firestore'

const Tab = createMaterialTopTabNavigator();

const FriendsNavigator = () => {
    const userInfo = React.useContext(userInformationsContext);
    const [friends, setFriends] = React.useState([]);

    const readFriendsFromDB = React.useCallback(async () => {
        console.log("leggo gli amici")
        const friendsRefPromises = userInfo.data.friendsRef.map(async element => await getDoc(element));
        const friendDocs = await Promise.all(friendsRefPromises);
        let ArraydiAmici = friendDocs.map(documento => ({
            id: documento.data().id,
            username: documento.data().username,
            avatar: documento.data().avatar,
            idDoc: documento.id
        }));

        setFriends(ArraydiAmici);
    },[]);
    
    useEffect(() => {
        readFriendsFromDB();
        return (() => {

        })
    }, [])

    return (
        <friendsContext.Provider value={{ friends: friends, setFriends: setFriends }}>
            <Tab.Navigator initialRouteName='friends'>
                <Tab.Screen component={Friends} name='friends' />
                <Tab.Screen component={NewFriendWindow} name="NewFriend" />
            </Tab.Navigator>
        </friendsContext.Provider>
    )
}

export default FriendsNavigator

const styles = StyleSheet.create({})
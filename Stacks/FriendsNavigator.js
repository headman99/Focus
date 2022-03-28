import { StyleSheet, Text, View } from 'react-native'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Friends from '../screens/Friends';
import NewFriendWindow from '../screens/NewFriendWindow';
import React, { useEffect, createContext } from 'react'
import { userInformationsContext } from '../Stacks/TabNavigator';
import {
    getDoc
} from 'firebase/firestore'

const Tab = createMaterialTopTabNavigator();

const FriendsNavigator = () => {
    const userInfo = React.useContext(userInformationsContext);
    const [friends, setFriends] = React.useState([]);
    
    return (
            <Tab.Navigator initialRouteName='friends'>
                <Tab.Screen component={Friends} name='friends' />
                <Tab.Screen component={NewFriendWindow} name="NewFriend" />
            </Tab.Navigator>
    )
}

export default FriendsNavigator

const styles = StyleSheet.create({})
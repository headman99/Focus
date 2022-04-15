import { StyleSheet, Text, View } from 'react-native'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Friends from '../screens/Friends';
import NewFriendWindow from '../screens/NewFriendWindow';
import React, { useEffect, createContext } from 'react'
import { userInformationsContext } from '../Stacks/TabNavigator';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import PendingFriends from '../screens/PendingFriends';

//const Tab = createMaterialTopTabNavigator();
const Stack = createNativeStackNavigator();

const FriendsNavigator = () => {
    const userInfo = React.useContext(userInformationsContext);

    return (
            <Stack.Navigator initialRouteName='friends'>
                <Stack.Screen component={Friends} name='friends' 
                    options={{
                        headerShown:false
                    }}
                />
                <Stack.Screen component={NewFriendWindow} name="SearchFriend"
                     options={{
                        headerShown:false
                    }}
                />
                <Stack.Screen component={PendingFriends} name="PendingFriends"/>
            </Stack.Navigator>
    )
}

export default FriendsNavigator

const styles = StyleSheet.create({})
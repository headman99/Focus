import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import UserRequest from '../screens/UserRequest';
import Invitations from '../screens/Invitations';

const Tab = createMaterialTopTabNavigator();

const TabNotifications = () => {
  console.log("Notificatoins")
  return (
    <Tab.Navigator initialRouteName='Userrequest'>
        <Tab.Screen name='friendship Requests' component={UserRequest}/>
        <Tab.Screen name='invitations' component={Invitations}/>
    </Tab.Navigator>
  )
}

export default TabNotifications

const styles = StyleSheet.create({})
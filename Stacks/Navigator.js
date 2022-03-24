import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Login from '../screens/Login'
import Loading from '../screens/Loading';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Drawer from './Drawer';
const Navigator = () => {

    const Stack = createNativeStackNavigator();
    return (
        <Stack.Navigator initialRouteName="Loading">
            <Stack.Screen name="Loading" component={Loading} />
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen options={{headerShown:false}} name="MainPage" component={Drawer}/>
        </Stack.Navigator>
    )
}

export default Navigator

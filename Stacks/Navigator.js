import React from 'react'
import Login from '../screens/Login'
import Loading from '../screens/Loading';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TabNavigator from './TabNavigator';
const Navigator = () => {

    const Stack = createNativeStackNavigator();
    return (
        <Stack.Navigator initialRouteName="Loading">
            <Stack.Screen name="Loading" component={Loading} />
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen options={{headerShown:false}} name="MainPage" component={TabNavigator}/>
        </Stack.Navigator>
    )
}

export default Navigator

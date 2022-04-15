import { StyleSheet, Text, View, TextInput } from 'react-native'
import React, { useState, useEffect } from 'react'
import { createDrawerNavigator } from '@react-navigation/drawer';
import Home from '../screens/Home'
import Settings from '../screens/Settings.js'
import Profile from '../screens/Profile'
import { auth, database } from '../firebase';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';



const HomeDrawer = () => {
    const Drawer = createDrawerNavigator();
    const [filter,setFilter] = useState('')
    return (
        <Drawer.Navigator initialRouteName='Home'
            screenOptions={{
                swipeEdgeWidth:100,
                drawerType:'slide',
                keyboardDismissMode:'on-drag'
            }}
        >
            <Drawer.Screen name='Home' component={Home}
                options={{
                    title:'',
                    drawerLabel:'Home',
                }}
            />
            <Drawer.Screen name="Settings" component={Settings} />
            <Drawer.Screen name="Profile" component={Profile} />
        </Drawer.Navigator>
    )
}

export default HomeDrawer


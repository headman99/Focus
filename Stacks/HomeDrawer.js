import { StyleSheet, Text, View, TextInput } from 'react-native'
import React, { useState, useEffect,useContext } from 'react'
import { createDrawerNavigator } from '@react-navigation/drawer';
import Home from '../screens/Home'
import Settings from '../screens/Settings.js'
import Profile from '../screens/Profile'
import Riepilogo from '../screens/Riepilogo';
import { auth, database } from '../firebas';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { collection, limit, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { userInformationsContext } from './TabNavigator';



const HomeDrawer = () => {
    const Drawer = createDrawerNavigator();

    const FilterSpace = () =>{
        return(
            <View></View>
        )
    }

    return (
        <Drawer.Navigator initialRouteName='Home'
            screenOptions={{
                swipeEdgeWidth:100,
                drawerType:'slide',
                keyboardDismissMode:'on-drag'
                
            }}
            defaultScreenOptions={{
                headerShadowVisible:true
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
            <Drawer.Screen name='Resume' options={{
               headerTitle: (props)=> <FilterSpace />
            }} component={Riepilogo}/>
        </Drawer.Navigator>
    )
}

export default HomeDrawer


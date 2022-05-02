import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native'
import React from 'react'
import { createDrawerNavigator } from '@react-navigation/drawer';
import Settings from '../screens/Settings.js'
import Profile from '../screens/Profile'
import Riepilogo from '../screens/Riepilogo';
import HomeStack from './HomeStack'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowLeft,faGripLines } from '@fortawesome/free-solid-svg-icons';
import Header from '../components/Header.js';
import { render } from 'react-dom';
import NormalDrawerHeader from '../components/NormalDrawerHeader.js';




const HomeDrawer = () => {
    const Drawer = createDrawerNavigator();

    const FilterSpace = () => {
        return (
            <View></View>
        )
    }

    return (
        <Drawer.Navigator initialRouteName='Home'
            screenOptions={{
                swipeEdgeWidth: 100,
                drawerType: 'slide',
                keyboardDismissMode: 'on-drag',

            }}
            defaultScreenOptions={{
                headerShadowVisible: true,
            }}
        >
            <Drawer.Screen name='Home' component={HomeStack}
                options={() => ({
                    headerShown: false
                })}
            />
            <Drawer.Screen name="Settings" component={Settings}
                options={({navigation}) => ({
                    header: (props) => (
                           <NormalDrawerHeader title="Settings" {...props}/>
                        )
                })}
            />
            <Drawer.Screen name="Profile" component={Profile}
                options={() => ({
                    header: (props) => (
                        <NormalDrawerHeader title="Profile" {...props}/>
                    )
                })}
            />
            <Drawer.Screen name='Resume' options={()=>({
                header: (props) => (
                    <NormalDrawerHeader title="Resume" {...props}/>
                )
                })} component={Riepilogo} />
        </Drawer.Navigator>
    )
}

export default HomeDrawer


import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native'
import React from 'react'
import { createDrawerNavigator } from '@react-navigation/drawer';
import Settings from '../screens/Settings.js'
import Profile from '../screens/Profile'
import Riepilogo from '../screens/Riepilogo';
import HomeStack from './HomeStack'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faSignOut } from '@fortawesome/free-solid-svg-icons';
import {
    DrawerContentScrollView,
    DrawerItemList,
    DrawerItem
} from '@react-navigation/drawer';
import { signOut } from 'firebase/auth'
import { auth } from '../firebas'
import { useNavigation } from '@react-navigation/native';
import { userInformationsContext } from './TabNavigator.js';
import { theme } from '../utils.js';

const HomeDrawer = () => {
    const Drawer = createDrawerNavigator();
    const navigation = useNavigation();
    const { listeners } = React.useContext(userInformationsContext)

    const CustomdrawerComponent = (props) => {
        return (
            <DrawerContentScrollView {...props}>
                <DrawerItemList {...props} />
                <DrawerItem
                    label=""
                    activeBackgroundColor='blue'
                    icon={() => (
                        <FontAwesomeIcon icon={faSignOut} size={20} />
                    )}
                    onPress={() => {
                        Alert.alert(
                            "Sign out",
                            "Do you want exit the app?",
                            [
                                {
                                    text: 'Cancel',
                                    onPress: () => console.log("cancel pressed"),
                                    style: 'cancel'
                                },
                                {
                                    text: 'Yes',
                                    onPress: () => handleSignOut()
                                }
                            ]
                        )
                    }}
                />
            </DrawerContentScrollView>
        )
    }

    const FilterSpace = () => {
        return (
            <View></View>
        )
    }

    const handleSignOut = () => {
        console.log(listeners.current)
        listeners.current?.forEach(listener => listener());
        signOut(auth).then(() => {
            navigation.replace("Login")
        }).catch(error => alert(error.message))
    }

    return (
        <Drawer.Navigator initialRouteName='Home'
            screenOptions={{
                swipeEdgeWidth: 30,
                drawerType: 'slide',
                keyboardDismissMode: 'on-drag',
                headerTintColor:theme.inactiveLabelColor,
                headerStyle:{backgroundColor:theme.inactiveBackgroundColor},
                drawerActiveBackgroundColor:theme.inactiveBackgroundColor,
                drawerAllowFontScaling: true,
                drawerActiveTintColor:theme.activeLabelColor
            }}
            defaultScreenOptions={()=>({
                headerShadowVisible:true
            })}

            drawerContent={(props) => <CustomdrawerComponent {...props} />}
        >
            <Drawer.Screen name='Home' component={HomeStack}
                options={()=>({
                    headerShown:true,
                    headerTintColor:theme.inactiveLabelColor,
                    headerStyle:{backgroundColor:theme.inactiveBackgroundColor}
                })}
                
            />
            <Drawer.Screen name="Settings" component={Settings}/>
            <Drawer.Screen name="Profile" component={Profile} />
            <Drawer.Screen name='Resume' component={Riepilogo} />

        </Drawer.Navigator>
    )
}

export default HomeDrawer


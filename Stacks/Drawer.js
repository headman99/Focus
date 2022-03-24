import { StyleSheet, Text, View } from 'react-native'
import React, { useState, useEffect } from 'react'
import { createDrawerNavigator } from '@react-navigation/drawer';
import Home from '../screens/Home'
import Chat from '../screens/Chat'
import Friends from '../screens/Friends';
import { getUserInformationsByMail } from '../api';
import { auth, database } from '../firebase';


export const userInformationsContext = React.createContext();

const Drawer = () => {
    const Drawer = createDrawerNavigator();
    const [userInfo, setUserInfo] = useState();


    useEffect(/*async*/() => {
        //necessario farla cosi perchè mettere async lì dove ho commentato non è possibile
        (async () => {
            console.log("eseguito")
            const userInfo = await getUserInformationsByMail(database, auth?.currentUser?.email.toString());
            const promise = await Promise.resolve(userInfo)
            setUserInfo(promise)
        })();
        return ()=>{
            
        }

    }, [auth.currentUser])

    return (
        <userInformationsContext.Provider value={userInfo}>
            <Drawer.Navigator initialRouteName="Home">
                <Drawer.Screen /*options={{headerShown:false}}*/ name="Home" component={Home} />
                <Drawer.Screen /*options={{headerShown:false}}*/ name="Chat" component={Chat} />
                <Drawer.Screen /*options={{headerShown:false}}*/ name="Friends" component={Friends} />
            </Drawer.Navigator>
        </userInformationsContext.Provider>
    )
}

export default Drawer

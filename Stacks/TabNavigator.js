import React, { useState, useEffect } from 'react'
import Home from '../screens/Home'
import Chat from '../screens/Chat'
import FriendsNavigator from './FriendsNavigator';
import Notifications from '../screens/Notifications';
import { getUserInformationsByMail } from '../api';
import { auth, database } from '../firebase';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faHome, faMessage, faUserFriends } from '@fortawesome/free-solid-svg-icons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { StatusBar } from 'expo-status-bar';
import { getDoc } from 'firebase/firestore';



export const userInformationsContext = React.createContext();

const TabNavigator = () => {
    const Tab = createBottomTabNavigator();
    const [userInfo, setUserInfo] = useState();
    const [friends, setFriends] = useState([]);

    const readFriendsFromDB = React.useCallback(async (userInfo) => {
        console.log("leggo gli amici")
        const friendsRefPromises = userInfo.data.friendsRef.map(async element => await getDoc(element));
        const friendDocs = await Promise.all(friendsRefPromises);
        let ArraydiAmici = friendDocs.map(documento => ({
            id: documento.data().id,
            username: documento.data().username,
            avatar: documento.data().avatar,
            idDoc: documento.id
        }));

        setFriends(ArraydiAmici);
    }, []);


    const readUserInfo = React.useCallback(async () => {
        const userInfo = await getUserInformationsByMail(database, auth?.currentUser?.email.toString());
        const promiseResult = await Promise.resolve(userInfo)
        setUserInfo(promiseResult)
        return promiseResult;
    },[]);

    useEffect(async () => {
        readUserInfo().then(async(result) =>{
            await readFriendsFromDB(result)
        })
        
        return () => {
        }

    }, [auth.currentUser])

    return (
        <userInformationsContext.Provider value={{
            userInfo:userInfo,
            friendsField:{
                friends:friends,
                setFriends:setFriends
            }
            }}>
            <StatusBar />
            <Tab.Navigator initialRouteName="Home"
                screenOptions={() => ({
                    tabBarInactiveBackgroundColor: "#011f3b",
                    tabBarActiveBackgroundColor: "#032845",
                    tabBarInactiveTintColor: "#f8ca12",
                    tabBarActiveTintColor: "#ffffff",
                    tabBarIconStyle: { marginTop: 4 },
                    tabBarLabelStyle: { fontSize: 13, color: '#f8ca12', paddingBottom: 3 },
                    tabBarStyle: { height: 55, zIndex: 4, borderTopWidth: 0 },
                    style: { borderColor: '#011f3b' },
                    headerShown: false,
                    unmountOnBlur: true,
                })}
            >
                <Tab.Screen /*options={{headerShown:false}}*/ name="Home" component={Home}
                    options={{
                        tabBarLabel: 'Home',
                        tabBarIcon: ({ color }) => {
                            return <MaterialIcons name='home' color={color} size={29} style={{ marginTop: 1 }} />
                        },
                        tabBarBadge: 3 //to display notifications

                    }}
                />
                <Tab.Screen /*options={{headerShown:false}}*/ name="Chat" component={Chat}
                    options={{
                        tabBarLabel: 'Chat',
                        tabBarIcon: ({ color, size }) => {
                            return <MaterialIcons name="chat" color='white' size={size} style={{ marginTop: 1 }} />
                        }
                    }}
                />
                <Tab.Screen /*options={{headerShown:false}}*/ name="Friends" component={FriendsNavigator}
                    options={{
                        tabBarLabel: 'Friends',
                        tabBarIcon: ({ color, size }) => {
                            return <FontAwesomeIcon icon={faUserFriends} color='white' size={size} style={{ marginTop: 1 }} />
                        }
                    }}
                />
                <Tab.Screen /*options={{headerShown:false}}*/ name="Notifications" component={Notifications}
                    options={{
                        tabBarLabel: 'Notifications',
                        tabBarIcon: ({ color, size }) => {
                            return <MaterialIcons name='notifications' color='white' size={size} style={{ marginTop: 1 }} />
                        }
                    }}
                />
            </Tab.Navigator>
        </userInformationsContext.Provider>
    )
}

export default TabNavigator

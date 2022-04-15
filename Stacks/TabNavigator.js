import React, { useState, useEffect } from 'react'
import HomeDrawer from './HomeDrawer';
import Chat from '../screens/Chat'
import Start from '../screens/Start';
import FriendsNavigator from './FriendsNavigator';
import TabNotifications from './TabNotifications'
import { getUserInformationsByMail } from '../api';
import { auth, database } from '../firebase';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faHome, faMessage, faUserFriends, faPlus, faBookOpen, faBookAtlas, faBookOpenReader } from '@fortawesome/free-solid-svg-icons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { StatusBar } from 'expo-status-bar';
import {
    getDoc,
    query,
    collection,
    onSnapshot,
    where,
    setDoc,
    updateDoc,
    doc,
    writeBatch,
    deleteDoc,
    arrayUnion
} from 'firebase/firestore';
import { StyleSheet, TouchableOpacity, View, Button } from 'react-native'
import { useNavigation } from '@react-navigation/native';
import AwesomeButton from 'react-native-really-awesome-button';






export const userInformationsContext = React.createContext();

const TabNavigator = () => {
    const navigator = useNavigation()
    const Tab = createBottomTabNavigator();
    const [userInfo, setUserInfo] = useState();
    const [friends, setFriends] = useState([]);
    const [notifications, setNotifications] = useState([]);
    //badges state
    const [badgeNotifications, setBadgeNotifications] = useState(0);



    /**Read friends from db and detect changes */
    const readFriendsFromDB = async (userInfo) => {
        /*console.log("leggo gli amici")
        const friendsRefPromises = userInfo.data.friendsRef.map(async element => await getDoc(element));
        const friendDocs = await Promise.all(friendsRefPromises);
        let ArraydiAmici = friendDocs.map(documento => ({
            id: documento.data().id,
            username: documento.data().username,
            avatar: documento.data().avatar,
            idDoc: documento.id
        }));*/
        const unsub = onSnapshot(query(collection(database, 'users', userInfo.idDoc, 'friends')), (snap) => {
            console.log("eseguo lettura amici")
            let ArraydiAmici = [];
            snap.forEach(async (elem) => {
                const amico = await getDoc(elem.data().friend);
                ArraydiAmici.push({
                    username: amico.data().username,
                    avatar: amico.data().avatar,
                    id: amico.data().id,
                    idDoc: amico.id
                })
            })
            setFriends(ArraydiAmici);
        })
    };


    const readUserInfo = React.useCallback(async () => {
        const userInfo = await getUserInformationsByMail(database, auth?.currentUser?.email.toString());
        const promiseResult = await Promise.resolve(userInfo);
        if (promiseResult)
            setUserInfo(promiseResult)
        return promiseResult;
    }, []);

    /*
        Detect changes in notifications for userRequests 
    */
    const detectNotificationsChanges = async (user) => {
        /**Riempie lo state delle notifiche per mostrarle nell'apposita pagina e attende per eventuali cambiamenti */
        const collectionRef = collection(database, 'notifications', user.idDoc, 'userRequests');
        const q1 = query(collectionRef, where('type', '==', 'received')); //ordina per tempo discendente e prende tutte le notifiche pending
        onSnapshot(q1, snapshot => {
            setNotifications(
                snapshot.docs.map(doc => ({
                    requestRef: doc.data().requestRef,
                    id: doc.data().id,
                    createdAt: doc.data().createdAt,
                    sender: doc.data().sender,
                    idDoc: doc.id,
                }))
            )
        });

        /**Riceve cambiamenti nelle richieste di amicizia, se l'amico accetta o rifiuta la richiesta bisogna triggerare una specifica azione */
        const q2 = query(collection(database, 'notifications', user.idDoc, 'userRequests'), where('state', 'in', ['accepted', 'denied']));
        onSnapshot(q2, (snapDocs) => {
            snapDocs.forEach(async (snap) => {
                if (snap.data().state === 'accepted') {
                    console.log("accepted")
                    const batch = writeBatch(database);
                    /*batch.update(doc(database, 'users', user.idDoc), {
                        friendsRef: arrayUnion(doc(database,'users', snap.id))
                    })*/
                    batch.set(doc(database, 'users', user.idDoc, 'friends', snap.id), {
                        friend: doc(database, 'users', snap.id)
                    });

                    batch.delete(doc(database, 'notifications', user.idDoc, 'userRequests', snap.id));
                    await batch.commit();
                } else if (snap.data().state === 'denied') {
                    await deleteDoc(doc(database, 'notifications', user.idDoc, 'userRequests', snap.id))
                }
            })
        });

        /**Riceve i cambiamenti di stato di una notifica per capire se è stata letta o meno dall'utente. Aiuta a settare il parametro
         * tabBarBadge della sezione notifiche
         */
        const q3 = query(collection(database, 'notifications', user.idDoc, 'userRequests'), where('read', '==', false));
        onSnapshot(q3, (snapDocs) => {
            setBadgeNotifications(snapDocs?.docs?.length);
        })
    }

    //setta i listener
    useEffect(async () => {
        const user = await readUserInfo();
        await readFriendsFromDB(user);
        await detectNotificationsChanges(user)
        return () => { }

    }, [auth.currentUser])

    return (
        <userInformationsContext.Provider value={{
            userInfo: userInfo,
            friendsField: {
                friends: friends,
                setFriends: setFriends
            },
            notifications: notifications
        }}>
            <StatusBar />
            <Tab.Navigator initialRouteName="HomeDrawer"
                screenOptions={() => ({
                    tabBarInactiveBackgroundColor: "#011f3b",
                    tabBarActiveBackgroundColor: "#032845",
                    tabBarInactiveTintColor: "#ffffff",
                    tabBarActiveTintColor: "#f8ca12",
                    tabBarIconStyle: { marginTop: 4 },
                    tabBarLabelStyle: { fontSize: 13, paddingBottom: 3 },
                    tabBarStyle: styles.tabBar,
                    headerShown: false,
                    unmountOnBlur: false,
                    tabBarHideOnKeyboard: true
                    //tabBarVisibilityAnimationConfig:false
                })}
            >
                <Tab.Screen /*options={{headerShown:false}}*/ name="HomeDrawer" component={HomeDrawer}
                    options={{
                        tabBarLabel: 'Home',
                        tabBarIcon: ({ color, size }) => {
                            return <MaterialIcons name='home' color={color} size={29} style={{ marginTop: 1 }} />
                        },
                        //headerShown:false

                    }}
                />
                <Tab.Screen /*options={{headerShown:false}}*/ name="Chat" component={Chat}
                    options={{
                        tabBarLabel: 'Chat',
                        tabBarIcon: ({ color, size }) => {
                            return <MaterialIcons name="chat" color={color} size={size} style={{ marginTop: 1 }} />
                        }
                    }}
                />
                <Tab.Screen
                    name="Start"
                    component={Start}
                    options={{
                        tabBarLabel: '',
                        tabBarInactiveBackgroundColor: "#011f3b",
                        tabBarActiveBackgroundColor: "#011f3b",
                        tabBarIcon: () => {
                            return (
                                <AwesomeButton
                                    style={styles.PlusContainer}
                                    raiseLevel={4}
                                    borderRadius={50}
                                    backgroundColor='red'
                                    width={70}
                                    height={70}
                                    backgroundDarker='white'
                                    onPress={() => {
                                        setTimeout(() => {
                                            navigator.navigate("Start")
                                        }, 150)
                                    }

                                    }
                                >
                                    <FontAwesomeIcon icon={faBookOpenReader} size={35} color='white' />
                                </AwesomeButton>

                            )
                        },
                        tabBarButton: (props) => (
                            <View style={{ backgroundColor: 'blue' }} {...props}></View>
                        )


                    }}
                />
                <Tab.Screen /*options={{headerShown:false}}*/ name="Friends" component={FriendsNavigator}
                    options={{
                        headerShown: false,
                        tabBarIcon: ({ color, size }) => {
                            return <FontAwesomeIcon icon={faUserFriends} color={color} size={size} style={{ marginTop: 1 }} />
                        }

                    }}
                />
                <Tab.Screen /*options={{headerShown:false}}*/ name="Notifications" component={TabNotifications}
                    options={{
                        tabBarLabel: 'Notifications',
                        tabBarIcon: ({ color, size }) => {
                            return <MaterialIcons name='notifications' color={color} size={size} style={{ marginTop: 1 }} />
                        },
                        tabBarBadge: badgeNotifications === 0 ? null : badgeNotifications
                    }}
                />
            </Tab.Navigator>
        </userInformationsContext.Provider>
    )
}

const styles = StyleSheet.create({
    tabBar: {
        height: 55,
        zIndex: 4,
        borderTopWidth: 0,
        borderTopLeftRadius: 50
    },
    PlusContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 30
    }
})

export default TabNavigator

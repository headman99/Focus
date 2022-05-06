import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React, { useLayoutEffect } from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Home from '../screens/Home'
import CreateGroup from '../screens/CreateGroup'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faPlus, faGripLines, faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { getFocusedRouteNameFromRoute } from '@react-navigation/native'
import { useNavigation } from '@react-navigation/native'
import Header from '../components/Header'


const HomeStack = () => {
    const Stack = createNativeStackNavigator();
    return (
        <Stack.Navigator>
            <Stack.Screen name='Home ' component={Home}
                options={({navigation}) => ({
                    header: () => (
                        <Header
                            HeaderLeft={(
                                <TouchableOpacity style={{ width:'100%',height:'100%', justifyContent: 'center', alignItems: 'center' }}
                                    onPress={() => {
                                        navigation.toggleDrawer()
                                    }}
                                >
                                    <FontAwesomeIcon icon={faGripLines} size={25} />
                                </TouchableOpacity>
                            )}
                            HeaderContent={(
                                <Text style={{ fontSize: 20 }}>Home</Text>
                            )}
                            HeaderRight={(
                                <TouchableOpacity style={{ flex: 1,width:'100%', justifyContent: 'center', alignItems: 'center' }}
                                    onPress={() => {
                                        //navigation.navigate("CreateGroup")
                                    }}
                                >
                                    <FontAwesomeIcon icon={faPlus} size={25} />
                                </TouchableOpacity>

                            )}
                        />
                    )
                })}
            ></Stack.Screen>
            <Stack.Screen name='CreateGroup' component={CreateGroup}
                options={({}) => ({
                    header: () => (
                        <Header
                            HeaderLeft={(
                                <TouchableOpacity style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
                                    onPress={() => {
                                        //navigation.goBack()
                                    }}
                                >
                                    <FontAwesomeIcon icon={faArrowLeft} size={25} />
                                </TouchableOpacity>
                            )}
                            HeaderContent={(
                                <Text style={{ fontSize: 20 }}>New Group</Text>
                            )}
                            
                        />
                    )
                })}
            ></Stack.Screen>
        </Stack.Navigator>
    )
}

export default HomeStack

const styles = StyleSheet.create({

})


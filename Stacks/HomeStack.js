import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React, { useLayoutEffect,useEffect } from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Home from '../screens/Home'
import CreateGroup from '../screens/CreateGroup'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faArrowLeft, faPlus } from '@fortawesome/free-solid-svg-icons'
import { useNavigation } from '@react-navigation/native'
import SessionInfo from '../screens/SessionInfo'
import { theme } from '../utils'

const HomeStack = () => {
    const Stack = createNativeStackNavigator();
    const navigation = useNavigation();


    useLayoutEffect(()=>{
        navigation.setOptions({
            headerRight: () =>(
                <TouchableOpacity onPress={()=>navigation.navigate("CreateGroup")}>
                    <FontAwesomeIcon icon={faPlus} size={25} style={{marginRight:20,color:theme.inactiveLabelColor}}/>
                </TouchableOpacity>
            )
        })
    },[navigation])


    

    return (
        <Stack.Navigator initialRouteName='Home '>
            <Stack.Screen name='Home ' component={Home}
                options={() => ({
                    headerShown:false
                })}
            ></Stack.Screen>
            <Stack.Group>
                 <Stack.Screen name='CreateGroup' component={CreateGroup} 
                    options={()=>({
                        headerShown:false
                    })}
                 ></Stack.Screen>
            <Stack.Screen name='SessionInfo' component={SessionInfo}
                 options={()=>({
                    headerShown:false
                })}
            />
            </Stack.Group>
           
        </Stack.Navigator>
    )
}

export default HomeStack

const styles = StyleSheet.create({

})


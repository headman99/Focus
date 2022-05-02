import { StyleSheet, Text, View } from 'react-native'
import React,{useEffect,useLayoutEffect} from 'react'
import { useNavigation } from '@react-navigation/native'
import { useIsFocused } from '@react-navigation/native'


const CreateGroup = () => {
    const navigation = useNavigation();
    const isFocused = useIsFocused();

    return (
        <View>
            <Text>CreateGroup</Text>
        </View>
    )
}

export default CreateGroup

const styles = StyleSheet.create({})
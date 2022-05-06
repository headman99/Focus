import { StyleSheet, Text, View, TouchableOpacity, LogBox } from 'react-native'
import React, { useState, useLayoutEffect } from 'react'
import { auth } from '../firebas'
import { signOut } from 'firebase/auth'
import { useNavigation } from '@react-navigation/native'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'



LogBox.ignoreLogs(['AsyncStorage has been extracted', 'Require cycle', 'Setting a timer'])

const Home = () => {
  const navigation = useNavigation();
  const [filter, setFilter] = useState('');
  console.log("Home")
  return (
    <View style={styles.container}>
    </View>
  )
}

export default Home

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    
  }
})
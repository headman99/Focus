import { StyleSheet, Text, View, TouchableOpacity, LogBox,Button } from 'react-native'
import React, { useState, useLayoutEffect, useEffect,useContext } from 'react'
import { useNavigation } from '@react-navigation/native'
import { auth,database } from '../firebas'
import { userInformationsContext } from '../Stacks/TabNavigator'
import Load from '../screens/Load'



LogBox.ignoreLogs(['AsyncStorage has been extracted', 'Require cycle', 'Setting a timer'])


const Home = () => {

  const {groups} = useContext(userInformationsContext);

  const navigation = useNavigation();
  const [filter, setFilter] = useState('');
 
  return (
    <View style={styles.container}>
      {
        <Load dependency={groups}/>
      }

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
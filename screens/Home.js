import { StyleSheet, Text, View, TouchableOpacity, LogBox, Button, FlatList,Image } from 'react-native'
import React, { useState, useLayoutEffect, useEffect, useContext } from 'react'
import { useNavigation } from '@react-navigation/native'
import { auth, database } from '../firebas'
import { userInformationsContext } from '../Stacks/TabNavigator'
import Load from '../screens/Load'
import { getDoc, doc } from 'firebase/firestore'
import GroupCard from './GroupCard'
import {downloadImages} from '../api'



LogBox.ignoreLogs(['AsyncStorage has been extracted', 'Require cycle', 'Setting a timer'])


const Home = () => {

  const { groups } = useContext(userInformationsContext);
  const [groupsInfo, setGroupsInfo] = useState([]);
  const [dismissLoad, setDismissLoad] = useState(false);

  useEffect(() => {
    if (groups.length==0 || (!dismissLoad && groups?.length > 0)) {
      setDismissLoad(true);
    }

  }, [groups])

  return (
    <View style={styles.container}>
      <Load dismiss={dismissLoad} />
      {
        (groups?.length > 0 && groups !== 'empty') &&
        <FlatList
          //style={{flex:1,height:'100%'}}
          data={groups}
          columnWrapperStyle={{}}
          numColumns={2}
          renderItem={({ item }) => <GroupCard group={item} />}
          keyExtractor={(item) => item.idDoc}
        />
      }
      <Button title='premi' onPress={()=>console.log(groups)} />
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
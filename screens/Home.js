import { StyleSheet, Text, View, TouchableOpacity,LogBox } from 'react-native'
import React,{useState} from 'react'
import { auth } from '../firebas'
import { signOut } from 'firebase/auth'
import { useNavigation } from '@react-navigation/native'
import SearchHeaderBar from '../components/SearchHeaderBar'


LogBox.ignoreLogs(['AsyncStorage has been extracted','Require cycle','Setting a timer'])

const Home = () => {
  const navigation = useNavigation();
  const [filter,setFilter] = useState('')
  
  const handleSignOut = () => {
    signOut(auth).then(() => {
        navigation.replace("Login")
      }).catch(error => alert(error.message))
  }


  return (
    <View style={styles.container}>
    </View>
  )
}

export default Home

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection:'column'
  }
})
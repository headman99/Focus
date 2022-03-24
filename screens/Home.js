import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'
import { auth } from '../firebase'
import { signOut } from 'firebase/auth'
import { useNavigation } from '@react-navigation/native'


const Home = () => {
  const navigation = useNavigation()
  const handleSignOut = () => {
    signOut(auth).then(() => {
        navigation.replace("Login")
      }).catch(error => alert(error.message))
  }
  const goToChat = () =>{
    navigation.navigate("Chat");
  }

  return (
    <View style={styles.container}>
      <Text>Email:{auth.currentUser?.email}</Text>
      <TouchableOpacity
        onPress={handleSignOut}
        style={styles.button}>
        <Text style={styles.buttonText}> Sign out</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={goToChat}
        style={styles.button}>
        <Text style={styles.buttonText}>Go to Chat</Text>
      </TouchableOpacity>
    </View>
  )
}

export default Home

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }, button: {
    backgroundColor: '#0782F9',
    width: '100%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center'
  },
  buttonOutline: {
    backgroundColor: 'white',
    marginTop: 5,
    borderColor: '#0782F9',
    borderWidth: 2
  },
  buttonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16
  },
})
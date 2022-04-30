import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const SessionDetail = ({item}) => {
  return (
    <View style={styles.container}>
      <Text>SessionDetail</Text>
    </View>
  )
}

export default SessionDetail

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'white'
    }
})
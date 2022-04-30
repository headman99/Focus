import { StyleSheet, Text, View,Modal,TouchableOpacity } from 'react-native'
import React,{useCallback} from 'react'
import StopWatch from './stopwatch/StopWatch'

const Start = ({route}) => {
  return (
    <View style={styles.container}>
      <StopWatch/>
    </View>
  )
}

export default Start

const styles = StyleSheet.create({
  container:{
    flex:1
  },
})
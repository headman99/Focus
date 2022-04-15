import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
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
  }
})
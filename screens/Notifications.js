import { StyleSheet, Text, View, TouchableHighlight } from 'react-native'
import React from 'react'

const Notifications = () => {
  return (
    <View style={styles.container}>
      <View style={styles.triggerContainer}>
        <TouchableHighlight style={styles.triggerButton}>
          <Text>ciao</Text>
        </TouchableHighlight>
        <TouchableHighlight style={styles.triggerButton}>
          <Text>sometging</Text>
        </TouchableHighlight>
      </View>
    </View>
  )
}

export default Notifications

const styles = StyleSheet.create({
  container: {

  },
  triggerContainer: {

  },
  triggerButton
    : {

  },
})
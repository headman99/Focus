
import { StyleSheet, Text, View, LogBox,StatusBar,Platform,AppState } from 'react-native';
import React, { useRef, useState, useEffect } from "react";
import { NavigationContainer } from '@react-navigation/native';
import Navigator from './Stacks/Navigator';



export default function App() {
  return (
    <View style={styles.container}>
      <NavigationContainer>
        <Navigator />
      </NavigationContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  container:{
    flex:1,
      paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 10,
  }
  
})

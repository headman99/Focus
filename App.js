
import { StyleSheet, Text, View, LogBox,Platform,AppState,StatusBar } from 'react-native';
import React, { useRef, useState, useEffect } from "react";
import { NavigationContainer } from '@react-navigation/native';
import Navigator from './Stacks/Navigator';
import { theme } from './utils';


export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={theme.inactiveBackgroundColor} animated={true} barStyle='light-content' />
      <NavigationContainer>
        <Navigator />
      </NavigationContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    //paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 10
  }
  
})

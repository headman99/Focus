import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, LogBox } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import Navigator from './Stacks/Navigator';



export default function App() {

  return (
    <NavigationContainer>
      <Navigator />
    </NavigationContainer>
  );
}

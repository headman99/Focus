import { StyleSheet, Text, View } from 'react-native'
import React,{useEffect} from 'react'
import { userInformationsContext } from '../Stacks/TabNavigator'
const PendingFriends = ({route}) => {
    const [pendingFriends,setPendingFriends] = React.useState([]);
    useEffect(()=>{
        console.log("route",route.params)
        setPendingFriends(route?.params?.pendingFriends)
    },[route?.params])

  return (
    <View>
      {pendingFriends.map((friend,index) =>(
          <Text>{friend}</Text>
      ))}
    </View>
  )
}

export default PendingFriends

const styles = StyleSheet.create({})
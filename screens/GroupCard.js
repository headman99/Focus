import { StyleSheet, Text, View,useWindowDimensions } from 'react-native'
import React from 'react'


const GroupCard = ({group}) => {

  const {width,height} = useWindowDimensions()
  return (
    <View style={[styles.container,{height:height*0.15}]}>
      
    </View>
  )
}

export default React.memo(GroupCard)

const styles = StyleSheet.create({
    container:{
        width:'45%',
        borderRadius:15,
        elevation:10,
        marginHorizontal:'2.5%',
        marginVertical:'5%',
        backgroundColor:'white'
    }
})
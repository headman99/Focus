import { StyleSheet, Text, View,ActivityIndicator,Animated } from 'react-native'
import React,{useEffect, useRef} from 'react'
import { theme } from '../utils'

const Load = ({dependency}) => {
const [sliding,setSliding] = React.useState(new Animated.Value(-50))
const dismiss = React.useRef(true)

const slide = (toValue)=>{
    Animated.spring(sliding,{
        toValue:toValue,
        useNativeDriver:true,
        duration:600
    }).start()
}

useEffect(()=>{
    if(dismiss.current){
        slide(-50)
    }
    dismiss.current = false;
},[dependency])

useEffect(()=>{
    slide(20)
},[])
    
  return (
    <Animated.View style={[styles.container,{transform:[{translateY:sliding}]}]}>
      <ActivityIndicator size={'large'} color={theme.inactiveBackgroundColor} style={styles.activityIndicator}/>
    </Animated.View>
  )
}

export default Load

const styles = StyleSheet.create({
    container:{
        position:'absolute',
        justifyContent:'center',
        alignItems:'center',
        width:'100%',
        zIndex:2
    },
    activityIndicator:{
        position:'absolute',
        top:0
    }
})
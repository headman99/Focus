import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const TitleLine = ({ style, title, color, height, titleSize,bold}) => {
    return (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={[{ flex: 1},height?{height:height}:{height:1},color?{backgroundColor:color}:{backgroundColor:'black'}]} />
            <View style={{paddingHorizontal:15}}>
                <Text style={[{  textAlign: 'center' }, titleSize&&{fontSize:titleSize},bold && {fontWeight:'bold'}]}>{title?title:'title'}</Text>
            </View>
            <View style={[{ flex: 1},height?{height:height}:{height:1},color?{backgroundColor:color}:{backgroundColor:'black'}]} />
        </View>
    )
}

export default TitleLine

const styles = StyleSheet.create({

})
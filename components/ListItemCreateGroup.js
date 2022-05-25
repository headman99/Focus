import { StyleSheet, Text, View,TouchableHighlight,Image } from 'react-native'
import React,{useCallback,useState,memo,useRef,useEffect} from 'react'


const ListItemCreateGroup = ({ item, handleSelect }) => {
    
    const handlePress = () => {
        handleSelect(item)
    }

    console.log("ListItemCreateGroup render")
    return (
        <TouchableHighlight
            style={styles.LItouchable}
            onPress={handlePress}
            activeOpacity={1}
            underlayColor='#c5e5f0'
        >
            <View style={styles.LIContainer}>
                <View style={styles.LIimageContainer}>
                    <Image
                        source={{ uri: item.avatar }}
                        style={{ borderRadius: 50, width: 80, height: 80 }}
                    />
                </View>
                <View style={styles.LIdescriptor}>
                    <Text style={styles.LItext}>{item.username}</Text>
                </View>
            </View>
        </TouchableHighlight>
    )
}

export default memo(ListItemCreateGroup)

const styles = StyleSheet.create({
    LIContainer: {
        width: '100%',
        height: '100%',
        flexDirection: 'row',
    },
    LIimageContainer: {
        width: '30%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    LIdescriptor: {
        width: '70%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    LItext: {
        fontSize: 19,
        fontWeight: 'bold'
    },
    LItouchable: {
        height: 100,
    }
})
import { StyleSheet, Text, View,TouchableHighlight,Image } from 'react-native'
import React,{useCallback,useState,memo} from 'react'

const ListItemCreateGroup = ({ item, setSelectedItems }) => {
    const [pressed, setPressed] = useState(false)

    const handlePress = () => {
        console.log(pressed);
        if (!pressed) {
            setSelectedItems((previousState) => [...previousState, item])
        } else {
            setSelectedItems((previousState) => previousState.filter(elem => elem.username !== item.username));
        }

        setPressed(previousState => !previousState);
    }

    return (
        <TouchableHighlight
            style={[styles.LItouchable, pressed && { backgroundColor: '#c5e5f0' }]}
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
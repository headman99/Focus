import { StyleSheet, Text, View, ActivityIndicator,Button } from 'react-native'
import React, { useEffect, useContext } from 'react'
import { theme } from '../utils'
import { userInformationsContext } from '../Stacks/TabNavigator'
import { useNavigation } from '@react-navigation/native'

const Setup = () => {
    const { userInfo, friendsField, notifications, groups } = useContext(userInformationsContext);
    const navigation = useNavigation()
    const [finished, setFinished] = React.useState(false);
    const intervallo = React.useRef(null);

    const scale = (toValue) => {
        Animated.spring(scaling,{
            toValue: toValue,
            useNativeDriver: true,
            duration: 600
        }).start();
    }

    useEffect(() => {
        const interval = setInterval(() => {
            if (userInfo && friendsField.friends.length>0 && notifications.length >0 && groups.length >0) {
                setFinished(true);
            }
        }, 1000)
        intervallo.current = interval
    }, [])

    useEffect(() => {
        if (finished) {
            clearInterval(intervallo.current);
            navigation.navigate("HomeDrawer")
        }
    }, [finished])

    return (
        <View style={styles.container}>
            <View>
                <ActivityIndicator color={theme.inactiveBackgroundColor} size='large' />
            </View>
        </View>
    )
}

export default Setup

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1
    }
})
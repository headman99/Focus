import { TouchableOpacity, View, Text, StyleSheet } from 'react-native'
import React,{memo} from 'react'
import { useNavigation } from '@react-navigation/native'

const Header = ({ HeaderLeft, HeaderContent, HeaderRight }) => {
    const navigation = useNavigation();

    console.log("header")
    return (
        <View style={styles.headerContainer}>
            {HeaderLeft &&
                <View style={styles.headerLeft}>
                    {HeaderLeft}
                </View>
            }
            <View style={styles.headerContent}>
                {HeaderContent ? HeaderContent : null}
            </View>
            {HeaderRight &&
                <View style={styles.headerRight}>
                    {HeaderRight}
                </View>
            }
        </View>
    )
}

export default memo(Header);

const styles = StyleSheet.create({
    headerLeft: {
        flex: 0.2,
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerContainer: {
        width: '100%',
        height: 60,
        flexDirection: 'row',
        backgroundColor: 'white',
        elevation: 50,
    },
    headerContent: {
        flex: 0.6,
        width: '60%',
        height: '100%',
        justifyContent: 'center',
        paddingLeft: 10
    },
    headerRight: {
        flex: 0.2,
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center'
    }
})
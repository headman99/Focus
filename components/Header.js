import { TouchableOpacity, View, Text, StyleSheet } from 'react-native'
import React, { memo } from 'react'

const Header = ({ HeaderLeft, HeaderContent, HeaderRight }) => {

    console.log("header")
    return (
        <View style={styles.container}>
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
        </View>

    )
}

export default memo(Header);

const styles = StyleSheet.create({
    container:{
        width:'100%',
        flexDirection:'column',
        backgroundColor:'white',
        elevation:5,
        paddingVertical:3
    },
    headerLeft: {
        width:'18%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        elevation: 10,
    },
    headerContainer: {
        width: '100%',
        flexDirection: 'row',
        elevation: 5,
        height: 60,
    },
    headerContent: {
        flex: 1,
        width: '60%',
        height: '100%',
        justifyContent: 'center',
        paddingLeft: 10,
        backgroundColor: 'white',
        alignItems: 'center'
    },
    headerRight: {
        width:'18%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        elevation: 10
    }
})
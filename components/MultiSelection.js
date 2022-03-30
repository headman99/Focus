import { StyleSheet, Text, View, Modal, TouchableHighlight, TouchableOpacity } from 'react-native'
import React from 'react'
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'

const MultiSelection = ({ show, setIsLongPressed, visible, OnDelete }) => {
    if (!visible)
        return null

    return (
        <Modal
            animationType='slide'
            transparent={true}
            visible={show}
            onRequestClose={() => {
                setIsLongPressed(false)
            }}
        >
            <View
                style={styles.voidView}
            ></View>
            <View
                style={styles.content}
            >
              
                    <TouchableOpacity
                        style={styles.touchable}
                        onPress={() => {
                            OnDelete()
                        }}
                    >
                        <Text style={[styles.textInTouch, { color: '#a60000' }]}>Delete</Text>
                        <View style={styles.iconContainer}>
                            <FontAwesomeIcon icon={faTrashAlt} size={20} />
                        </View>

                    </TouchableOpacity>
                <View style={styles.delemitator}></View>
                <TouchableOpacity
                    style={styles.touchable}
                    onPress={() => setIsLongPressed(false)}
                >
                    <Text style={styles.textInTouch}>Cancel</Text>
                </TouchableOpacity>
            </View>
        </Modal>
    )
}

export default MultiSelection

const styles = StyleSheet.create({
    voidView: {
        width: '100%',
        height: '80%',
    },
    content: {
        backgroundColor: 'white',
        width: '100%',
        height: '20%',
        borderTopRightRadius: 30,
        borderTopLeftRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column'
    },
    touchable: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        flexDirection: 'row'
    },
    textInTouch: {
        fontSize: 22
    },
    delemitator: {
        width: '80%',
        borderWidth: 0.5,
        borderColor: '#e8e8e8'
    },
    iconContainer: {
        position: 'absolute',
        left: '70%'
    }

})

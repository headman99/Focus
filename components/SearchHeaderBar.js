import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native'
import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faSearch, faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { useNavigation } from '@react-navigation/native'

const SearchHeaderBar = ({ filter, setFilter, title, goBackArrow, handleEndEditing, leftIcon,rightIcon }) => {
    const navigation = useNavigation();
    return (
        <View style={styles.header}>
            {
                goBackArrow && <TouchableOpacity style={styles.arrowContainer}
                    onPress={() => navigation.goBack()}
                >
                    <FontAwesomeIcon icon={faArrowLeft} size={30} />
                </TouchableOpacity>
            }


            {
                title && (
                    <Text style={styles.title}>{title}</Text>
                )
            }
            <View style={styles.content}>
                <View style={styles.barContainer}>
                    <View style={styles.lensIcon}>
                        <FontAwesomeIcon icon={faSearch} size={20} />
                    </View>
                    <TextInput
                        style={styles.textInput}
                        onChangeText={text => setFilter(text)}
                        value={filter}
                        placeholder='Search'
                        onKeyPress={handleEndEditing}
                    />
                </View>
            </View>

        </View>
    )
}

export default SearchHeaderBar

const styles = StyleSheet.create({
    header: {
        width: '100%',
        paddingVertical: '5%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        elevation:5,
        flexDirection: 'column'
    },
    content:{
        width:'100%',
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center'
    },
    barContainer: {
        flex:0.8,
        flexDirection: 'row',
        borderWidth: 1,
        borderRadius: 10,
        overflow: 'hidden',
        alignItems: 'center'
    },
    lensIcon: {
        width: '15%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    textInput: {
        width: '85%',
        height: 50,
        backgroundColor: 'white'
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        padding: 10
    },
    arrowContainer: {
        position: 'absolute',
        left: 0,
        top: 0,
        marginVertical: '5%',
        marginHorizontal: '3%'
    },
    icon:{
        flex:1
    }
})
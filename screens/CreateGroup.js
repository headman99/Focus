import { StyleSheet, Text, View, TextInput, FlatList, Image, TouchableHighlight } from 'react-native'
import React, { useEffect, useLayoutEffect, useState, useContext } from 'react'
import { useNavigation } from '@react-navigation/native'
import { useIsFocused } from '@react-navigation/native'
import { userInformationsContext } from '../Stacks/TabNavigator'
import FriendListItem from '../components/FriendListItem'
import ListItemCreateGroup from '../components/ListItemCreateGroup'

const CreateGroup = () => {

    const [filter, setFilter] = useState('');
    const { userInfo, friendsField } = useContext(userInformationsContext);
    const [selectedItems, setSelectedItems] = useState([]);



    const handleEndEditing = () => {

    }

    return (
        <View style={styles.container}>
            <View style={styles.selectedElement}>
                <FlatList
                    style={{flex:1}}
                    horizontal={true}
                    data={selectedItems}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => (
                        <View style={{height:'100%',width:40,justifyContent:'center',alignItems:'center'}}>
                            <Image
                                source={{ uri: item.avatar }}
                                style={{ borderRadius: 15, height: 30, width: 30 }}
                            />
                        </View>
                    )}
                />
            </View>
            <View style={styles.headerBar}>
                <View style={styles.barContainer}>
                    <TextInput
                        style={styles.textInput}
                        onChangeText={text => setFilter(text)}
                        value={filter}
                        placeholder='Search'
                        onKeyPress={handleEndEditing}
                    />
                </View>
            </View>
            <FlatList
                style={styles.flatlist}
                data={filter ? friendsField.friends?.filter(friend => friend.username.toUpperCase().startsWith(filter.toUpperCase())) : friendsField.friends}
                renderItem={({ item }) => (
                    <ListItemCreateGroup item={item} setSelectedItems={setSelectedItems} />
                )}
                keyExtractor={friend => friend.id}
                ItemSeparatorComponent={() => (
                    <View style={{ width: '100%', borderWidth: 0.5, borderColor: 'lightgrey' }}></View>
                )}

            />
        </View>
    )
}

export default CreateGroup

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',

    },
    selectedElement: {
        width: '100%',
        height: 50,
        paddingHorizontal:5
    },
    headerBar: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15
    },
    barContainer: {
        width: '80%',
        borderWidth: 1,
        borderRadius: 10,
        overflow: 'hidden',
        height: 50,
        paddingLeft: 10,
    },
    textInput: {
        width: '85%',
        height: '100%'
    },

})
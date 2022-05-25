import { StyleSheet, Text, View, TextInput, FlatList, Image, TouchableHighlight, TouchableOpacity } from 'react-native'
import React, { useEffect, useLayoutEffect, useState, useContext } from 'react'
import { useNavigation } from '@react-navigation/native'
import { useIsFocused } from '@react-navigation/native'
import { userInformationsContext } from '../Stacks/TabNavigator'
import FriendListItem from '../components/FriendListItem'
import ListItemCreateGroup from '../components/ListItemCreateGroup'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faArrowRight, faArrowLeft, faArrowRightRotate, faX, faXmark } from '@fortawesome/free-solid-svg-icons'


const CreateGroup = () => {

    const [filter, setFilter] = useState('');
    const { userInfo, friendsField } = useContext(userInformationsContext);
    const [friends, setFriends] = useState(friendsField.friends.sort(compare))
    const [selectedItems, setSelectedItems] = useState([]);
    const navigation = useNavigation();
    const [filteredItems, setFilteredItems] = useState([]);

    function compare(a, b) {
        if (a.username < b.username) {
            return -1;
        }
        if (a.username > b.username) {
            return 1;
        }
        return 0;
    }


    const handleSelect = React.useCallback((item) => {
        setFriends(previousState => previousState.filter(element => element.id !== item.id))
        setSelectedItems(previousState => [...previousState, item].sort(compare));
    }, [])

    const handleUnselect = React.useCallback((item) => {
        setFriends(previousState => [...previousState, item].sort(compare))
        setSelectedItems(previousState => previousState.filter(element => element.id !== item.id));
    }, [])



    useEffect(() => {
        setFilteredItems(filter ? friends?.filter(friend => friend.username.toUpperCase().startsWith(filter.toUpperCase())) : friends)
    }, [filter, friends])

    const renderItem = ({ item }) => (
        <ListItemCreateGroup item={item} handleSelect={handleSelect} />
    )

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={{ margin: 10 }}
                    onPress={() => {
                        navigation.goBack()
                    }}
                >
                    <FontAwesomeIcon icon={faArrowLeft} size={28} />
                </TouchableOpacity>
                <View style={styles.selectedElement}>
                    <FlatList
                        style={{ flex: 1 }}
                        horizontal={true}
                        data={selectedItems}
                        keyExtractor={item => item.idDoc}
                        renderItem={({ item }) => (
                            <View style={{height:'100%',justifyContent:'center'}}>
                                <View style={{ height: '70%', backgroundColor: 'lightgrey', alignItems: 'center', justifyContent: 'space-around', borderRadius: 15, paddingHorizontal: 5, flexDirection: 'row', marginHorizontal: 10 }}>
                                    <Text>{item.username}</Text>
                                    <TouchableOpacity
                                        style={{ marginLeft: 10, }}
                                        onPress={() => {
                                            handleUnselect(item)
                                        }}
                                    >
                                        <FontAwesomeIcon icon={faXmark} size={15} />
                                    </TouchableOpacity>
                                </View>
                            </View>

                        )}

                    />
                </View>
            </View>
            <View style={styles.headerBar}>
                <View style={styles.barContainer}>
                    <TextInput
                        style={styles.textInput}
                        onChangeText={text => setFilter(text)}
                        value={filter}
                        placeholder='Search'
                    />
                </View>
            </View>
            <FlatList
                style={styles.flatlist}
                data={filteredItems}
                renderItem={renderItem}
                keyExtractor={friend => friend.username}
                ItemSeparatorComponent={() => (
                    <View style={{ width: '100%', borderWidth: 0.5, borderColor: 'lightgrey' }}></View>
                )}

            />
            <TouchableOpacity
                disabled={selectedItems.length <= 0}
                style={[styles.goAhead, selectedItems.length > 0 ? { backgroundColor: 'green', opacity: 1 } : { backgroundColor: 'lightgrey', opacity: 0.8 }]}
                onPress={() => {
                    navigation.navigate("SessionInfo",{
                        selectedItems: selectedItems
                    });
                }}
            >
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', borderRadius: 50, margin: 5, borderWidth: 1, borderColor: 'white' }}>
                    <FontAwesomeIcon icon={faArrowRight} size={25} />
                </View>
            </TouchableOpacity>
        </View>
    )
}

export default CreateGroup

const styles = StyleSheet.create({
    header: {
        width: '100%',
        alignItems: 'center',
        flexDirection: 'row',
        marginVertical:5,
    },
    container: {
        flex: 1,
        flexDirection: 'column',

    },
    selectedElement: {
        flex: 1,
        height: 50,
        justifyContent: 'center',
        paddingHorizontal: 5,
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
    goAhead: {
        position: 'absolute',
        width: 70,
        height: 70,
        borderRadius: 50,
        bottom: 40,
        right: 20,
        elevation: 10,
        opacity: 1
    }

})
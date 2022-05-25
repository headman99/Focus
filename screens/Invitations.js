import { StyleSheet, Text, View, Button, FlatList, Modal, TouchableOpacity, ScrollView, Image } from 'react-native'
import React, { useContext, useState, useEffect } from 'react'
import { userInformationsContext } from '../Stacks/TabNavigator'
import InvitationListItem from '../components/InvitationListItem'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import TitleLine from '../components/TitleLine'
import { useFocusEffect } from '@react-navigation/native'
import { getDocs,query,collection,updateDoc,where,doc } from 'firebase/firestore'
import { database } from '../firebas'

const Invitations = () => {

  const invitations = useContext(userInformationsContext).notifications.invitations
  const { friendsField,userInfo } = useContext(userInformationsContext);
  const [selectedItem, setSelectedItem] = useState(null)
  const [modalVisible, setModalVisible] = useState(false)

  useEffect(() => {
    if (selectedItem) {
      setModalVisible(true)
    }
  }, [selectedItem])

  const setReadFlag = async() =>{
    try {
        const q = query(collection(database, 'notifications', userInfo.idDoc, 'invitations'), where("read", '==', false));
        const querySnap = await getDocs(q);
        querySnap.forEach(async (d) => {
            await updateDoc(doc(database, 'notifications', userInfo.idDoc, 'invitations', d.id), {
                read: true
            })
        });
    } catch (err) {
        alert(err.message)
    }
}
//to set the "read" field of notifications at true when the page is focused
useFocusEffect(
    React.useCallback(()=>{
        setReadFlag()
    },[])
)

  return (
    <View style={styles.container}>
      <View style={[styles.content, modalVisible && { opacity: 0.4, backgroundColor: 'grey' }]}>
        <FlatList
          style={styles.flat}
          data={invitations}
          renderItem={({ item }) => (
            <InvitationListItem item={item} setSelectedItem={setSelectedItem} />
          )}
        />
      </View>
      {
        selectedItem &&
        <Modal
          transparent={true}
          animationType='fade'
          visible={modalVisible}
          onRequestClose={() => setSelectedItem(null)}
        >
          <View
            style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}
          >
            <View style={styles.containerModal}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>{selectedItem?.groupInfo?.title}</Text>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => setModalVisible(false)}
                >
                  <FontAwesomeIcon icon={faXmark} size={20} color='grey' />
                </TouchableOpacity>

              </View>
              <ScrollView
                contentContainerStyle={{ flex: 1 }}
              >
                {
                  selectedItem?.groupInfo?.description &&
                  <View style={styles.description}>
                    <Text>{selectedItem?.groupInfo?.description}</Text>
                  </View>
                }
                <TitleLine color={'lightgrey'} height={1} bold titleSize={15} title='members' />
                <View style={styles.friends}>
                  {
                    selectedItem?.members ? selectedItem?.members.map((item, index) => (
                      <View style={styles.friendItem} key={index}>
                        <Image source={{ uri: item.avatar }} style={{ width: 50, height: 50, borderRadius: 50 }} />
                        <Text style={{ fontSize: 15, marginLeft: 20 }}>{item.username}</Text>
                        {
                          friendsField.friends.map(item => item.username).includes(item.username) &&
                          <View style={{ padding: 5, borderWidth: 1, borderColor: 'lightgrey',position:'absolute',right:0 }}>
                            <Text style={{fontSize:11,color:'grey'}}>friends already </Text>
                          </View>
                        }
                      </View>
                    )) : <Text>Non ci sono membri</Text>
                  }
                  
                  {/*
                  <TitleLine color={'lightgrey'} height={1} bold titleSize={15} title='invited' />
                    selectedItem?.invited ? selectedItem?.invited.map((item, index) => (
                      <View style={styles.friendItem} key={index}>
                        <Image source={{ uri: item.avatar }} style={{ width: 50, height: 50, borderRadius: 50 }} />
                        <Text style={{ fontSize: 15, marginLeft: 20 }}>{item.username}</Text>
                        {
                          friendsField.friends.map(item => item.username).includes(item.username) &&
                          <View style={{ padding: 5, borderWidth: 1, borderColor: 'lightgrey' }}>
                            <Text>friends already </Text>
                          </View>
                        }

                      </View>
                    )) : <Text>Non ci sono invitati</Text>
                      */}
                </View>
              </ScrollView>
              <View style={styles.modalFooter}>
                <Text>{new Date(selectedItem?.groupInfo?.createdAt?.seconds * 1000).toLocaleDateString()}</Text>
              </View>
            </View>
          </View>
        </Modal>
      }

    </View>
  )
}

export default Invitations

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  content: {
    flex: 1
  },
  flat: {

  },
  containerModal: {
    width: '90%',
    height: '60%',
    borderRadius: 20,
    backgroundColor: 'white',
    elevation: 5,
    overflow: 'hidden',
    zIndex: 2
  },
  backgroundModal: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    zIndex: 1,

  },
  modalHeader: {
    height: '12%',
    borderBottomWidth: 1,
    borderColor: 'lightgrey',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    flexDirection: 'row'
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  description: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    //borderBottomWidth: 1,
    borderColor: 'lightgrey'
  },
  modalFooter: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    width: '100%',
    justifyContent: 'flex-end',
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: 'lightgrey'
  },
  friends: {
    paddingVertical: 10,
    paddingHorizontal: 15
  },
  friendItem: {
    width: '100%',
    height: 70,
    flexDirection: 'row',
    alignItems: 'center'
  }
})
import { StyleSheet, Text, View, TouchableHighlight, useWindowDimensions, Animated, Alert, ActivityIndicator, TouchableOpacity } from 'react-native'
import React, { useEffect, useState, useContext } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faAngleRight, faCheck, faXmark, faL, faAngleDown } from '@fortawesome/free-solid-svg-icons'
import { useIsFocused } from '@react-navigation/native'
import { arrayRemove, arrayUnion, collection, deleteDoc, doc, getDoc, getDocs, query, runTransaction, setDoc, Timestamp, Transaction, updateDoc } from 'firebase/firestore'
import { database } from '../firebas'
import { userInformationsContext } from '../Stacks/TabNavigator'
import Toast from 'react-native-toast-message'



const InvitationListItem = ({ item, setSelectedItem }) => { //item
  const [sliding, setSliding] = React.useState(new Animated.Value(0))
  const [rotating, setRotating] = React.useState(new Animated.Value(0))
  const windowWidth = useWindowDimensions().width
  const windowHeight = useWindowDimensions().height
  const isFocused = useIsFocused();
  const [loading, setLoading] = useState(false);
  const { friendsField, userInfo } = useContext(userInformationsContext);
  const [choose, setChoose] = useState(false); //detect if the panel with the option to deny or accept is open or not


  const slide = (toValue) => {
    Animated.spring(sliding, {
      toValue: toValue,
      useNativeDriver: true,
      duration: 500,
    }).start()
  }

  const rotate = (toValue) => {
    Animated.spring(rotating, {
      toValue: toValue,
      duration: 200,
      useNativeDriver: true
    }).start()
  }

  const rotation = rotating.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  })


  const handleChoose = () => {
    if (!choose) {
      Animated.parallel([slide(-150), rotate(0.5)]);
      setChoose(true)
    } else {
      Animated.parallel([slide(0), rotate(0)]);
      setChoose(false)
    }
  }

  const handleAccept = async () => {
    console.log(item)
    try {
      await runTransaction(database, async (transaction) => {
        const groupDocRef = doc(database, 'groups',item.group)

        const getGroup = await transaction.get(groupDocRef);
        if (!getGroup.exists()) {
          throw "gruppo inseistente"
        }

        const joined = Timestamp.now();

        transaction.set(doc(database,'groups',item.group, 'members', userInfo.idDoc), {
          member: userInfo.idDoc,
          joined: joined,
        })

        transaction.set(doc(database, 'users', userInfo.idDoc, 'groups', item.group), {
          group: item.group,
          joined: joined,
        })

        transaction.delete(doc(database,'groups',item.group, 'invited', userInfo.idDoc));

        transaction.delete(doc(database, 'notifications', userInfo.idDoc, 'invitations', item.group))
      });
      Toast.show({
        type: 'success',
        text1: 'Invitation ACCEPTED',
        text2: 'You accepted the invitation',
        position: 'bottom',
        visibilityTime: 2000
    })

    } catch (error) {
      console.log(error.message);
      Alert(error.message)
    }
  }

  const handleDeny = async () => {
    try {
      await runTransaction(database, async (trans) => {
        const groupDocRef = doc(database, 'groups',item.group)
        const getGroup = await trans.get(groupDocRef);
        if (!getGroup.exists()) {
          throw "gruppo inseistente"
        }
        trans.delete(doc(database, 'groups',item.group.toString(), 'invited', userInfo.idDoc));

        trans.delete(doc(database, 'notifications', userInfo.idDoc, 'invitations', item.idDoc))
      })

    } catch (error) {
      console.log(error.message);
      Alert(error.message)
    }
  }

  const retrieveFriends = async (array) => {
    console.log(array)

    const members = array.map(async (idDoc) => {
      const friend = await getDoc(doc(database, 'users', idDoc.toString()));
      return friend.data();
    })

    return (await Promise.all(members))
  }

  const loadInvitationInformations = async () => {
    try {
      const groupInfo = await getDoc(doc(database, 'groups',item?.group));

      const memberIds = (await getDocs(query(collection(database,'groups',item.group,'members')))).docs.map(item => item.id);
      const invitedIds = (await getDocs(query(collection(database,'groups',item.group,'invited')))).docs.map(item => item.id);

      const members = await retrieveFriends(memberIds)
      const invited = await retrieveFriends(invitedIds)


      return {
        members: members,
        invited: invited,
        groupInfo: groupInfo.data()
      }
    } catch (error) {
      console.log("errore qui")
      throw error.message
    } finally {
      setLoading(false)
    }
  }

  const handlePress = () => {
    setLoading(true);
    loadInvitationInformations().then((info) => {
      setSelectedItem(info)
    }).catch(error => {
      Alert.alert(error)
    }).finally(() => {
      setLoading(false)
    })

  }

  useEffect(() => {
    if (!isFocused) {
      setSliding(new Animated.Value(0));
      setRotating(new Animated.Value(0));
    }
  }, [isFocused])

  return (
    <View style={styles.mainContainer}>
      <View style={[{ flexDirection: 'row' }]}>
        <Animated.View style={{ transform: [{ translateX: sliding }] }}>
          {
            loading && <ActivityIndicator style={styles.spinner} size='large' color={'blue'} />
          }
          <View style={[styles.container1, { width: windowWidth }, loading && { backgroundColor: 'grey', opacity: 0.3 }]}>
            <View style={styles.content}>
              <TouchableHighlight style={styles.contentLeft}
                underlayColor='white'
                activeOpacity={0.8}
                onPress={() => handlePress()}
              >
                <View style={{ flex: 1, justifyContent: 'center' }}>
                  <Text style={styles.textContent}>invitation by <Text style={styles.username}>{item.creator.username}</Text></Text>
                  <Text style={styles.date}>{new Date(item.createdAt.seconds * 1000).toLocaleDateString()}</Text>
                  <FontAwesomeIcon style={{ position: 'absolute', bottom: 0, right: '50%' }} icon={faAngleDown} size={20} color='black' />
                </View>
              </TouchableHighlight>
              <TouchableHighlight style={styles.contentRight}
                activeOpacity={0.8}
                underlayColor='lightgrey'
                onPress={() => handleChoose()}
              >
                <Animated.View style={{ transform: [{ rotate: rotation }] }}>
                  <FontAwesomeIcon style={styles.rightArrow} size={25} icon={faAngleRight} />
                </Animated.View>
              </TouchableHighlight>
            </View>

          </View>
        </Animated.View>
        <Animated.View style={[styles.accept, { transform: [{ translateX: sliding }] }]}>
          <TouchableOpacity style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'green' }}
            activeOpacity={0.8}
            onPress={() => handleAccept()}
          >
            <FontAwesomeIcon icon={faCheck} size={30} color={'white'} />
          </TouchableOpacity>
        </Animated.View>
        <Animated.View style={[styles.deny, { transform: [{ translateX: sliding }] }]}>
          <TouchableOpacity style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingRight: 25, backgroundColor: 'red' }}
            activeOpacity={0.8}
            onPress={() => handleDeny()}
          >
            <FontAwesomeIcon icon={faXmark} size={30} color={'white'} />
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>

  )
}

export default React.memo(InvitationListItem)

const styles = StyleSheet.create({
  left: {
    width: '80%',
    height: '100%'
  },
  right: {
    width: '20%',
    height: '100%',
  },
  mainContainer: {
    flexDirection: 'column',
    flex: 1,
  },
  container2: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    flexDirection: 'row',
  },
  container1: {
    height: 80,
    flexDirection: 'row',
    backgroundColor: 'white'
  },
  rightArrow: {

  },
  content: {
    flex: 1,
    flexDirection: 'row'
  },
  contentLeft: {
    width: '90%',
    justifyContent: 'center',
    paddingHorizontal: 10,

  },
  contentRight: {
    width: '10%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e8e8e8'
  },
  textContent: {
    fontSize: 20,
    fontStyle: 'italic'
  },
  date: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    fontStyle: 'italic',
    color: 'grey'
  },
  username: {
    fontWeight: 'bold'
  },
  spinner: {
    position: 'absolute',
    width: '100%',
    height: '100%'
  },
  titleContainer: {
    width: '100%',
    alignItems: 'center'
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18
  },
  accept: {
    width: 75,

  },
  deny: {
    width: 100,
  },
})
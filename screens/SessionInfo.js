import { StyleSheet, Text, View, TouchableOpacity,Alert } from 'react-native'
import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons'
import { TextInput } from 'react-native-paper'
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import {writeBatch,Timestamp,doc} from 'firebase/firestore'
import {database} from '../../loginPageSample/firebas'
import { userInformationsContext } from '../Stacks/TabNavigator'
import uuid from 'react-native-uuid'
import { confirmPasswordReset } from 'firebase/auth'
import Toast from 'react-native-toast-message'

const SessionInfo = ({ navigation,route }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const {userInfo} = React.useContext(userInformationsContext)

  const createSession = () =>{
    if(!title){
      Alert.alert("Title cannot be empty")
      return
    }
    const selectedItems = route?.params?.selectedItems;
    try{
      const batch = writeBatch(database);
      const causualId = uuid.v4();
      const timestamp= Timestamp.now()
      //create the group
      batch.set(doc(database,'groups',causualId),{
        title:title,
        description:description,
        createdAt: timestamp,
        admins:[userInfo.idDoc],
        creator:{
          idDoc:userInfo.idDoc,
          username:userInfo.data.username
        },
      });

      //fill the group with members
      batch.set(doc(database,'groups',causualId,'members',userInfo.idDoc),{
        member: userInfo.idDoc,
        joined: timestamp,
        admin: true
      })
      
      //add groupInfo into the user
      batch.set(doc(database,'users',userInfo.idDoc,'groups',causualId),{
        group:causualId,
        joined: timestamp
      })

      //send invitations
      selectedItems.forEach(item =>{
        batch.set(doc(database,'groups',causualId,'invited',item.idDoc),{
          user: item.idDoc,
          invited:timestamp
        })

        batch.set(doc(database,'notifications',item.idDoc,'invitations',causualId),{
          createdAt: timestamp,
          group: causualId,
          creator: {
            username:userInfo.data.username,
            idDoc:userInfo.idDoc
          },
          read:false,
          id: uuid.v4()
        })
      });

      batch.commit();

    }catch(error){
      console.log(error.message)
      Alert.alert("Something went wrong")
    }finally{
      Toast.show({
        type: 'success',
        text1: 'GROUP CREATED',
        text2: 'The grp has been succesfully created',
        position: 'bottom',
        visibilityTime: 2000
    })
      navigation.navigate("Home ")
    }
  }

  const changeDescription = (text) => {
    if (text.includes('\n')) {
      setDescription(text.replace('\n', ''))
    } else {
      setDescription(text)
    }
  }

  const theme = {
    ...DefaultTheme,
    roundness: 2,
    colors: {
      ...DefaultTheme.colors,
      primary: '#3498db',
      accent: '#f1c40f',
    },
  };
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.arrowLeft}
          onPress={() => {
            navigation.goBack()
          }}
        >
          <FontAwesomeIcon icon={faArrowLeft} size={28} />
        </TouchableOpacity>
      </View>
      <View style={styles.content}>
        <View style={styles.titleInputContainer}>
          <TextInput
            style={styles.titleInput}
            onChangeText={setTitle}
            label='title'
            value={title}
            mode='flat'
            theme={theme}
            maxLength={50}
          />
        </View>
        <View style={styles.description}>
          <TextInput
            style={styles.descriptionInput}
            onChangeText={(text) => changeDescription(text)}
            label='description'
            value={description}
            mode='flat'
            multiline={true}
            maxLength={120}
            numberOfLines={3}
            dense={true}
            theme={theme}
          />
          <View style={styles.counterContainer}>
            <Text style={styles.counter}>{description?.length}/120</Text>
          </View>
        </View>
      </View>
      <TouchableOpacity
        disabled={title.length <= 0}
        style={[styles.goAhead, title?.length > 0 ? { backgroundColor: 'green', opacity: 1 } : { backgroundColor: 'lightgrey', opacity: 0.8 }]}
        onPress={() => {
          createSession()
        }}
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', borderRadius: 50, margin: 5, borderWidth: 1, borderColor: 'white' }}>
          <FontAwesomeIcon icon={faArrowRight} size={25} />
        </View>
      </TouchableOpacity>
    </View>
  )
}

export default SessionInfo

const styles = StyleSheet.create({
  header: {
    width: '100%',
  },
  container: {
flex:1
  },
  arrowLeft: {
    margin: 10
  },
  content: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  titleInput: {
    fontSize: 18,
    backgroundColor: 'white',
  },
  description: {
    width: '100%',
    marginVertical: 20,
    paddingHorizontal: 20
  },
  titleInputContainer: {
    width: '70%',
    borderColor: 'grey',
    marginVertical: 20,
    overflow: 'hidden'
  },
  descriptionInput: {
    backgroundColor: 'white',
  },
  counterContainer: {
    width: '100%',
    flexDirection: 'row-reverse'
  },
  counter: {
    fontSize: 13
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
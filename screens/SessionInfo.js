import { StyleSheet, Text, View, TouchableOpacity, Alert, PlatformColor, Platform, Image,KeyboardAvoidingView,ScrollView,useWindowDimensions, Button } from 'react-native'
import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faArrowLeft, faArrowRight, faLaptopHouse, faPlus, faPlusCircle } from '@fortawesome/free-solid-svg-icons'
import { TextInput } from 'react-native-paper'
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import { writeBatch, Timestamp, doc } from 'firebase/firestore'
import { database } from '../../loginPageSample/firebas'
import { userInformationsContext } from '../Stacks/TabNavigator'
import uuid from 'react-native-uuid'
import { confirmPasswordReset } from 'firebase/auth'
import Toast from 'react-native-toast-message'
import * as ImagePicker from 'expo-image-picker'
import * as Storage from 'firebase/storage'

const SessionInfo = ({ navigation, route }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const { userInfo } = React.useContext(userInformationsContext);
  const [permission, setPermission] = useState(false);
  const [imageUri,setImageUri]=useState('');
  const {width,height} = useWindowDimensions()

  const createSession = async () => {
    if (!title) {
      Alert.alert("Title cannot be empty")
      return
    }
    const selectedItems = route?.params?.selectedItems;
    try {
      const batch = writeBatch(database);
      const causualId = uuid.v4();
      const timestamp = Timestamp.now()
      //create the group
      batch.set(doc(database, 'groups', causualId), {
        title: title,
        description: description,
        createdAt: timestamp,
        admins: [userInfo.idDoc],
        creator: {
          idDoc: userInfo.idDoc,
          username: userInfo.data.username
        },
      });

      //fill the group with members
      batch.set(doc(database, 'groups', causualId, 'members', userInfo.idDoc), {
        member: userInfo.idDoc,
        joined: timestamp,
        admin: true
      })

      //add groupInfo into the user
      batch.set(doc(database, 'users', userInfo.idDoc, 'groups', causualId), {
        group: causualId,
        joined: timestamp
      })

      //send invitations
      selectedItems.forEach(item => {
        batch.set(doc(database, 'groups', causualId, 'invited', item.idDoc), {
          user: item.idDoc,
          invited: timestamp
        })

        batch.set(doc(database, 'notifications', item.idDoc, 'invitations', causualId), {
          createdAt: timestamp,
          group: causualId,
          creator: {
            username: userInfo.data.username,
            idDoc: userInfo.idDoc
          },
          read: false,
          id: uuid.v4()
        })
      });
      
      if(imageUri){
        const storage = Storage.getStorage();
        const ref = Storage.ref(storage,'groups/image.jpg');
        const img = await fetch(imageUri);
        const bytes = await img.blob();
        await Storage.uploadBytes(ref, bytes);
      }

      batch.commit();

      Toast.show({
        type: 'success',
        text1: 'GROUP CREATED',
        text2: 'The group has been succesfully created',
        position: 'bottom',
        visibilityTime: 2000
      })

       navigation.navigate("Home")

    } catch (error) {
      console.log(error.message)
      Alert.alert("Something went wrong")
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

  const requestPermission = async () => {
    if (!permission) {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          setPermission('false');
          Alert.alert("We need access to media to make this work")
          return false
        } else {
          setPermission('true')
        }
      }
    }

    return true;
  }

  const pickImage = async () => {
    const perm = await requestPermission();
    if (perm) {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4,4],
        quality: 1
      });

      if (result != 'cancelled') {
        setImageUri(result?.uri)
      }
    }
  }

  return (
    <ScrollView style={[styles.container]}>
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
        <View style={styles.imagePickerContainer}>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => pickImage()}
            style={styles.picker}
          >
            {
              imageUri? <Image source={{uri:imageUri}} style={{position:'absolute',width:'100%',height:undefined,aspectRatio:4/4}} />:<FontAwesomeIcon icon={faPlusCircle} size={40} color={'grey'}/>
            }
           
            {/*<View style={styles.plusSign}>
              <FontAwesomeIcon icon={faPlus} size={25} color='grey' />
        </View>*/}
          </TouchableOpacity>
        </View>
        <KeyboardAvoidingView style={styles.titleInputContainer}>
          <TextInput
            style={styles.titleInput}
            onChangeText={setTitle}
            label='title'
            value={title}
            mode='flat'
            theme={theme}
            maxLength={50}
          />
        </KeyboardAvoidingView>
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
      <View style={{width:'100%',flexDirection:'row-reverse',paddingVertical:20,alignItems:'center'}}>
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
    </ScrollView>
  )
}

export default SessionInfo

const styles = StyleSheet.create({
  header: {
    width: '100%',
  },
  container: {
    flex:1,
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
    marginTop: 20,
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
    flexDirection: 'row-reverse',
  },
  counter: {
    fontSize: 13
  },
  goAhead: {
    width: 70,
    height: 70,
    borderRadius: 50,
    elevation: 10,
    opacity: 1,
    marginRight:20
  },
  imagePickerContainer: {
    width: '100%',
    height: 250,
    justifyContent: 'center',
    alignItems: 'center'
  },
  picker: {
    width: '70%',
    height: '100%',
    borderRadius: 15,
    elevation: 5,
    backgroundColor: 'white',
    borderColor: 'lightgrey',
    justifyContent: 'center',
    alignItems: 'center',
    overflow:'hidden'
  },
  plusSign: {
    width: 65,
    height: 65,
    borderWidth: 3,
    borderRadius: 50,
    borderColor: 'grey',
    justifyContent: 'center',
    alignItems: 'center'
  },
  plus: {
    fontSize: 30,
    color: 'lightgrey',
    overflow:'hidden'
  }
})
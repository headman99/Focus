import { StyleSheet, Text, View, FlatList, Button, TouchableHighlight, Modal, TouchableOpacity, ScrollView } from 'react-native'
import React, { useEffect, useContext, useState,useCallback } from 'react'
import { userInformationsContext } from '../Stacks/TabNavigator';
import { onSnapshot, collection, limit, orderBy, doc,deleteDoc,query, where } from 'firebase/firestore';
import { auth, database } from '../firebas';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faAngleRight, faArrowRight, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import MultiSelection from '../components/MultiSelection';


const Riepilogo = () => {
  const [sessions, setSessions] = useState([]);
  const { userInfo } = useContext(userInformationsContext);
  const [openModal, setOpenModal] = useState(false)
  const [modalItem, setmodalItem] = useState(null)


  function FlatListElement({ item,multiSelectionVisible}) {
    const [isLongPressed,setIsLongPressed] = useState(false);

    const handleDelete = (item)=>{
      try{
        deleteDoc(doc(database,'sessions',userInfo.idDoc,'soloMode',item.id));
      }catch(error){
        console.log(error.message)
      }
    }

    const  memoizedCahngePressed = useCallback((state)=>{
      setIsLongPressed(state)
    },[isLongPressed])

    return (
      <TouchableHighlight style={[{
        width: '100%',
        height: 150,
      },isLongPressed && {
        backgroundColor:'lightblue',
        opacity:0.6
      }]}
        underlayColor='white'
        activeOpacity={0.6}
        onPress={() => {
          setmodalItem(item);
          setOpenModal(true)
        }}
        onLongPress={()=>{
          console.log("longPressed")
          setIsLongPressed(true)
        }}
      >
        <View style={styles.flatItemContainer}>
          <MultiSelection 
            show={isLongPressed}
            setIsLongPressed={memoizedCahngePressed}
            visible={true}
            //OnDelete={()=>handleDelete(item)}
          />
          <FontAwesomeIcon style={styles.iconAngle} icon={faAngleRight} size={25} />
          <View style={{ width: '100%', alignItems: 'center', flexDirection: 'row', justifyContent: 'center' }}>
            <Text style={styles.localeTimeText}>{new Date(item.startTime.seconds * 1000).toLocaleTimeString()}</Text>
            <FontAwesomeIcon icon={faArrowRight} size={20} />
            <Text style={styles.localeTimeText}>{new Date(item.endTime.seconds * 1000).toLocaleTimeString()}</Text>
          </View>
          <View style={{ width: '100%', alignItems: 'center' }}>
            <Text style={{ fontWeight: 'bold', color: 'green', fontSize: 26, marginTop: 30 }}>{item.duration}</Text>
          </View>
          <Text style={styles.text}>{new Date(item.startTime.seconds * 1000).toDateString()}</Text>
        </View>
      </TouchableHighlight>
    )
  }

  const saveSessions = async (user) => {
    const q = query(collection(database, 'sessions', user?.idDoc, 'soloMode'), limit(20), orderBy('startTime', 'desc'));
    onSnapshot(q, snap => {
      setSessions(snap.docs.map(document => document.data()))
    });
  }

  //set all the listeners
  useEffect(async () => {
    if (userInfo) {
      await saveSessions(userInfo);
    }
    return () => { }
  }, []);

  return (
    <View style={styles.container}>
      <Modal
        animationType='slide'
        transparent={false}
        visible={openModal}
        onRequestClose={() => {
          setmodalItem(null);
          setOpenModal(false);
        }}
      >
        <ScrollView style={styles.modalContainer}>
          <View style={styles.headerModalBar}>
            {modalItem?.title && <View style={styles.modalTitleContainer}><Text style={styles.label}></Text></View>}
            <TouchableOpacity style={styles.ArrowModalButton}
              onPress={() => {
                setmodalItem(false)
                setOpenModal(false)
              }}
            >
              <FontAwesomeIcon icon={faArrowLeft} size={30} />
            </TouchableOpacity>
          </View>
          {
            modalItem &&
            <View style={styles.content}>
              <Text style={styles.label}>START:  <Text style={styles.detailText}>{new Date(modalItem.startTime.seconds * 1000).toLocaleString()}</Text></Text>
              <Text style={styles.label}>END:   <Text style={styles.detailText}>{new Date(modalItem.endTime.seconds * 1000).toLocaleString()}</Text></Text>
              <Text style={styles.label}>DURATION:   <Text style={[styles.detailText, { color: 'green', fontWeight: 'bold' }]}>{modalItem.duration}</Text></Text>
              <Text style={styles.label}>MODE:   <Text style={styles.detailText}>{modalItem.type}</Text></Text>
              {modalItem?.type === 'group' && <Text style={styles.label}>ROOM   <Text style={styles.detailText}>{ }</Text></Text>}
              {modalItem?.pauses &&
                <View style={{ width: '100%', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                  <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center', borderTopWidth: 0.5, borderColor: '#c4c4c4' }}>
                    <Text style={styles.label}>PAUSES</Text>
                  </View>
                  {modalItem.pauses.map((item, index) => (
                    <View key={index} style={{ width: '100%', flexDirection: 'row', alignItems: 'center', marginVertical: 20 }}>
                      <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center' }}>
                        <Text style={styles.detailText}>{item.startTime}</Text>
                        <Text style={styles.detailText}>{item.endTime}</Text>
                      </View>
                      <View style={{ flex: 1, alignItems: 'center' }}>
                        <Text style={[styles.detailText, { fontWeight: 'bold', color: 'red' }]}>{item.duration}</Text>
                      </View>
                    </View>
                  ))}
                </View>
              }
              {modalItem?.goals &&
                <View></View>
              }
            </View>
          }
        </ScrollView>
      </Modal>
      <View style={styles.filterSpace}></View>
      <View style={styles.flatContainer}>
        <FlatList
          style={styles.flatlist}
          data={sessions}
          keyExtractor={session => session.id}
          renderItem={({ item }) => <FlatListElement item={item} />}
        />
      </View>

    </View>
  )
}

export default Riepilogo

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  flatlist: {
    flex: 1,
  },
  flatItemContainer: {
    flex: 1,
    flexDirection: 'column',
    borderBottomWidth: 1,
    paddingLeft: 10,
    paddingTop: 20,
  },
  text: {
    fontSize: 16,
    position: 'absolute',
    bottom: 0,
    left: 10,
    fontWeight: 'bold',
    fontStyle: 'italic'
  },
  localeTimeText: {
    fontSize: 18,
    marginHorizontal: 10
  },
  iconAngle: {
    position: 'absolute',
    right: 0,
    top: '50%'
  },
  modalContainer: {
    flex: 1,
    flexDirection: 'column'
  },
  headerModalBar: {
    width: '100%',
    flexDirection: 'row'
  },
  ArrowModalButton: {
    marginLeft: 10,
    marginTop: 10
  },
  content: {
    flex: 1,
    width: '100%',
    padding: 20,

  },
  label: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 20
  },
  detailText: {
    fontSize: 20,
    fontWeight: 'normal',
    fontStyle: 'italic',
  },
  modalTitleContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  flatContainer:{
    width:'100%',
    height:'95%',
  }
})
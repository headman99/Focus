import React, { useState, useRef, useCallback, useEffect, useContext } from "react";
import {
  StyleSheet,
  SafeAreaView,
  Text,
  View,
  Platform,
  StatusBar,
  Modal,
  TextInput,
  TouchableOpacity,
  Pressable,
  BackHandler,
  Alert,
  AppState,
  FlatList,
  Switch,
  NativeModules
} from "react-native";
import Constants, { UserInterfaceIdiom } from "expo-constants";
import Control from "./Control";
import { displayTime, secondConverterTime, padToTwo } from "./utils";
import { useIsFocused, useNavigation, useRoute } from "@react-navigation/native";
import Riepilogo from "../Riepilogo";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { collection, addDoc, arrayRemove, Timestamp, setDoc, doc } from "firebase/firestore";
import { database } from "../../firebas";
import { userInformationsContext } from "../../Stacks/TabNavigator";
import { useFocusEffect } from "@react-navigation/native";







const StopWatch = () => {
  //salva lo state del tempo quando esco dall'applicazione
  //const backHandlerListener = useRef(null);
  const appStateListener = useRef(null);
  const [time, setTime] = useState(0);
  const [isRunning, setRunning] = useState(false);
  const [pauses, setPauses] = useState([])
  const startTime = useRef(null)
  const timer = useRef(null);
  const isFocused = useIsFocused();
  const [modalVisibleConfirm, setModalVisibleConfirm] = useState(false);
  const [modalVisibleEndTimer, setModalVisibleEndTimer] = useState(false);
  const [title, setTitle] = useState('')
  const navigation = useNavigation();
  const { userInfo } = useContext(userInformationsContext);
  const appState = useRef(AppState.currentState);
  const pause = useRef(null)
  //to define actions when the user quit the app
  const exitFromAppTimeout = useRef(false);
  const exitTimeout = useRef(null)

  const homeAction = (nextAppState) => {
    if (appState.current.match(/active/) && nextAppState === 'inactive' || nextAppState === 'background') {
      clearInterval(timer.current)
      setRunning(false);
      //it waits for 20 second after the user has quitted the app
      exitFromAppTimeout.current = true
      const timeout = setTimeout(() => {
        exitFromAppTimeout.current = true
        console.log("passati 20 secondi")
      }, 20000);
      exitTimeout.current = timeout;
    }
    //if the user open the app again, it would reload if the expiring time is gone
    if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
      if (exitFromAppTimeout.current) {
        console.log("restart")
        NativeModules.DevSettings.reload()
      } else {
        clearTimeout(exitTimeout.current);
      }
    }
    appState.current = nextAppState;
  }

  useEffect(() => {
    if (!isFocused) {
      clearInterval(timer.current);
      let today = new Date()
      let startTimePause = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
      pause.current = startTimePause
      setRunning(false)
    }

  }, [isFocused])


  /*const backAction = () => {
    if (time > 0) {
      clearInterval(timer.current)
      Alert.alert("Hold on!", "Are you sure you want to go back?", [
        {
          text: "Cancel",
          onPress: () => {
            const interval = setInterval(() => {
              setTime((previousTime) => previousTime + 1);
            }, 1000);

            timer.current = interval;
          },
          style: "cancel"
        },
        {
          text: "YES", onPress: () => {
            handleYes();
          }
        }
      ]);
      return true;
    }

  }*/

  const saveResults = async (result) => {
    await setDoc(doc(database, "sessions", userInfo.idDoc, 'soloMode', result.id), result);
  }

  const handleYes = async () => {

    //significa che ho premuto il tasto "End" prima di aver fermato il timer quindi nell'array pauses ho uno "startTime" della pausa ma non ho l'"endTime"
    let endTimePause = null;
    if (pause.current) {
      let today = new Date();
      endTimePause = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    }

    let result = {
      startTime: Timestamp.fromDate(startTime.current),
      endTime: Timestamp.now(),
      duration: displayTime(time),
      type: 'solo',
      id: startTime.current.getTime().toString(),
    }

    if (pauses.length > 0 || endTimePause !== null) {
      result = {
        ...result,
        pauses: (function () {
          let pausesArray = pauses
          if (endTimePause !== null) {
            pausesArray.push({
              startTime: pause.current,
              endTimePause: endTimePause,
              duration: displayTime(secondConverterTime(endTimePause) - secondConverterTime(pause.current))
            })
          }
          return pausesArray
        })(),
      }
    }

    if (title != '') {
      result = {
        ...result,
        title: title
      }
    }

    await saveResults(result);
    setRunning(false);
    clearInterval(timer.current);
    startTime.current = null;
    setTime(0);
    setPauses([]);
    pause.current = null;
    //backHandlerListener.current=null;
    appStateListener.current = null;
    setModalVisibleConfirm(false)
    setModalVisibleEndTimer(true)
  }

  const handleNo = () => {
    setModalVisibleConfirm(false)
    if (time.current !== 0) {
      const interval = setInterval(() => {
        setTime((previousTime) => previousTime + 1);
      }, 1000);
      timer.current = interval;
      setRunning(true)
    }
  }

  // https://reactjs.org/docs/hooks-reference.html#usecallback
  const handleLeftButtonPress = useCallback(() => {
    if (time === 0 || timer.current === null) {
      return
    } else {
      if (isRunning) {
        setRunning(false)
        clearInterval(timer.current)
      }

      setModalVisibleConfirm(true);
    }


  }, [isRunning, time]);

  const handleRightButtonPress = useCallback(() => {
    //setta il tempo di inizio del timer
    if (time === 0) {
      startTime.current = new Date();
      const interval = setInterval(() => {
        setTime((previousTime) => previousTime + 1);
      }, 1000);
      timer.current = interval;
      //detect if the user try to go back
      //backHandlerListener.current= BackHandler.addEventListener("hardwareBackPress", backAction);
      //attach the listener to detect if the user try to quit the app
      appStateListener.current = AppState.addEventListener("change", homeAction);
    } else {
      if (!isRunning) {
        const interval = setInterval(() => {
          setTime((previousTime) => previousTime + 1);
        }, 1000)
        timer.current = interval;
        //Specifico la fine della pausa
        let today = new Date()
        let endTimePause = padToTwo(today.getHours()) + ":" + padToTwo(today.getMinutes()) + ":" + padToTwo(today.getSeconds());


        let startTimePause = pause.current;
        if (pause.current !== null) {
          setPauses(previousPauses => [...previousPauses, {
            startTime: startTimePause,
            endTime: endTimePause,
            duration: displayTime(secondConverterTime(endTimePause) - secondConverterTime(startTimePause))
          }]);
          pause.current = null
        }
      } else {
        clearInterval(timer.current)
        //specifico l'inizio della pausa
        let today = new Date()
        let startTimePause = padToTwo(today.getHours()) + ":" + padToTwo(today.getMinutes()) + ":" + padToTwo(today.getSeconds());
        pause.current = startTimePause
      }

    }
    setRunning((previousState) => !previousState);
  }, [isRunning, time]);

  return (
    <SafeAreaView style={[styles.container, { opacity: modalVisibleConfirm ? 0.8 : 1 }]}>
      <View style={styles.titleContainer}>
        <View style={{ width: '60%', borderColor: 'grey', borderWidth: 1, borderRadius: 10, padding: 10, justifyContent: 'center', alignItems: 'center' }}>
          <TextInput
            onChangeText={setTitle}
            value={title}
            style={styles.inputTitle}
          />
        </View>

      </View>
      <Modal
        animationType='fade'
        transparent={true}
        visible={modalVisibleConfirm}
      >
        <View style={styles.modalContainer}>
          <View style={styles.content}>
            <View style={styles.description}>
              <Text style={{ fontSize: 20 }}>Do you want to stop the timer?</Text>
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={[styles.button, { backgroundColor: 'green' }]}
                onPress={handleYes}
              >
                <Text style={styles.textButton}>Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.button, { backgroundColor: 'red' }]}
                onPress={handleNo}
              >
                <Text style={styles.textButton}>no</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        animationType='slide'
        transparent={false}
        visible={modalVisibleEndTimer}
        onRequestClose={() => {
          setModalVisibleEndTimer(false)
          navigation.navigate("Home")
        }}
        statusBarTranslucent={true}
      >
        <Pressable style={{ backgroundColor: 'green', flex: 1, justifyContent: 'center', alignItems: 'center' }}
          onPress={() => {
            setModalVisibleEndTimer(false)
            navigation.navigate("Home")
          }}
        >
          <FontAwesomeIcon icon={faCheckCircle} size={150} color='white' />
        </Pressable>
        <Text style={{ fontSize: 40, color: 'white', marginTop: 100, position: 'absolute', top: '55%', left: '9%' }}>Session finished</Text>
      </Modal>
      {isFocused && <StatusBar animated={false} backgroundColor='black' barStyle="light-content" />}
      <View style={styles.display}>
        <Text style={styles.displayText}>{displayTime(time)}</Text>
      </View>

      <View style={styles.control}>
        <Control
          isRunning={isRunning}
          handleLeftButtonPress={handleLeftButtonPress}
          handleRightButtonPress={handleRightButtonPress}
        />
      </View>
      <View style={styles.pausesContainer}>
        <FlatList
          style={{ flex: 1 }}
          data={pauses}
          renderItem={({ item }) => {
            return (
              <View style={{ width: '100%', height: 80, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>
                <Text style={{ fontSize: 25, color: 'white' }}>{item.startTime}</Text>
                <Text style={{ fontSize: 25, color: 'white' }}>{item.endTime}</Text>
                <Text style={{ fontSize: 25, color: 'red' }}>{item.duration}</Text>
              </View>
            )
          }}
          keyExtractor={(item) => item.startTime.toString()}
        />
      </View>
    </SafeAreaView >
  );
}

export default StopWatch;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    paddingTop: Constants.statusBarHeight,
    flexDirection: 'column'
  },
  display: {
    height: '50%',
    justifyContent: "center",
    alignItems: "center",

    paddingTop: 50
  },
  displayText: {
    color: "#fff",
    fontSize: 70,
    fontWeight: "200",
    fontFamily: Platform.OS === "ios" ? "Helvetica Neue" : null,
  },
  control: {
    height: '15%',
    alignItems: 'center',
    flexDirection: "row",
    justifyContent: "space-around",
  },
  result: { flex: 2 / 5 },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  content: {
    width: 250,
    height: 250,
    backgroundColor: 'white',
    borderRadius: 20,
    elevation: 10,
    flexDirection: 'column'
  },
  description: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 30,
  },
  button: {
    width: 70,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15
  },
  buttonContainer: {
    flex: 0.5,
    flexDirection: 'row',
    justifyContent: 'space-around',

  },
  textButton: {
    color: 'white',
    fontSize: 20
  },
  titleContainer: {
    position: 'absolute',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    top: '7%',
  },
  inputTitle: {
    width: '80%',
    color: 'white',
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold'
  },
  pausesContainer: {
    flex: 1,
    borderTopColor: 'white',
    borderTopWidth: 1
  }
});
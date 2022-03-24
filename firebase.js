// Import the functions you need from the SDKs you need

//Version 9
import {initializeApp} from "firebase/app" 
import {getAuth,setPersistence, browserLocalPersistence} from "firebase/auth"
import {getFirestore} from "firebase/firestore"
//import * as firebase from "firebase"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBxKVusi2CeZoNYlXm-oJBrMiQNkvGVg_U",
  authDomain: "loginpagesample-1e4fb.firebaseapp.com",
  projectId: "loginpagesample-1e4fb",
  storageBucket: "loginpagesample-1e4fb.appspot.com",
  messagingSenderId: "177079405103",
  appId: "1:177079405103:web:e1c533c8773986a2ced4da"
};

// Initialize Firebase
/*let app;
if(firebase.apps.length===0){
    app = firebase.initializeApp(firebaseConfig);
}else{
  app = firebase.app()
}
const auth = firebase.auth();
export {auth}*/

const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const database = getFirestore();





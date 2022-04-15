// Import the functions you need from the SDKs you need

//Version 9
import {initializeApp} from "firebase/app" 
import {getAuth,setPersistence, browserLocalPersistence} from "firebase/auth"
import {getFirestore} from "firebase/firestore"
/*import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'*/
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
//Functions
/*exports.addMessage = functions.https.onRequest(async (req,res) =>{
  const original = req.query.text
  const writeResult = await admin.firestore().collection('messages').add({original:original});
  res.json({result:`Message with ID: ${writeResult.id} added.`});
} );

exports.makeUpperCase = functions.firestore.document('messages/{docuemntId').onCreate(
  (snap,context)=>{
    const original = snap.data().original;
    functions.logger.log("Uppercasing", context.params.documentId,original);
    const uppercase = original.toUpperCase();
    return snap.ref.set({uppercase},{merge:true})
  }

)*/


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
// Initialize Firebase Cloud Messaging and get a reference to the service
export const auth = getAuth();
export const database = getFirestore();





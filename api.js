import { async } from "@firebase/util";
import {
    collection,
    addDoc,
    orderBy,
    onSnapshot,
    query,
    where,
    getDocs,
    doc,
    DocumentReference,
    QueryDocumentSnapshot,
    getDoc,
    QuerySnapshot,
    limit,
    Timestamp

} from "firebase/firestore";
import uuid from 'react-native-uuid';
import { auth } from "./firebas";

/*
Informazione di un utente dato il suo id del documento
*/
export async function getUserInformationsById(database, idUtente) {
    try {
        const documento = doc(database, `users/${idUtente.trim()}`);
        const docRef = await getDoc(documento);
        return docRef.data()
    } catch (error) {
        console.error(error);
        return null
    }
}

/* 
Informazioni di un utente dato il suo indirizzo mail
*/
export async function getUserInformationsByMail(database, mail) {
    try {
        const collectionRef = collection(database, 'users');
        const q = query(collectionRef, where("id", "==", mail));
        const docRef = await getDocs(q);
        const data = docRef.docs[0].data()
        return {
            data:data,
            idDoc:docRef.docs[0].id
        }

    } catch (error) {
        console.error(error);
        return null
    }


}

export async function getUserInformationsByUsername(database, username) {
    try {
        const collectionRef = collection(database, 'users');
        const q = query(collectionRef, where("username", "==", username));
        const docRef = await getDocs(q);
        const data = docRef.docs[0].data()
        return {
            data:data,
            idDoc:docRef.docs[0].id
        }

    } catch (error) {
        console.error(error);
        return null
    }


}


export async function getUsersBySimilarUsername(database, strSearch) {
    var strlength = strSearch.length;
    var strFrontCode = strSearch.slice(0, strlength - 1);
    var strEndCode = strSearch.slice(strlength - 1, strSearch.length);
    var startcode = strSearch;
    var endcode = strFrontCode + String.fromCharCode(strEndCode.charCodeAt(0) + 1);
    try {
        const userInfo = await getUserInformationsByMail(database,auth?.currentUser?.email);
        const collectionRef = collection(database, 'users');
        const q = query(collectionRef, where("username", ">=", startcode),where("username","<" ,endcode),limit(50),where("username","!=",userInfo.data.username),orderBy("username"));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc =>({
            id:doc.data().id,
            username: doc.data().username,
            idDoc : doc.id,
            avatar: doc.data().avatar
        }))
    }catch(error){
        console.error(error.message)
        return null
    }
}

export async function getPossibleFriendsBySimilarUsername(database,strSearch,array) {  //cerca tra gli utenti che non sono compresi nell'array passato e il cui username coincide con la stringa passata 
    var strlength = strSearch.length;
    var strFrontCode = strSearch.slice(0, strlength - 1);
    var strEndCode = strSearch.slice(strlength - 1, strSearch.length);
    var startcode = strSearch;
    var endcode = strFrontCode + String.fromCharCode(strEndCode.charCodeAt(0) + 1);
    try {
        const userInfo = await getUserInformationsByMail(database,auth?.currentUser?.email);
        const collectionRef = collection(database, `users`);
        const q = query(collectionRef, where("username", "not-in", [...array,userInfo.data.username]),where("username", ">=", startcode),where("username","<" ,endcode),limit(50), orderBy("username"));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc =>({
            id:doc.data().id,
            username: doc.data().username,
            idDoc : doc.id,
            avatar:doc.data().avatar
        }))
    }catch(error){
        console.error(error.message)
        return null
    }
}

export async function sendFriendRequest(database,senderObject,receiverIdDoc){  //senderObject = { idDoc,username}
    const collezione = collection(database,"users",receiverIdDoc,'userRequests');
    try{
        const result = await addDoc(collezione,{
            id:uuid.v4(),
            sender: senderObject,
            text: "richiesta di amicizia",
            createdAt: Timestamp.fromDate(new Date())
        })

        return result
    }catch(error){
        console.log(error.message)
        return null
    }
}



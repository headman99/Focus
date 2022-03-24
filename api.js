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
    limit

} from "firebase/firestore";

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

export async function getUsersBySimilarUsername(database, strSearch) {
    var strlength = strSearch.length;
    var strFrontCode = strSearch.slice(0, strlength - 1);
    var strEndCode = strSearch.slice(strlength - 1, strSearch.length);
    var startcode = strSearch;
    var endcode = strFrontCode + String.fromCharCode(strEndCode.charCodeAt(0) + 1);
    try {
        const collectionRef = collection(database, 'users');
        const q = query(collectionRef, where("username", ">=", startcode),where("username","<" ,endcode),limit(50), orderBy("username"));
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
        const collectionRef = collection(database, `users`);
        const q = query(collectionRef, where("username", "not-in", array),where("username", ">=", startcode),where("username","<" ,endcode),limit(50), orderBy("username"));
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


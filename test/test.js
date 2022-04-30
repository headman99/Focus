const testing = require("@firebase/rules-unit-testing");
const firebase = require("@firebase/testing")
const assert = require('assert')
const uuid = require("uuid")
const { Timestamp } = require("firebase/firestore");
const firest = require('firebase/firestore');
const fs = require('fs');
const { doesNotReject } = require("assert");
//const { assertFails } = require("@firebase/rules-unit-testing");

const MY_PROJECT_ID = "loginpagesample-1e4fb";
const theirId = "WfIE6Outgbhm0127Sq18j8UW0Ma2";
const myId = "84OlplEOOzO1mCKW592e9gnW9b43";
const myAuth = { uid: myId, email: "davide.capacchione.58@gmail.com" };
const me={
    email:'davide.capacchione.58@gmail.com' ,
    uid :myId,
    idDoc:"F2G3yNVeETuJRDGbmMsi",
    username :"paguro99"
};
const him ={
    email:'che68asyavz33yhgmail.com',
    uid : theirId,
    idDoc : "giyjlcOQ5SHHJ1N1dOlU",
    username:"headman99"
};



/*let testEnv = testing.initializeTestEnvironment({
    projectId: "loginpagesample-1e4fb",
    firestore: {
        rules: fs.readFileSync('../firestore.rules', "utf8"),
    },
})




describe("my social app", () => {
    it("modify user data of another user", () => {
        testEnv.then(autCon =>{
            const test = autCon.authenticatedContext(myId);
            testing.assertSucceeds(firest.updateDoc(firest.doc(test.firestore(), `/users/${him.idDoc}`)), {
            username: 'pollastro15'
        })
        });
        
    });

  it("createNotifications",()=>{
        testEnv.then(autCon =>{
            const test = autCon.authenticatedContext(myId);
            testing.assertFails(firest.setDoc(firest.doc(test.firestore(),`/notifications/${him.idDoc}/userRequests/${me.idDoc}`),{
                type: 'received',
                requestRef:`/notifications/${me.idDoc}/userRequests/${him.idDoc}`,
                id:uuid.v4() ,
                createdAt: Timestamp.now(new Date()),
                sender: me.username,
                read: false
            }))
        })
    })
})*/

function getFirestore(auth){
    return firebase.initializeTestApp({projectId:MY_PROJECT_ID,auth:myAuth}).firestore();
}

describe("app functionalities",()=>{

    it("modify user data of another user", async ()=>{
        const db = getFirestore(myAuth);
        const testDoc = db.collection("users").doc(`${him.idDoc}`)
        await firebase.assertSucceeds(testDoc.update({username:'pollastro15'}));
    })

})




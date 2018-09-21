const admin = require('firebase-admin');

const serviceAccount = require('./service-account/nucees-30886-firebase-adminsdk-92waj-2ddeb70293.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

//firestore settings
const db = admin.firestore();
const settings = {
    timestampsInSnapshots: true
}
db.settings(settings);

/**
 * Get document from firestore
 * @param {*} collection 
 * @param {*} document 
 */
const getDocData = (collection, document) => {

  dbRef = db.collection(collection).doc(document).get();  

  return new Promise((resolve, reject) => {
    resolve(dbRef);
  })

}

/***
 * Get multiple document from a collection
 * @param {*} collection
 */
const getCollectionData = collection => {
  const collectionRef = db.collection(collection)
  .orderBy('added_at', 'desc')
  .get();

  return new Promise((resolve, reject) => {
    resolve(collectionRef);
  })
}

/**
 * Add data to firestore with generated unique id
 * @param {*} name of collection 
 * @param {*} object data 
 */
const addDoc = (collection, data) => {
  return new Promise((resolve, reject) => {
    resolve(db.collection(collection).add(data));
  })
}

const checkNIK = (nik) => {
  var usersRef = db.collection('users');
  var queryRef = usersRef.where('nik', '==', nik);
return new Promise((resolve, reject) => {
  queryRef.get()
  .then(snapshot => {
    // console.log(snapshot)
    if(snapshot.size > 0){
      snapshot.forEach(doc => {
        resolve(doc.data());
      })
    }else{
      resolve(false);
    }
  })
  .catch(err => {
    reject(err);
  });
})

}

const usersRef = db.collection('users'); 

module.exports = {
  addDoc,
  getCollectionData,
  getDocData,
  usersRef,
  checkNIK
}
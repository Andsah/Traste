/*
This file contains the Firebase Class.
It initializes the firebase database and handles all the functions for adding,
changing and deleting entries in the database.
*/

const Firestore = require("@google-cloud/firestore");
const path = require("path");

const {v4: uuidv4} = require("uuid");
const {initializeApp} = require("firebase/app");
const {getStorage, ref, uploadBytes, getDownloadURL,
  deleteObject} =
require("firebase/storage");

const firebaseConfig = {
  apiKey: "AAAAm_Qkz68:APA91bEeboBLN9Is0JTqJGwQqoJIAeqatTlQ2WigbKxoC418apnP"+
  "g6RUbBKAwuB31JP81h3WgoDTrw00WOLS5sayASuGTPPQdIj-9RGgw14SOdAik9"+
  "_VIRxNxFq5gdMVUtkh2W_KyAwp",
  authDomain: "https://accounts.google.com/o/oauth2/auth",
  storageBucket: "gs://traste-71a71.appspot.com",
};
const firebaseApp = initializeApp(firebaseConfig);

const storage = getStorage(firebaseApp);
// connectStorageEmulator(storage, "localhost", 9199);

/**
 * Upload image is the functions used to communicate
 * with cloud storage.
 * @param {*} data
 * @returns url to the image in cloud storage
 */

async function uploadImage(data) {
  const imgId = uuidv4();
  const storageRef = ref(storage, imgId);
  // 'file' comes from the Blob or File API
  await uploadBytes(storageRef, data, {contentType: "image/png"});
  const out = await getDownloadURL(storageRef);
  return JSON.stringify({imgUrl: out});
}


class FirestoreClient {
  constructor() {
    this.firestore = new Firestore({
      projectId: "traste-71a71",
      keyFilename: path.join(__dirname, "./service_account.json"),
    });
  }

  /*
    This function deletes all entries of specific collection.
    params collectionPath, batchSize
    returns promise
    */
  async deleteSubCollection(docketNum, collectionPath) {
    const collectionRef = this.firestore
        .collection("Reports").doc(docketNum).collection(collectionPath);
    const query = collectionRef.orderBy("__name__").limit(10);
    return new Promise((resolve, reject) => {
      deleteQueryBatch(this.firestore, query, resolve).catch(reject);
    });
  }

  /**
   * Delete document function
   * @param {*} documentPath
   * @return {*}
   */
  async deleteDocument(documentPath) {
    const documentRef = await this.firestore
        .collection("Reports").doc(documentPath);
    return await documentRef.delete();
  }

  async getPassword() {
    const docRef = this.firestore.collection("Password").doc("Password");
    const doc = await docRef.get();
    // console.log("Document data:", doc.data().hashedPassword);
    return doc.data().hashedPassword;
  }

  async deleteImage(imagePath) {
    // ta ut id på url
    const imageToken = decodeURIComponent(imagePath.split("/")
        .pop().split("?")[0]);
    const imageRef = ref(storage, imageToken);
    deleteObject(imageRef).then(()=>{
      console.log("image removed");
    }).catch((error)=>{
      console.log("error", error);
    });
  }

  async deleteReport(docketNum, docketPic, wastePic) {
    const cresp = await this.deleteSubCollection(docketNum, "Contains");
    const resp = await this.deleteDocument(docketNum);
    await this.deleteImage(docketPic);
    await this.deleteImage(wastePic);
    if (resp && cresp) {
      return {msg: "Delete was successfull", status: 200};
    } else {
      return {msg: "Delete was unsuccessfull", status: 400};
    }
  }
  /*
    This function creates a report from data.
    If data is not formatted correctly a error code will be provided
    params data
    returns promise
    */
  async createReport(data) {
    const reportData = {
      docketNumber: data.docketNumber, // STRING
      docketPicture: data.docketPicture, // PNG
      wastePicture: data.wastePicture, // JPG
      date: data.date, // STRING
      name: data.name, // STRING
      weight: data.weight, // FLOAT
      timestamps: data.timeStamps, // DATE
      binSize: data.binSize, // INT
      site: data.site, // STRING
    };
    const response =
    this.firestore.collection("Reports").doc(data.docketNumber).get()
        .then(async (doc) =>{
          if (doc.exists) {
            return JSON.stringify({msg: "Report already exists"});
          } else {
            await this.firestore.collection("Reports").
                doc(data.docketNumber).set(reportData);
            const wasteData = data.wasteData;
            const reportRef = this.firestore.collection("Reports").
                doc(data.docketNumber);
            if (wasteData && (typeof wasteData === "object")) {
              // eslint-disable-next-line guard-for-in
              const tmpWasteData = {};
              for (const [key, value] of Object.entries(wasteData)) {
                tmpWasteData[key] = parseInt(value);
              }
              await reportRef.collection("Contains")
                  .doc("WasteData").set(tmpWasteData);
            }
            return JSON.stringify({msg: "Report was made"});
          }
        });
    return response;
  }
  /*
   * Returns all reports in the collection Reports
   */
  async getAllReports() {
    const ref = this.firestore.collection("Reports");
    const snapshot = await ref.get();
    const outList = [];
    for ( const doc of snapshot.docs) {
      const docRef = this.firestore.collection("Reports").doc(doc.id);
      const docData = doc.data();
      const containsRef = docRef.collection("Contains");
      const containsSnapshot = await containsRef.get();
      const o = {};
      for (const waste of containsSnapshot.docs) {
        o[waste.id] = waste.data();
      }
      outList.push({...docData, ...o});
    }
    outList.sort(compare);
    return JSON.stringify(outList);
  }
}

/*
This function deletes small batches of documents in the database.
It gets called by deleteCollection.
params db, query, resolve
returns promise
*/
async function deleteQueryBatch(db, query, resolve) {
  const snapshot = await query.get();

  const batchSize = snapshot.size;
  if (batchSize === 0) {
    // When there are no documents left, we are done
    resolve({msg: "Deleted all subcollections"});
    return;
  }

  // Delete documents in a batch
  const batch = db.batch();
  snapshot.docs.forEach((doc) => {
    batch.delete(doc.ref);
  });
  await batch.commit();

  // Recurse on the next process tick, to avoid
  // exploding the stack.
  process.nextTick(() => {
    deleteQueryBatch(db, query, resolve);
  });
}

function compare(a, b) {
  if (new Date(a.timestamps) < new Date(b.timestamps)) {
    return 1;
  }
  if (new Date(a.timestamps) > new Date(b.timestamps)) {
    return -1;
  }
  return 0;
}

module.exports = {FirestoreClient, uploadImage};

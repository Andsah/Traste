const { assert } = require('@firebase/util');
const Firestore = require('@google-cloud/firestore');
const path = require('path');

class FirestoreClient {
    constructor() {
        this.firestore = new Firestore({
            projectId: "traste-71a71",
            keyFilename: path.join(__dirname, './service_account.json')
        })
    }

    

    async deleteCollection(collectionPath, batchSize) {
        const collectionRef = this.firestore.collection(collectionPath);
        const query = collectionRef.orderBy('__name__').limit(batchSize);
      
        return new Promise((resolve, reject) => {
          deleteQueryBatch(this.firestore, query, resolve).catch(reject);
        });
      }
      
    
  

    async createReport (data) {

        const reportData = {
            docketNumber: data.docketNumber, //INT
            docketPicture: data.docketPicture, // PNG
            wastePicture: data.wastePicture, // JPG
            name: data.name, // STRING
            weight: data.weight, // FLOAT
            timestamps: data.timeStamps, //DATE
            binSize: data.binSize, // INT
            facility: data.facility // STRING
          };
        var response = this.firestore.collection('Reports').doc(data.docketNumber).get()
        .then (async doc =>{
            if (doc.exists){
                return JSON.stringify({msg: "Report already exists!"});
            } else {
                await this.firestore.collection('Reports').doc(data.docketNumber).set(reportData); 
                return JSON.stringify({msg: 'Report was made'});
            }
        })
        .catch(err => {
            console.error('Error making report', err);
        })
        return response;
    }
}

async function deleteQueryBatch(db, query, resolve) {
    const snapshot = await query.get();

    const batchSize = snapshot.size;
    if (batchSize === 0) {
    // When there are no documents left, we are done
    resolve();
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



module.exports = new FirestoreClient();
//module.exports = {deleteCollection};
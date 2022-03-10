/* eslint-disable require-jsdoc */
/* eslint-disable max-len */
/* eslint linebreak-style: ["error", "windows"] */
/*
This file contains the Firebase Class.
It initializes the firebase database and handles all the functions for adding,
changing and deleting entries in the database.
*/


const Firestore = require('@google-cloud/firestore');
const path = require('path');

class FirestoreClient {
  constructor() {
    this.firestore = new Firestore({
      projectId: 'traste-71a71',
      keyFilename: path.join(__dirname, './service_account.json'),
    });
  }

  /*
    This function deletes all entries of specific collection.
    params collectionPath, batchSize
    returns promise
    */
  async deleteCollection(collectionPath, batchSize) {
    const collectionRef = this.firestore.collection(collectionPath);
    const query = collectionRef.orderBy('__name__').limit(batchSize);

    return new Promise((resolve, reject) => {
      deleteQueryBatch(this.firestore, query, resolve).catch(reject);
    });
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

    const response = this.firestore.collection('Reports').doc(data.docketNumber).get()
        .then(async (doc) =>{
          if (doc.exists) {
            return JSON.stringify({msg: 'Report already exists'});
          } else {
            await this.firestore.collection('Reports').doc(data.docketNumber).set(reportData);
            const wasteData = data.wasteData;
            const reportRef = this.firestore.collection('Reports').doc(data.docketNumber);

            if (wasteData && (typeof wasteData === 'object')) {
              // eslint-disable-next-line guard-for-in
              for (const [key, value] of Object.entries(wasteData)) {
                // console.log(`${key}: ${value}`);
                await reportRef.collection('Contains').doc(key).set({percentage: parseInt(value)});
              }
            }
            return JSON.stringify({msg: 'Report was made'});
          }
        });
    return response;
  }

  /*
    This function creates a site from data.
    If data is not formatted correctly a error code will be provided
    params data
    returns promise
    */
  async createSite(data) {
    const reportData = {
      adress: data.adress, // STRING
      name: data.name, // STRING
    };
    const response = this.firestore.collection('Sites').doc(data.adress).get()
        .then(async (doc) =>{
          if (doc.exists) {
            return JSON.stringify({msg: 'Site already exists'});
          } else {
            await this.firestore.collection('Sites').doc(data.adress).set(reportData);
            return JSON.stringify({msg: 'Site was made'});
          }
        });
    return response;
  }
  /*
    This function is used to log different types of waste.
    Waste is included in logging a report in the database.
    params data
    returns promise
    */
  async createWaste(data) {
    const reportData = {
      materialName: data.materialName, // STRING
      density: data.density, // DOUBLE
    };
    const response = this.firestore.collection('Waste').doc(data.materialName).get()
        .then(async (doc) =>{
          if (doc.exists) {
            return JSON.stringify({msg: 'Waste already exists'});
          } else {
            await this.firestore.collection('Waste').doc(data.materialName).set(reportData);
            return JSON.stringify({msg: 'Waste was added to the database'});
          }
        });
    return response;
  }

  /*
    This function writes facilities into the database.
    params data
    returns promise
    */
  async createFacility(data) {
    const reportData = {
      facilityId: data.facilityId, // STRING
      location: data.location, // STRING
    };
    const response = this.firestore.collection('Facilities').doc(data.facilityId).get()
        .then(async (doc) =>{
          if (doc.exists) {
            return JSON.stringify({msg: 'Facility already exists'});
          } else {
            await this.firestore.collection('Facilities').doc(data.facilityId).set(reportData);
            return JSON.stringify({msg: 'Facility was added to the database'});
          }
        });
    return response;
  }

  /*
    This function writes employees into the database.
    params data
    returns promise
    */
  async createEmployee(data) {
    const reportData = {
      employeeId: data.employeeId, // STRING
      name: data.name, // STRING
      email: data.email, // STRING
      password: data.password, // STRING
      isDeleted: data.isDeleted, // BOLEAN
      facilityId: data.facilityId, // STRING
    };
    const response = this.firestore.collection('Employees').doc(data.employeeId).get()
        .then(async (doc) =>{
          if (doc.exists) {
            return JSON.stringify({msg: 'Employee already exists'});
          } else {
            await this.firestore.collection('Employees').doc(data.employeeId).set(reportData);
            return JSON.stringify({msg: 'Employee was added to the database'});
          }
        });
    return response;
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

module.exports = FirestoreClient;

/*
This is the test file for createReport
*/

const {expect} = require("chai");
const FirestoreClient = require("../firestoreClient");
const FS = new FirestoreClient();

describe("The create function", () => {
  it("Should return report was made", function(done) {
    const data = {
      "docketNumber": "f",
      "docketPicture": "asdk124",
      "wastePicture": "asdk123",
      "name": "Andreas",
      "weight": 10,
      "timeStamps": "erik",
      "binSize": 5,
      "facility": "Andreas",
      "wasteData": {"wood": 0, "concrete": 100, "other": 0, "metal": 0},
      "site": "Hemköp",
      "date": "NULL",
    };

    FS.createReport(data).then((res, body) => {
      expect(res).to.be.eq(JSON.stringify({msg: "Report was made"}));
      done();
    }).catch(done);
  });
  it("Should return report already exists", function(done) {
    const data = {
      "docketNumber": "f",
      "docketPicture": "Andreas",
      "wastePicture": "andreas",
      "name": "Andreas",
      "weight": 10,
      "timeStamps": "erik",
      "binSize": 5,
      "facility": "Andreas",
      "wasteData": {"wood": 0, "concrete": 100, "other": 0, "metal": 0},
    };

    FS.createReport(data).then((res, body) => {
      expect(res).to.be.eq(JSON.stringify({msg: "Report already exists"}));
      done();
    }).catch(done);
  });

  it("Should return a error", function(done) {
    const data = {
      "docketPicture": "Andreas",
      "wastePicture": "andreas",
      "name": "Andreas",
      "weight": 10,
      "timeStamps": "erik",
      "binSize": 5,
      "facility": "Andreas",
      "wasteData": {"wood": 0, "concrete": 100, "other": 0, "metal": 0},
    };

    FS.createReport(data).then((res, body) => {
      done();
    }).catch((err) => {
      expect(JSON.stringify({"error": err.message})).to.be.eq(JSON.stringify(
          {"error": "Value for argument \"documentPath\" " + "\n" +
          " is not a valid resource path. Path must be a non-empty string."}));
      done();
    });
  });
});

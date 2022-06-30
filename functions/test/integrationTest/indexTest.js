
/**
 *This file contains the tests for index.js
 */

const chai = require("chai");
const chaiHttp = require("chai-http");
const assert = chai.assert;

const {app} = require("../../index.js");
chai.use(chaiHttp);

const jwt = require("jsonwebtoken");
const TOKEN_SECRET = "secret lol";

function generateToken(data) {
  return jwt.sign(data, TOKEN_SECRET, {expiresIn: "1000000s"});
}
const token = generateToken({});

const data = {
  date: "Thu Apr 07 2022",
  docketNumber: "intTest",
  docketPicture: "https://firebasestorage.googleapis.com/v0/b/traste-71a71.appspot.com/o/c77e148c-81b0-4f7d-a41c-c84fc2166be3?alt=media&token=78437d98-28ec-402a-9e11-7a19079273d9",
  wastePicture: "https://firebasestorage.googleapis.com/v0/b/traste-71a71.appspot.com/o/c77e148c-81b0-4f7d-a41c-c84fc2166be3?alt=media&token=78437d98-28ec-402a-9e11-7a19079273d9",
  name: "NULL",
  weight: 1.8,
  binSize: 10,
  site: "Norrköping",
  wasteData: {
    Wood: 100,
    Plastic: 0,
    Concrete: 0,
    Metal: 0,
    Other: 0,
  },
  timeStamps: "Thu, 07 Apr 2022 14:41:44 GMT",

};
const data2 = {
  Concrete: "0",
  Metal: "0",
  Other: "0",
  Plastic: "0",
  Wood: "100",
  binSize: 15,
  date: "Fri Mar 04 2022",
  docketNumber: "linus.se",
  docketPicture: "https://erik.com",
  name: "NULL",
  site: "Norrköping",
  timeStamps: "NULL",
  wasteData: {"Wood": 0, "Plastic": 0, "Concrete": 0, "Metal": 0, "Other": 0},
  wastePicture: "https://rasmuscalle.com",
  weight: "3.2",
};
const data3 = {
  Concrete: "0",
  Metal: "0",
  Other: "0",
  Plastic: "0",
  Wood: "100",
  binSize: 15,
  date: "Fri Mar 04 2022",
  docketNumber: "testinput",
  docketPicture: "/Andreas.se",
  name: "NULL",
  site: "Norrköping",
  timeStamps: "NULL",
  wasteData: {"Wood": 0, "Plastic": 0, "Concrete": 0, "Metal": 0, "Other": 0},
  wastePicture: "http://google.rasmus",
  weight: 2.4,
};

// lägg till after för att ta rapporten
describe("Integration Test for post function create report ", () => {
  it("Should return that a report was made with status code 200", (done) => {
    chai
        .request(app)
        .post("/createreport").set({Authorization: `Bearer ${token}`})
        .send(data).end(function(error, response, body) {
          if (error) {
            done(error);
          } else {
            assert.equal(response.text,
                JSON.stringify({msg: "Report was made"}));
            assert.equal(response.status, 200);
            done();
          }
        });
  });

  it("Should return that a report allready exists with status code 200",
      (done) => {
        chai
            .request(app)
            .post("/createreport").set({Authorization: `Bearer ${token}`})
            .send(data).end(function(error, response, body) {
              if (error) {
                done(error);
              } else {
                assert.equal(response.text,
                    JSON.stringify({msg: "Report already exists"}));
                assert.equal(response.status, 200);
                done();
              }
            });
      });
  it("Should return that a report was deleted with status code 200",
      (done)=>{
        chai
            .request(app)
            .del("/deletereport").set({Authorization: `Bearer ${token}`})
            .send(data)
            .end(function(error, response, body) {
              if (error) {
                done(error);
              } else {
                assert.equal(response.text,
                    JSON.stringify(
                        {msg: "Delete was successfull", status: 200},
                    ));
                assert.equal(response.status, 200);
                done();
              }
            });
      });
  it("Should return status code 400, for wrong data type", (done) => {
    chai
        .request(app)
        .post("/createreport").set({Authorization: `Bearer ${token}`})
        .send(data2).end(function(error, response, body) {
          if (error) {
            done(error);
          } else {
            assert.equal(response.body.errors.body[0].message,
                "should be number,null");
            done();
          }
        });
  });

  it("Should return status code 400, for wrong image format", (done) => {
    chai
        .request(app)
        .post("/createreport").set({Authorization: `Bearer ${token}`})
        .send(data3).end(function(error, response, body) {
          if (error) {
            done(error);
          } else {
            assert.equal(response.statusCode, 400);
            assert.equal(response.text,
                JSON.stringify({"error": "Invalid url"}));
            done();
          }
        });
  });
});



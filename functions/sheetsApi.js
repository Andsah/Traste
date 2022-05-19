const {google} = require("googleapis");
const keys = require("./traste-71a71.json");


const getObjectValues = (obj) => (obj && typeof obj === "object") ?
    Object.values(obj).map(getObjectValues).flat() :
    [obj];

const client = new google.auth.JWT(
    keys.client_email,
    null,
    keys.private_key,
    ["https://www.googleapis.com/auth/spreadsheets"],
);

const jwtAuth = client.authorize();
const gsapi = google.sheets({version: "v4", auth: client});

/**
 * Appends a new row containing the new report data
 * @param {*} report The report to appended to sheets
 */
async function addReport(report) {
  console.log("add report sheets api");
  await jwtAuth;
  // Flattens the report object
  const outData = [getObjectValues(report)];
  const addOpt = {
    spreadsheetId: "1jbX_k4W8q95KAqPVSHgnQ_h7cjiuTWY_Auk__B-C9B8",
    range: "Sheet1!A1:N1",
    valueInputOption: "RAW",
    requestBody: {values: outData, majorDimension: "ROWS"},
  };
  const res = await gsapi.spreadsheets.values.append(addOpt, {});
  console.log("sheets api skickat");
  return res.status;
}

/**
 * Removes the row containing the docket number and deletes possible empty rows
 * @param {*} docketNum docket number of the report to be deleted
 */
async function deleteReport(docketNum) {
  console.log("delete", docketNum);
  await jwtAuth;
  const getOpt = {
    spreadsheetId: "1-Ihe6vu4Nchp_CN1WqOSAiICXBZHhqdORCk6FriFMaE",
    range: "Sheet1!A:N",
  };
  const data = await gsapi.spreadsheets.values.get(getOpt, {});
  const outData = data.data.values;
  const foundIndex = await getIndexByValues(outData, docketNum);
  const batchOpt = {
    "requests": [
      {
        "deleteDimension": {
          "range": {
            "sheetId": 0,
            "dimension": "ROWS",
            "startIndex": foundIndex,
            "endIndex": foundIndex+1,
          },
        },
      },
    ],
  };
  const delResp = await gsapi.spreadsheets.batchUpdate({
    spreadsheetId: "1-Ihe6vu4Nchp_CN1WqOSAiICXBZHhqdORCk6FriFMaE",
    resource: batchOpt,
  });
  return delResp.status;
}

async function getIndexByValues(inList, num) {
  let foundIndex = -1;
  inList.map((item, index)=>{
    if (item.includes(num)) {
      foundIndex = index;
    }
  });
  return foundIndex;
}

module.exports = {addReport, deleteReport};

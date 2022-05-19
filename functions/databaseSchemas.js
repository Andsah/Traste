/*
This file contains the schemas ov different structures in the database.
*/

const reportSchema = {
  type: "object",
  required: ["docketNumber", "docketPicture",
    "wastePicture", "name", "weight", "timeStamps", "date", "binSize", "site"],
  properties: {
    docketNumber: {
      type: "string",
      minLength: 1,
    },
    name: {
      type: "string",
      minLength: 1,
    },
    weight: {
      type: "number",
      minimum: 1,
    },
    timeStamps: {
      type: "string",
      minLength: 1,
    },
    date: {
      type: "string",
      minLength: 1,
    },
    docketPicture: {
      type: "string",
      minLength: 1,
    },
    wastePicture: {
      type: "string",
      minLength: 1,
    },
    binSize: {
      type: "integer",
      minimum: 1,
    },
    site: {
      type: "string",
      minLength: 1,
    },
    wasteData: {
      type: "object",
    },
  },
};

const siteSchema = {
  type: "object",
  required: ["adress", "name"],
  properties: {
    adress: {
      type: "string",
      minLength: 1,
    },
    name: {
      type: "string",
      minLength: 1,
    },
  },
};

const wasteSchema = {
  type: "object",
  required: ["materialName", "density"],
  properties: {
    materialName: {
      type: "string",
      minLength: 1,
    },
    density: {
      type: "number",
      minimum: 0,
    },
  },

};

const facilitySchema = {
  type: "object",
  required: ["facilityId", "location"],
  properties: {
    facilityId: {
      type: "string",
      minLength: 1,
    },
    location: {
      type: "string",
      minlength: 1,
    },
  },

};

const employeeSchema = {
  type: "object",
  required:
  ["employeeId", "name", "email", "password", "isDeleted", "facilityId"],
  properties: {
    employeeId: {
      type: "string",
      minLength: 1,
    },
    name: {
      type: "string",
      minlength: 1,
    },
    email: {
      type: "string",
      minlength: 1,
    },
    password: {
      type: "string",
      minlength: 1,
    },
    isDeleted: {
      type: "boolean",
    },
    facilityId: {
      type: "string",
      minlength: 1,
    },
  },

};

module.exports = {
  siteSchema: siteSchema,
  reportSchema: reportSchema,
  wasteSchema: wasteSchema,
  facilitySchema: facilitySchema,
  employeeSchema: employeeSchema,
};

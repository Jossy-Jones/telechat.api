import * as dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";

async function makeConnection(uri) {
  try {
    const mon = await mongoose.connect(uri);
    console.log(`MongoDB :: Connected`);
    return mon;
  } catch (err) {
    console.log(`MongoDB :: Connection Failed: ${err}`);
    return null;
  }
};

const Database = makeConnection(`mongodb+srv://telechat:${process.env.DB_PASSWORD}@telechat.duv2hsh.mongodb.net/telechat?retryWrites=true&w=majority`);

export const ModelSchema = (model = {}) => {
  return new mongoose.Schema({
    ...model
  })
}

export const DataModel = (model="", schema={}) => {
  return mongoose.model(model, ModelSchema(schema))
}

export default { DataModel, ModelSchema };

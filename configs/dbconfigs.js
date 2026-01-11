import env from "./env.config.js";

import { MongoClient } from "mongodb";

let client = new MongoClient(env.ATLAS_DB_URL);

// create function that that returns collecion

async function databaseConnection() {
  let connection = await client.connect();
  if (!(await connection.connect())) {
    console.log("connection is failed");
  }
  try {
    let userCollection = client.db().collection("users");

    return userCollection;
  } catch (er) {
    console.log(er.message);
  }
}

export default databaseConnection;

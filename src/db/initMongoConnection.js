import mongoose from "mongoose";
import { ENV_VARS } from "../constants/envVars.js";
import { getEnvVar } from "../utils/getEnvVar.js";
import dotenv from "dotenv";
dotenv.config();

export const initMongoDBConnection = async () => {
  const user = getEnvVar(ENV_VARS.MONGO_DB_USER);
  const password = getEnvVar(ENV_VARS.MONGO_DB_PASSWORD);
  const host = getEnvVar(ENV_VARS.MONGO_DB_HOST);
  const db = getEnvVar(ENV_VARS.MONGO_DB_DB);
  const clientOptions = {
    serverApi: { version: "1", strict: true, deprecationErrors: true },
  };
  const uri = `mongodb+srv://${user}:${password}@${host}/${db}?retryWrites=true&w=majority`;

  try {
    await mongoose.connect(uri, clientOptions);
    await mongoose.connection.db.admin().command({ ping: 1 });
    console.log("Successfully connected to MongoDB!");
  } catch (error) {
    console.log("Failed to connect to Mongo DB", error);
    process.exit();
  }
};

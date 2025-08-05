import { initMongoDBConnection } from "./db/initMongoConnection.js";
import { startServer } from "./server.js";

await initMongoDBConnection();
startServer();

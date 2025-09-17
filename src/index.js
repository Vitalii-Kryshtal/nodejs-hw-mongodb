import { initMongoDBConnection } from "./db/initMongoConnection.js";
import { startServer } from "./server.js";
import { createDirIfNotExists } from "./utils/createDirIfNotExists.js";
import { TEMP_UPLOAD_DIR, UPLOAD_DIR } from "./constants/dir.js";
await initMongoDBConnection();
await createDirIfNotExists(TEMP_UPLOAD_DIR);
await createDirIfNotExists(UPLOAD_DIR);
startServer();

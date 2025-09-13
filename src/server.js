import dotenv from "dotenv";
import express from "express";
import pino from "pino-http";
import cors from "cors";
import { getEnvVar } from "./utils/getEnvVar.js";
import { ENV_VARS } from "./constants/envVars.js";
import router from "./routers/index.js";
import { notFoundHandler } from "./middlewares/notFoundHandler.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import cookieParser from "cookie-parser";
import { UPLOAD_DIR } from "./constants/dir.js";

export const startServer = () => {
  dotenv.config();
  const app = express();

  const PORT = getEnvVar(ENV_VARS.PORT);

  app.use(
    pino({
      transport: {
        target: "pino-pretty",
      },
    }),
    cors()
  );

  app.use(cookieParser());

  app.use(express.json());

  app.use(router);

  app.use("/uploads", express.static(UPLOAD_DIR));

  app.use(notFoundHandler);

  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

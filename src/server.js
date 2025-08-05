import dotenv from "dotenv";
import express from "express";
import pino from "pino-http";
import cors from "cors";
import { getEnvVar } from "./utils/getEnvVar.js";
import { ENV_VARS } from "./constants/envVars.js";
import { getContactById, getContacts } from "./services/contacts.js";

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

  app.get("/contacts", async (req, res) => {
    const contacts = await getContacts();
    res.json({
      status: 200,
      message: "Successfully found contacts!",
      data: contacts,
    });
  });

  app.get("/contacts/:contactId", async (req, res) => {
    const { contactId } = req.params;
    const contact = await getContactById(contactId);
    if (!contact) {
      res.status(404).json({
        status: 404,
        message: `Contact not found`,
      });
    }
    res.json({
      status: 200,
      message: `Successfully found contact with id ${contactId}! `,
      data: contact,
    });
  });

  app.use((req, res) => {
    res.status(404).json({
      status: 404,
      message: "Route not found",
    });
  });

  app.use((err, req, res, next) => {
    res.status(500).json({
      status: 500,
      message: "Something went wrong",
    });
  });

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

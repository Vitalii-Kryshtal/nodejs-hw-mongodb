import { Router } from "express";
import {
  createConatactController,
  deleteContactController,
  getContactByIdController,
  getContactsController,
  updateContactController,
} from "../controllers/contacts.js";
import { ctrlWrapper } from "../utils/ctrlWrapper.js";

const router = Router();

router.get("/contacts", ctrlWrapper(getContactsController));

router.get("/contacts/:contactId", ctrlWrapper(getContactByIdController));

router.post("/contacts/", ctrlWrapper(createConatactController));

router.delete("/contacts/:contactId", ctrlWrapper(deleteContactController));

router.patch("/contacts/:contactId", ctrlWrapper(updateContactController));

export default router;

import { Router } from "express";
import {
  createConatactController,
  deleteContactController,
  getContactByIdController,
  getContactsController,
  updateContactController,
} from "../controllers/contacts.js";
import { ctrlWrapper } from "../utils/ctrlWrapper.js";
import {
  createContactSchema,
  updateContactSchema,
} from "../validation/contacts.js";
import { validateBody } from "../middlewares/validateBody.js";
import { isValidId } from "../middlewares/isValidid.js";

const router = Router();

router.get("/contacts", ctrlWrapper(getContactsController));

router.get(
  "/contacts/:contactId",
  isValidId,
  ctrlWrapper(getContactByIdController)
);

router.post(
  "/contacts/",
  validateBody(createContactSchema),
  ctrlWrapper(createConatactController)
);

router.delete(
  "/contacts/:contactId",
  isValidId,
  ctrlWrapper(deleteContactController)
);

router.patch(
  "/contacts/:contactId",
  isValidId,
  validateBody(updateContactSchema),
  ctrlWrapper(updateContactController)
);

export default router;

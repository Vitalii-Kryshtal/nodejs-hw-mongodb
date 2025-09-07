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
import { isValidId } from "../middlewares/isValidi.js";
import { authenticate } from "../middlewares/authenticate.js";

const router = Router();

router.use(authenticate);

router.get("/", ctrlWrapper(getContactsController));

router.get("/:contactId", isValidId, ctrlWrapper(getContactByIdController));

router.post(
  "/",
  validateBody(createContactSchema),
  ctrlWrapper(createConatactController)
);

router.delete("/:contactId", isValidId, ctrlWrapper(deleteContactController));

router.patch(
  "/:contactId",
  isValidId,
  validateBody(updateContactSchema),
  ctrlWrapper(updateContactController)
);

export default router;

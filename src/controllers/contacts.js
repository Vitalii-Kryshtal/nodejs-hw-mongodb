import {
  createContact,
  deleteContact,
  getContactById,
  getContacts,
  updateContact,
} from "../services/contacts.js";
import createHttpError from "http-errors";
import { parsePaginationParams } from "../utils/parsePaginationParams.js";
import { parseSortParams } from "../utils/parseSortParams.js";
import { parseFilterParams } from "../utils/parseFilterParams.js";
import { saveFileToUploadDir } from "../utils/saveFileToUploadDir.js";
import { getEnvVar } from "../utils/getEnvVar.js";
import { CLOUDINARY } from "../constants/envVars.js";
import { saveFileToCloudinary } from "../utils/saveFileToCloudinary.js";

export const getContactsController = async (req, res, next) => {
  const userId = req.user;
  const { page, perPage } = parsePaginationParams(req.query);
  const { sortBy, sortOrder } = parseSortParams(req.query);
  const filter = parseFilterParams(req.query);
  const contacts = await getContacts({
    userId,
    page,
    perPage,
    sortBy,
    sortOrder,
    filter,
  });

  res.json({
    status: 200,
    message: "Successfully found contacts!",
    data: contacts,
  });
};

export const getContactByIdController = async (req, res, next) => {
  const userId = req.user;
  const { contactId } = req.params;
  const contact = await getContactById(contactId, userId);
  if (!contact) {
    throw createHttpError(404, "Contact not found");
  }
  res.json({
    status: 200,
    message: `Successfully found contact with id ${contactId}! `,
    data: contact,
  });
};

export const createConatactController = async (req, res) => {
  const body = await req.body;
  const photo = req.file;
  let photoUrl;

  if (photo) {
    if (getEnvVar(CLOUDINARY.ENABLE_CLOUDINARY) === "true") {
      photoUrl = await saveFileToCloudinary(photo);
    } else {
      photoUrl = await saveFileToUploadDir(photo);
    }
  }

  const contact = await createContact({
    ...body,
    userId: req.user._id,
    photo: photoUrl,
  });

  res.status(201).json({
    status: 201,
    maessage: "Succesfully created contact!",
    data: contact,
  });
};

export const deleteContactController = async (req, res, next) => {
  const userId = req.user;
  const { contactId } = req.params;
  const contact = await deleteContact(contactId, userId);

  if (!contact) {
    throw createHttpError(404, "Contact not found");
  }

  res.status(204).send();
};

export const updateContactController = async (req, res, next) => {
  const userId = req.user;
  const { contactId } = req.params;
  const body = req.body;
  const photo = req.file;
  let photoUrl;

  if (photo) {
    if (getEnvVar(CLOUDINARY.ENABLE_CLOUDINARY) === "true") {
      photoUrl = await saveFileToCloudinary(photo);
    } else {
      photoUrl = await saveFileToUploadDir(photo);
    }
  }

  const result = await updateContact(contactId, userId, {
    ...body,
    photo: photoUrl,
  });

  if (!result) {
    throw createHttpError(404, "Contact not found");
  }

  res.json({
    status: 200,
    message: `Successfully patched contact with id ${contactId}!`,
    data: result.contact,
  });
};

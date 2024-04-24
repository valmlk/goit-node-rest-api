import express from "express";
import {
  getAllContacts,
  getOneContact,
  deleteContact,
  createContact,
  updateContact,
  updateFavorite
} from "../controllers/contactsControllers.js";
import { checkUserData } from "../helpers/checkUser.js";
import { isValidId } from "../helpers/isValidId.js";
import { createContactSchema, updateContactSchema, patchContactSchema } from "../schemas/contactsSchemas.js";
import validateBody from "../helpers/validateBody.js"

const contactsRouter = express.Router();

contactsRouter.get("/", checkUserData, getAllContacts);

contactsRouter.get("/:id", checkUserData, isValidId,  getOneContact);

contactsRouter.delete("/:id", checkUserData, isValidId,  deleteContact);

contactsRouter.post("/", checkUserData, validateBody(createContactSchema), createContact);

contactsRouter.put("/:id", checkUserData, isValidId, validateBody(updateContactSchema), updateContact);

contactsRouter.patch("/:id/favorite", checkUserData, isValidId, validateBody(patchContactSchema), updateFavorite);

export default contactsRouter;
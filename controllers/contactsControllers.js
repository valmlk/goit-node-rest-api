import contactsService from '../services/contactsServices.js';
import HttpError from '../helpers/HttpError.js';
import { createContactSchema, updateContactSchema } from '../schemas/contactsSchemas.js';

export const getAllContacts = async (req, res, next) => {
  try {
    const result = await contactsService.listContacts();
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const getOneContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await contactsService.getContactById(id);
    if (!result) {
      throw HttpError(404);
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const deleteContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await contactsService.removeContact(id);
    if (!result) {
      throw HttpError(404);
    }
    res.json({
      message: 'Delete success',
    });
  } catch (error) {
    next(error);
  }
};

export const createContact = async (req, res, next) => {
  try {
    const { name, email, phone } = req.body;
    console.log(req.body);
    const { error } = createContactSchema.validate(req.body);
    if (error) {
      throw HttpError(400, error.message);
    }
    const result = await contactsService.addContact(name, email, phone);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export const updateContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { body } = req;

    if (Object.keys(body).length === 0) {
      throw HttpError(404);
    }

    const { error } = updateContactSchema.validate(body);
    if (error) {
      throw HttpError(400, error.message);
    }

    const result = await contactsService.updateContactById(id, body);

    if (!result || result.message === 'Not found') {
      throw HttpError(404);
    }

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

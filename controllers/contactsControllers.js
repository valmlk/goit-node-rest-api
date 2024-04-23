// import contactsService from '../services/contactsServices.js';
import HttpError from '../helpers/HttpError.js';
// import { createContactSchema, updateContactSchema, patchContactSchema } from '../schemas/contactsSchemas.js';

import Contact from "../models/contact.js";

export const getAllContacts = async (req, res, next) => {
  try {
    const result = await Contact.find();
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const getOneContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await Contact.findById(id);
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
    const result = await Contact.findByIdAndDelete(id);
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
    // const { name, email, phone } = req.body;
    // console.log(req.body);
    // const { error } = createContactSchema.validate(req.body);
    // if (error) {
    //   throw HttpError(400, error.message);
    // }
    const result = await Contact.create(req.body);
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

    // const { error } = updateContactSchema.validate(body);
    // if (error) {
    //   throw HttpError(400, error.message);
    // }

    const result = await Contact.findByIdAndUpdate(id, body, {new: true});

    if (!result || result.message === 'Not found') {
      throw HttpError(404);
    }

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const updateFavorite = async(req, res, next) => {
  const { id } = req.params;
  const {favorite} = req.body;
    const result = await Contact.findByIdAndUpdate(id, {favorite}, {new: true});
    if (!result) {
        throw HttpError(404, "Not found");
    }
    res.json(result);
};

import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import gravatar from 'gravatar';
import path from 'path';
import { promises as fs } from 'fs';
import Jimp from 'jimp';
import HttpError from '../helpers/HttpError.js';

import User from '../models/user.js';

dotenv.config();

const { SECRET_KEY } = process.env;

const avatarsDir = path.join(process.cwd(), 'public', 'avatars');

export const registerUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user) {
      throw HttpError(409, 'Email in use');
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const avatarURL = gravatar.url(email);

    const newUser = await User.create({ ...req.body, password: hashPassword, avatarURL });

    res.status(201).json({
      user: {
        email: newUser.email,
        subscription: newUser.subscription,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    console.log(SECRET_KEY);
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      throw HttpError(401, 'Email or password wrong');
    }
    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
      throw HttpError(401, 'Email or password wrong');
    }

    const payload = {
      id: user._id,
    };

    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '6h' });
    await User.findByIdAndUpdate(user._id, { token: token });

    res.status(200).json({
      token,
      user: {
        email: user.email,
        subscription: user.subscription,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getCurrentUser = async (req, res, next) => {
  try {
    const { email, subscription } = req.user;

    res.status(200).json({
      email,
      subscription,
    });
  } catch (error) {
    next(error);
  }
};

export const logOutUser = async (req, res, next) => {
  try {
    const { _id } = req.user;
    await User.findByIdAndUpdate(_id, { token: '' });

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const updateAvatar = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const { path: tempUpload, originalname } = req.file;
    const filename = `${_id}_${originalname}`;
    const resultUpload = path.join(avatarsDir, filename);

    await Jimp.read(tempUpload)
      .then(image => {
        return image.resize(250, 250).write(tempUpload);
      })
      .catch(error => {
        throw error;
      });

    await fs.rename(tempUpload, resultUpload);
    const avatarURL = path.join('avatars', filename);

    await User.findByIdAndUpdate(_id, { avatarURL });

    res.status(200).json({ avatarURL });
  } catch (error) {
    next(error);
  }
};

import express from 'express';
import {
  registerUser,
  loginUser,
  getCurrentUser,
  logOutUser,
  updateAvatar,
} from '../controllers/usersControllers.js';
import { checkUserData } from '../helpers/checkUser.js';
import { registerSchema, loginSchema } from '../schemas/userSchema.js';
import { upload } from '../helpers/upload.js';
import validateBody from '../helpers/validateBody.js';

const userRouter = express.Router();

userRouter.post('/register', validateBody(registerSchema), registerUser);

userRouter.post('/login', validateBody(loginSchema), loginUser);

userRouter.post('/logout', checkUserData, logOutUser);

userRouter.get('/current', checkUserData, getCurrentUser);

userRouter.patch('/avatars', checkUserData, upload.single('avatar'), updateAvatar);

export default userRouter;

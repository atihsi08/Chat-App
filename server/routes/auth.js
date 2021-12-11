import express from 'express';
import { authController } from '../controllers/authController.js';

export const authRouter = express.Router();

authRouter.post('/signup', authController.signup);
authRouter.post('/login', authController.login);
import express from 'express';
import {
  forgetPassword,
  resetPassword,
  signin,
  signup,
} from '../controllers/auth.js';

const router = express.Router();

router.post('/signup', signup);

router.post('/signin', signin);

router.post('/forget-password', forgetPassword);

router.post('/reset-password/:token', resetPassword);

export default router;

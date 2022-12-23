import express from 'express';
import {
  getProfile,
  createProfile,
  updateProfile,
} from '../controllers/profile.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.get('/getprofile', auth, getProfile);
router.post('/create', auth, createProfile);
router.put('/:id', auth, updateProfile);

export default router;

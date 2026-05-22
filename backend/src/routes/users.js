import express from 'express';
import { listUsers, createUser } from '../controllers/userController.js';

const router = express.Router();

router.get('/', listUsers);
router.post('/', createUser);

export default router;

import {Router} from 'express'
import { loginUser, registerUser } from '../controllers/authController.js';

const router = Router();

router.post('/register', registerUser);
router.post('/login', loginUser)

export default router;
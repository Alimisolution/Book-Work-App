import {Router} from 'express'
import { createBook, getAllBooks, deleteBook, getUserBooks } from '../controllers/bookController.js';
import protectedRoute from '../middleware/protectedRoute.js';

const router = Router();

router.post('/', protectedRoute, createBook)
router.get('/', protectedRoute, getAllBooks)
router.delete('/:id', protectedRoute, deleteBook)
router.get('/user', protectedRoute, getUserBooks)


export default router;

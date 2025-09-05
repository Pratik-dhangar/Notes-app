import { Router } from 'express';
import { protect } from '../middleware/authMiddleware';
import { createNote, getNotes, deleteNote } from '../controllers/noteController';

const router = Router();

// All note routes require authentication
router.use(protect);

router.route('/')
  .get(getNotes)
  .post(createNote);

router.route('/:id')
  .delete(deleteNote);

export default router;
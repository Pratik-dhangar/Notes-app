import { Router } from 'express';
import { protect } from '../middleware/authMiddleware';
import { createNote, getNotes, deleteNote } from '../controllers/noteController';

const router = Router();

// This applies the 'protect' middleware to ALL routes defined in this file.
// Any request to /api/notes/... will require a valid token.
router.use(protect);

router.route('/')
  .get(getNotes)
  .post(createNote);

router.route('/:id')
  .delete(deleteNote);

export default router;
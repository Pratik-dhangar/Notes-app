import { Router } from 'express';
import { protect } from '../middleware/authMiddleware';

const router = Router();

// We'll add our controller functions here in the next step.
// For now, let's create placeholder routes to see how to use the middleware.

// GET /api/notes - This will be a protected route
router.get('/', protect, (req, res) => {
  res.json({ message: 'Welcome to the protected notes route!' });
});

// POST /api/notes - This will also be a protected route
router.post('/', protect, (req, res) => {
  res.json({ message: 'Note created successfully!' });
});

export default router;
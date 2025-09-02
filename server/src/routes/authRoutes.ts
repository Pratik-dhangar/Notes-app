import { Router } from 'express';
import passport from 'passport';
import { generateOtp, verifyOtp, googleCallback, login, getUserProfile } from '../controllers/authController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

router.post('/generate-otp', generateOtp);
router.post('/login', login);
router.post('/verify-otp', verifyOtp);

// Protected route for getting user profile
router.get('/profile', protect, getUserProfile);

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
// Route for Google to redirect to after authentication
router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/', session: false }),
  googleCallback
);


export default router;
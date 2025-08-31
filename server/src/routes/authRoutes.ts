import { Router } from 'express';
import { generateOtp, verifyOtp } from '../controllers/authController';

const router = Router();

router.post('/generate-otp', generateOtp);
router.post('/verify-otp', verifyOtp);

export default router;
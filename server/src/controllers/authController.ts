/// <reference path="../types/custom.d.ts" />
import { Request, Response } from 'express';
import User, { IUser } from '../models/userModel'; // Updated import to include IUser
import otpGenerator from 'otp-generator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import sendEmail from '../utils/mailer';

// @desc    Generate OTP for login/signup
// @route   POST /api/auth/generate-otp
export const generateOtp = async (req: Request, res: Response) => {
  // ... (this function remains unchanged)
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }
    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });
    const salt = await bcrypt.genSalt(10);
    const hashedOtp = await bcrypt.hash(otp, salt);
    const otpExpires = new Date(new Date().getTime() + 10 * 60 * 1000);
    let user = await User.findOneAndUpdate(
      { email },
      { otp: hashedOtp, otpExpires, name: 'New User' },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    await sendEmail(
      email,
      'Your OTP for Note Taking App',
      `Your verification code is: ${otp}`
    );
    res.status(200).json({ message: 'OTP sent successfully to your email.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Verify OTP and log in/sign up the user
// @route   POST /api/auth/verify-otp
export const verifyOtp = async (req: Request, res: Response) => {
  // ... (this function remains unchanged)
  try {
    const { email, otp, name } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ message: 'Email and OTP are required' });
    }
    const user = await User.findOne({ email });
    if (!user || !user.otp || !user.otpExpires) {
      return res.status(400).json({ message: 'Invalid request or OTP expired.' });
    }
    if (new Date() > user.otpExpires) {
      return res.status(400).json({ message: 'OTP has expired.' });
    }
    const isMatch = await bcrypt.compare(otp, user.otp);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid OTP.' });
    }
    if (name) {
      user.name = name;
    }
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();
    const payload = { userId: user._id };
    const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
      expiresIn: '3d',
    });
    res.status(200).json({
      message: 'Login successful!',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};


// @desc    Handle Google OAuth callback, generate JWT, and redirect
// @route   GET /api/auth/google/callback
export const googleCallback = (req: Request, res: Response) => {
  const user = req.user as IUser; // User object attached by Passport

  // Generate JWT for the authenticated user
  const payload = { userId: user._id };
  const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
    expiresIn: '3d',
  });

  // Redirect to the frontend application with the token
  res.redirect(`${process.env.CLIENT_URL}/login/success?token=${token}`);
};
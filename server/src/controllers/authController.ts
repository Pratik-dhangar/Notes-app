/// <reference path="../types/custom.d.ts" />
import { Request, Response } from 'express';
import User, { IUser } from '../models/userModel';
import * as otpGenerator from 'otp-generator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import sendEmail from '../utils/mailer';


// SIGNUP: Generate OTP for a NEW user
export const generateOtp = async (req: Request, res: Response) => {
  try {
    const { email, name, dateOfBirth } = req.body;
    if (!email || !name) {
      return res.status(400).json({ message: 'Email and Name are required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'Account with this email already exists. Please log in.' });
    }
    
    const otp = otpGenerator.generate(6, { upperCaseAlphabets: false, lowerCaseAlphabets: false, specialChars: false });
    const hashedOtp = await bcrypt.hash(otp, 10);
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    const newUser = new User({ email, name, dateOfBirth, otp: hashedOtp, otpExpires });
    await newUser.save();
    
    await sendEmail(email, 'Your OTP for Notes App', `Your verification code is: ${otp}`);
    res.status(200).json({ message: 'OTP sent successfully. Please verify to complete signup.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// LOGIN: Generate OTP for an EXISTING user
export const login = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found. Please create an account.' });
    }
    
    const otp = otpGenerator.generate(6, { upperCaseAlphabets: false, lowerCaseAlphabets: false, specialChars: false });
    user.otp = await bcrypt.hash(otp, 10);
    user.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();
    
    await sendEmail(email, 'Your Login OTP for Notes App', `Your login OTP is: ${otp}`);
    res.status(200).json({ message: 'Login OTP sent successfully to your email.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// VERIFY: Verify OTP for both LOGIN and SIGNUP
export const verifyOtp = async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ message: 'Email and OTP are required' });
    }

    const user = await User.findOne({ email });
    if (!user || !user.otp || !user.otpExpires) {
      return res.status(400).json({ message: 'Invalid request. Please try signing up or logging in again.' });
    }

    if (new Date() > user.otpExpires) {
      return res.status(400).json({ message: 'OTP has expired.' });
    }

    const isMatch = await bcrypt.compare(otp, user.otp);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid OTP.' });
    }

    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();
    
    const payload = { userId: user._id };
    const token = jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: '3d' });
    
    res.status(201).json({
      message: 'Account verified successfully!',
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// GOOGLE OAUTH CALLBACK
export const googleCallback = (req: Request, res: Response) => {
  const user = req.user as IUser;
  const payload = { userId: user._id };
  const token = jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: '3d' });
  
  // Temporarily hardcode the URL to debug
  const clientUrl = process.env.CLIENT_URL || 'http://localhost:3000';
  console.log('CLIENT_URL:', clientUrl); // Debug log
  console.log('Redirecting to:', `${clientUrl}/login/success?token=${token}`);
  
  res.redirect(`${clientUrl}/login/success?token=${token}`);
};

// GET USER PROFILE
export const getUserProfile = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const userId = (req.user as any).id; // Use req.user.id directly
    const user = await User.findById(userId).select('-otp -otpExpires');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      dateOfBirth: user.dateOfBirth,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};
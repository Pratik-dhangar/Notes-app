import { Schema, model, Document } from 'mongoose';

// Interface to define the User document structure
export interface IUser extends Document {
  email: string;
  name: string;
  googleId?: string; // Optional because not all users sign up with Google
  otp?: string;
  otpExpires?: Date;
}

const userSchema = new Schema<IUser>({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
  },
  googleId: {
    type: String,
    unique: true,
    // 'sparse' allows multiple documents to have a null value for this field
    // but ensures that any non-null values are unique. Perfect for optional OAuth IDs.
    sparse: true,
  },
  otp: {
    type: String,
  },
  otpExpires: {
    type: Date,
  },
}, {
  timestamps: true // Automatically adds createdAt and updatedAt fields
});

const User = model<IUser>('User', userSchema);
export default User;
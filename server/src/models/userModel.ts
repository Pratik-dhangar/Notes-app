import { Schema, model, Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  name: string;
  dateOfBirth?: Date;
  googleId?: string;
  otp?: string;
  otpExpires?: Date;
}

const userSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  dateOfBirth: { type: Date },
  googleId: { type: String, unique: true, sparse: true },
  otp: { type: String },
  otpExpires: { type: Date },
}, {
  timestamps: true
});

export default model<IUser>('User', userSchema);
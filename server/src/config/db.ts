import mongoose from 'mongoose';
import { logger } from '../utils/logger';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI as string);
    logger.info('MongoDB Connected Successfully');
  } catch (error: any) {
    logger.error('MongoDB connection failed', { error: error.message });
    process.exit(1);
  }
};

export default connectDB;
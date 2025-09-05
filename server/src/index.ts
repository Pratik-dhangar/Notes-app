import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import passport from 'passport';
import connectDB from './config/db';
import authRoutes from './routes/authRoutes'
import noteRoutes from './routes/noteRoutes';
import { configurePassport } from './config/passport';
import { logger } from './utils/logger';

dotenv.config();
connectDB();

const app: Express = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(passport.initialize());
configurePassport();

app.get('/', (req: Request, res: Response) => {
  res.send('API is running..');
});

app.use('/api/auth', authRoutes);
app.use('/api/notes', noteRoutes);


app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});
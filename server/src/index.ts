import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import passport from 'passport';
import connectDB from './config/db';
import authRoutes from './routes/authRoutes'
import noteRoutes from './routes/noteRoutes';
import { configurePassport } from './config/passport';
import { logger } from './utils/logger';

// Load environment variables
dotenv.config();

// Initialize database connection
connectDB();

const app: Express = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Enable CORS
app.use(express.json()); // Body parser for JSON

app.use(passport.initialize()); // 👈 Initialize passport
configurePassport(); // 👈 Call your passport configuration


// A simple health-check route
app.get('/', (req: Request, res: Response) => {
  res.send('API is running..');
});

app.use('/api/auth', authRoutes); //auth-routes
app.use('/api/notes', noteRoutes); // notes routes


app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});
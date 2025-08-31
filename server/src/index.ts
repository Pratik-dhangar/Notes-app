import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db';

// Load environment variables
dotenv.config();

// Initialize database connection
connectDB();

const app: Express = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Enable CORS
app.use(express.json()); // Body parser for JSON

// A simple health-check route
app.get('/', (req: Request, res: Response) => {
  res.send('API is running..');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
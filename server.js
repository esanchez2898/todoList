import express from 'express';
import path from 'path';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/authRoutes.js';
import todoRoutes from './routes/todoRoutes.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = 3001;

// Middleware
app.use(express.static('public', { index: false }));
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: process.env.ORIGIN, 
    credentials: true,     
}));

// Routes
app.use(authRoutes);
app.use(todoRoutes);

// Serve HTML
app.get('/', (req, res) => {
    res.sendFile(path.resolve('public/index.html'));
});


app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

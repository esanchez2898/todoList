import express from 'express';
import path from 'path';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/authRoutes.js';
import todoRoutes from './routes/todoRoutes.js';

const app = express();
const port = 3001;

// Middleware
app.use(express.static('public', { index: false }));
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: 'https://taskflowmx.netlify.app', // Permitir solo tu frontend
    credentials: true, // Permitir el uso de cookies si es necesario
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

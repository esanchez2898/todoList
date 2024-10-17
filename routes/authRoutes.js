import express from 'express';
import bcrypt from 'bcrypt';
import db from '../db.js';
import jwt from 'jsonwebtoken';
import authMiddleware from './authMiddleware.js';

const router = express.Router();

router.get('/todo', authMiddleware, async (req, res) => {
    const todos = await db('todos').where({ id: req.user.id });
    res.json(todos);
});

router.get('/user', authMiddleware, (req, res) => {
    // Aquí envías los datos del usuario decodificado desde el token
    res.json({ user: req.user });
});

router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ error: "All fields are required" });
    }

    const userExist = await db('users').where({ email }).first();
    if (userExist) {
        return res.status(400).json({ error: "Email already exists" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const [newUser] = await db('users')
        .insert({ name, email, password: passwordHash })
        .returning('*');

    res.status(200).json({
        message: "User registered successfully",
        user: {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
        },
    });
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "All fields are required" });
    }

    const userExist = await db('users').where({ email }).first();
    if (!userExist || !(await bcrypt.compare(password, userExist.password))) {
        return res.status(400).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: userExist.id, name: userExist.name, email: userExist.email }, "test", { expiresIn: '1h' });
    res.cookie('access_token', token, {
        httpOnly: true,
        sameSite: 'strict',
        maxAge: 1000 * 60 * 60,
    }).status(200).json({ message: "Login successful" });
});

router.post('/logout', (req, res) => {
    res.clearCookie('access_token').json({ message: "Logout successful" });
});

export default router;

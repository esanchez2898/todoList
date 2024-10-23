import express from 'express';
import bcrypt from 'bcrypt';
import db from '../db.js';
import jwt from 'jsonwebtoken';
import authMiddleware from './authMiddleware.js';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router(); // app. --> router.


// ---------- Register ----------
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


// ---------- LOGIN ----------
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "All fields are required" });
    }

    const userExist = await db('users').where({ email }).first();
    if (!userExist || !(await bcrypt.compare(password, userExist.password))) {
        return res.status(400).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: userExist.id, name: userExist.name, email: userExist.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.cookie('access_token', token, {
        httpOnly: true,
        sameSite: 'strict',
        maxAge: 1000 * 60 * 60,
    }).status(200).json({ message: `Login successful,  We're happy to see you again ${userExist.name}` }); // I CAN'T READ THIS MESSAGE
});



// ---------- LOGOUT ----------
router.post('/logout', (req, res) => {
    res.clearCookie('access_token').json({ message: "Logout successful" }); // I CAN'T READ THIS MESSAGE
});



// ---------- USER INFO ----------
router.get('/user', authMiddleware, (req, res) => {
    res.json({ user: req.user });
});


/*router.get('/todo', authMiddleware, async (req, res) => {
    console.log("helloooooooooooooooooooooooooooooo ", req.user)
    const todos = await db('todos').where({ id: req.user.id });
    res.json(todos);
});

// Your authMiddleware and route definitions
/*router.get('/todo.html', authMiddleware, (req, res) => {    
    console.log('Middleware passed, sending file...');
    //res.sendFile(path.resolve('public/todo.html')); // Use path.resolve to point to the correct file
});*/

export default router;
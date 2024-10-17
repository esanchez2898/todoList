import express from 'express';
import db from '../db.js'; // Importa tu instancia de base de datos

const router = express.Router();

// GET /items
router.get('/items', async (req, res) => {
    const { status } = req.query; // Get the status from query parameters
    try {
        const items = status ? await db('todos').select('*').where({ status }) : await db('todos').select('*');
        res.status(200).json({
            message: 'Data loaded successfully!',
            jsonResponse: items
        });
    } catch (error) {
        res.status(500).json({ error: "Database error" });
    }
});

// POST /createItem
router.post('/createItem', async (req, res) => {
    const { name, status } = req.body;
    try {
        const [newTodo] = await db('todos').insert({ todo: name, status }).returning('*');
        res.status(201).json({ jsonResponse: newTodo });
    } catch (error) {
        res.status(500).json({ error: "Database error" });
    }
});

// DELETE /items/:id
router.delete('/items/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const deletedCount = await db('todos').where({ id }).del();
        if (deletedCount) {
            res.status(200).json({ message: `Data with id:${id} deleted successfully!` });
        } else {
            res.status(404).json({ error: 'Item not found for deletion' });
        }
    } catch (error) {
        res.status(500).json({ error: "Database error" });
    }
});

// PATCH /items/:id
router.patch('/items/:id', async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    try {
        const [updatedItem] = await db('todos').where({ id }).update({ todo: name }).returning('*');
        res.status(200).json({ message: 'Data updated successfully!', jsonResponse: updatedItem });
    } catch (error) {
        res.status(500).json({ error: "Database error" });
    }
});

// PATCH /items/:id/status
router.patch('/items/:id/status', async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    try {
        const [statusUpdated] = await db('todos').where({ id }).update({ status }).returning('*');
        res.status(200).json({ message: `Todo status updated to ${status}`, jsonResponse: statusUpdated });
    } catch (error) {
        res.status(500).json({ error: "Database error" });
    }
});

export default router;

import express from "express";
import db from './db.js';
const app = express();
const port = 3001;

// Middleware
app.use(express.static('public')); // Serve static files from the 'public' directory
app.use(express.json()); // Parse incoming JSON requests

// GET /items
app.get('/items', async (req, res) => {

    const { status } = req.query; // Get the status from query parameters  ------- ???????????  --->  const { status, id } = req.params;     -----> postman??

    /*
    
Diferencias principales:
Dónde se encuentran los datos en la URL:

req.query obtiene datos de la query string (después del ?).
req.params obtiene datos directamente del path de la URL.
Uso típico:

req.query se usa para filtros, opciones opcionales, o datos que no afectan el recurso de forma directa.
req.params se usa cuando el dato es parte de la identidad del recurso (como un id o status necesario para la operación).
Ejemplo comparativo:
Con req.query:

bash
Copiar código
GET /items?status=active
Aquí, status=active es un filtro opcional que se obtiene de req.query.

Con req.params:

bash
Copiar código
PUT /updateStatus/active/1
Aquí, status es "active" y id es "1", obtenidos como parte de la ruta y se obtienen con req.params.
    
    */





    try {
        // If a status is provided, filter by status; otherwise, return all items
        const items = status ? await db('todos').select('*').where({ status }) : await db('todos').select('*');
        res.status(200).json({
            message: 'Data loaded successfully!',
            jsonResponse: items
        });
    } catch (error) {
        res.status(500).json({ error: "Database error" }); // Handle database errors
    }
});

// POST /createItem
app.post('/createItem', async (req, res) => {
    const { name, status } = req.body; // Get the name and status from the request body
    try {
        const [newTodo] = await db('todos')
            .insert({ todo: name, status }) // Insert a new item into the database
            .returning('*'); // Return the newly created item

        res.status(201).json({
            jsonResponse: newTodo // Respond with the created item
        });
    } catch (error) {
        res.status(500).json({ error: "Database error" }); // Handle database errors
    }
});

// DELETE /items/:id
app.delete('/items/:id', async (req, res) => {
    const { id } = req.params; // Get the item ID from URL parameters
    try {
        const deletedCount = await db('todos').where({ id }).del(); // Delete the item by ID
        if (deletedCount) {
            res.status(200).json({
                message: `Data with id:${id} deleted successfully!`, // Respond with success message
            });
        } else {
            res.status(404).json({
                error: 'Item not found for deletion' // Item not found for deletion
            });
        }
    } catch (error) {
        res.status(500).json({ error: "Database error" }); // Handle database errors
    }
});

// PATCH /items/:id
app.patch('/items/:id', async (req, res) => {
    const { id } = req.params; // Get the item ID from URL parameters
    const { name } = req.body; // Get the new name from the request body
    try {
        const [updatedItem] = await db('todos')
            .where({ id }) // Filter by ID
            .update({ todo: name }) // Update the 'todo' field
            .returning('*'); // Return the updated item

        res.status(200).json({
            message: 'Data updated successfully!',
            jsonResponse: updatedItem // Respond with the updated item
        });
    } catch (error) {
        res.status(500).json({ error: "Database error" }); // Handle database errors
    }
});

// PATCH /items/:id/status
app.patch('/items/:id/status', async (req, res) => {
    const { id } = req.params; // Get the item ID from URL parameters
    const { status } = req.body; // Get the new status from the request body
    try {
        const [statusUpdated] = await db('todos')
            .where({ id }) // Filter by ID
            .update({ status }) // Update the 'status' field
            .returning('*'); // Return the updated item

        res.status(200).json({
            message: `Todo status updated to ${status}`, // Respond with success message
            jsonResponse: statusUpdated // Respond with the updated item
        });
    } catch (error) {
        res.status(500).json({ error: "Database error" }); // Handle database errors
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

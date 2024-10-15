//how to work with git?? how many push i have to do?
//branch?? versions??? when??? how many??

import express from "express";
import bcrypt from 'bcrypt';
import db from './db.js';
import jwt from 'jsonwebtoken';
import path from "path";
import cookieParser from "cookie-parser";
import { error } from "console";
const app = express();
const port = 3001;

// Middleware
app.use(express.static('public', { index: false })); // No sirve index.html automáticamente

app.use(express.json()); // Parse incoming JSON requests
app.use(cookieParser())



// authMiddleware.js
const authMiddleware = (req, res, next) => {
    const token = req.cookies.access_token; // Obtener el token desde las cookies

    if (!token) {
        return res.status(403).json({ error: 'Access denied, no token provided' });
    }

    try {
        const privateKey = "test"; // Debe ser la misma clave privada que usaste para firmar el token
        const decoded = jwt.verify(token, privateKey); // Verificar y decodificar el token
        req.user = decoded; // Almacenar la info del token decodificado en la request
        next(); // Continuar con la siguiente función
    } catch (error) {
        return res.status(403).json({ error: 'Invalid token' });
    }
};





app.get('/', (req, res) => {
    res.sendFile(path.resolve('public/index.html'));
});


app.get('/todo', authMiddleware, async (req, res) => {
    try {
        const todos = await db('todos').where({ user_id: req.user.id }); // Accede al id del usuario desde el token decodificado
        //res.status(200).json(todos);
        res.sendFile(path.resolve('public/todo.html'));

    } catch (error) {
        res.status(500).json({ error: 'Something went wrong' });
    }
});






























// diferent files???????????

app.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body // {} or [] ?????

        // Check if something is empty
        if (!name || !email || !password) {
            return res.status(400).json({ error: "All fields are required" })
        }

        // Check if the user already exist
        const userExist = await db('users').where({ email }).first()

        if (userExist) {
            return res.status(400).json({ error: "Email already exists" })
        } else {
            //create a new user
            const passwordHash = await bcrypt.hash(password, 10);

            const [newUser] = await db('users')
                .insert({ name, email, password: passwordHash })
                .returning('*');

            res.status(200).json({
                message: "User registered successfully",
                user: {
                    id: newUser.id,
                    name: newUser.name,
                    email: newUser.email
                }
            })
        }

    } catch (error) {
        //why here is no necessary return?
        res.status(400).json({ error: 'Server error' })
    }
})




app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body // {} or [] ?????

        const userExist = await db('users').where({ email }).first()
        if (!userExist) {
            return res.status(400).json({ error: 'Invalid email or password' })
        }

        const validPassword = await bcrypt.compare(password, userExist.password)
        if (!validPassword) {
            return res.status(400).json({ error: 'Invalid email or password' })
        }

        console.log(userExist)


        // Crear un token JWT
        const privateKey = "test"
        const token = jwt.sign({ name: userExist.name }, privateKey, { expiresIn: '1h' })


        // Responder con el token
        res.cookie('access_token', token, {
            httpOnly: true, // la cookie solo se puede acceder en el servidor
            //secure:
            sameSite: 'strict',
            maxAge: 1000 * 60 * 60
        }).status(200).json({ userExist, token });



    } catch (error) {
        //why here is no necessary return?
        console.log(error)
        res.status(400).json({ error: 'Server error' })
    }
    /*
    
        app.get('/todo', (req, res) => {
            const token = req.cookies.access_token
    
            if(!token) {
                return res.status(403).send('Access not authorized')
            } else{
                console.log(token)
            }
            /*
    
            try {
                const data = jwt.verify(token, 'test') // se va a buscar el name //linea 238
    
                //res.sendFile(path.resolve('public/todo.html'));
                con
    
            } catch (error) {
                res.status(403).send('Access not authorized')
            }
    
    */

    //})


})


app.post('/logout', (req, res) => {
    res.clearCookie('access_token')
    .json({message: "Logout successful"})
})























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

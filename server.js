/*

* POST /createItem
* PUT /updateItem
* PUT /updateStatus

* GET /activeItems
* GET /completeItems
  ->
* GET /items?status=active
* GET /items?status=complete
* GET /items?filter=complete

* PUT /updateItem/:id
->
* PATCH /items/:id

"RESTful" design


*/


import express from "express"
const app = express();
const port = 3001;

const items = {}
/*{
    "id": 1,
    "name": "nameTodo1",
    "status": "active"
}*/


// Middleware
app.use(express.static('public'));
app.use(express.json());
//app.use(express.text()); // If you are receiving plain text data you need to use the express.text() middleware to handle it. 


// GET
app.get('/allItems', (req, res) => {
    res.status(201).json({
        message: 'Data loaded successfully!',
        jsonResponse: items
    });
});

app.get('/activeItems', (req, res) => {
    const activeItems = Object.fromEntries(
        Object.entries(items).filter(([key, value]) => value.status === "active")
    );
    res.status(201).json({
        message: 'Active data loaded successfully!',
        jsonResponse: activeItems
    });
});

app.get('/completedItems', (req, res) => {
    const completedItems = Object.fromEntries(
        Object.entries(items).filter(([key, value]) => value.status === "completed")
    );
    res.status(201).json({
        message: 'Completed data loaded successfully!',
        jsonResponse: completedItems
    });
});



app.get('/item/:id', (req, res) => {
    const { id } = req.params
    const item = items[id]
    if (item) {
        res.status(201).json({
            message: 'Item found successfully!',
            jsonResponse: item
        });
    } else {
        res.status(404).json({
            error: 'Item not found'
        });
    }
});

// POST
app.post('/addItem', (req, res) => {
    {
        const id = (Object.keys(items).length) + 1;
        const { name, status } = req.body;
        items[id] = { id, name, status };
        res.status(201).json({
            jsonResponse: items[id]
        });
    }
})

// DELETE
app.delete('/deleteItem/:id', (req, res) => {
    const { id } = req.params
    delete items[id];
    res.status(201).json({
        message: `Data with id:${id} deleted successfully!`,
    });
});

// PUT
app.put('/updateItem/:id', (req, res) => {
    const { id } = req.params
    const { name } = req.body;
    items[id].name = name
    res.status(201).json({
        message: 'Data updated successfully!',
        jsonResponse: items[id]
    });
})

// PUT
app.put('/completeItem/:id', (req, res) => {
    const { id } = req.params
    items[id].status = "completed"
    res.status(201).json({
        message: 'Todo completed',
        jsonResponse: items[id]
    });
})

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
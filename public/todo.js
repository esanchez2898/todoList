document.addEventListener('DOMContentLoaded', () => {

    // Hacer una petición al backend para obtener la información del usuario
    fetch('https://todolist-j854.onrender.com/user', {  // Cambiar aquí
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include' // Incluye las cookies en la solicitud
    })
        .then(response => response.json())
        .then(data => {
            if (data.user) {
                // Mostrar la información del usuario en el frontend
                const userName = data.user.name;
                const userEmail = data.user.email;

                const h1 = document.querySelector('h1');
                h1.textContent = `Welcome, ${userName}!`;
                console.log(`User Info: Name - ${userName}, Email - ${userEmail}`);
            } else {
                console.error('No user data found:', data.error);
            }
        })
        .catch(error => {
            console.error('Error fetching user data:', error);
        });



    const addButton = document.getElementById('addButton');
    const newItemsList = document.getElementById('newItems');
    const inputField = document.getElementById('item');
    const logout = document.getElementById('logout')

    let route = '/items'; // Updated to follow RESTful route structure

    loadAllItems(route);

    addButton.addEventListener('click', (e) => {
        e.preventDefault();
        const itemName = inputField.value.trim();

        if (itemName) {
            addNewItem(itemName);
            inputField.value = '';
        }
    });


    logout.addEventListener('click', () => {
        fetch('https://todolist-j854.onrender.com/logout', {  // Cambiar aquí
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }
        })
            .then(response => response.json())
            .then(data => {
                console.log(data)
                window.location.href = 'index.html';
            })
            .catch(error => console.error('Error:', error));
    })

    // POST
    function addNewItem(itemName) {
        fetch('https://todolist-j854.onrender.com/createItem', {  // Cambiar aquí
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: itemName, status: "active" }),
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                loadAllItems(route);
            })
            .catch(error => console.error('Error:', error));
    }

    // GET
    function loadAllItems(route) {
        fetch('https://todolist-j854.onrender.com' + route)  // Cambiar aquí
            .then(response => response.json())
            .then(data => {
                console.log(data);
                newItemsList.innerHTML = '';

                const items = data.jsonResponse;

                items.forEach(item => {
                    const div = document.createElement('div');
                    const inputText = document.createElement("input");
                    inputText.type = "text";
                    inputText.id = "miInput";
                    inputText.textContent = `${item.todo}`;
                    inputText.value = `${item.todo}`;

                    const deleteButton = document.createElement('button');
                    deleteButton.textContent = '✖';
                    deleteButton.id = "deleteButton";
                    deleteButton.addEventListener('click', () => deleteItem(item.id));

                    const updateButton = document.createElement('button');
                    updateButton.textContent = '✎';
                    updateButton.id = "updateButton";
                    updateButton.addEventListener('click', () => updateItem(item.id, prompt('Enter new name:')));

                    const checkbox = document.createElement('input');
                    checkbox.type = 'checkbox';
                    checkbox.id = 'myCheckbox';

                    checkbox.addEventListener('click', () => {
                        if (checkbox.checked) {
                            inputText.classList.add('itemCompleted');
                            updateStatus('completed', item.id);
                        } else {
                            inputText.classList.remove('itemCompleted');
                            updateStatus('active', item.id);
                        }
                    });

                    if (item.status === 'completed') {
                        inputText.classList.toggle('itemCompleted');
                        checkbox.checked = true;
                    }

                    div.appendChild(deleteButton);
                    div.appendChild(updateButton);
                    div.appendChild(checkbox);
                    div.appendChild(inputText);
                    newItemsList.appendChild(div);
                });

                // Footer section with filters
                const div = document.createElement('div');
                div.id = "lastSection";

                const divItemsLeft = document.createElement('div');
                divItemsLeft.id = "itemsLeft";

                const span = document.createElement('span');
                const buttonAll = document.createElement('button');
                buttonAll.classList.add('lastSectionBotton');
                const buttonActive = document.createElement('button');
                buttonActive.classList.add('lastSectionBotton');
                const buttonCompleted = document.createElement('button');
                buttonCompleted.classList.add('lastSectionBotton');

                span.textContent = Object.values(items).length;
                divItemsLeft.textContent = ' items left';
                divItemsLeft.prepend(span);

                buttonAll.textContent = 'All';
                buttonAll.addEventListener('click', () => {
                    route = '/items';
                    loadAllItems(route);
                });

                buttonActive.textContent = 'Active';
                buttonActive.addEventListener('click', () => {
                    route = '/items?status=active';
                    loadAllItems(route);
                });

                buttonCompleted.textContent = 'Completed';
                buttonCompleted.addEventListener('click', () => {
                    route = '/items?status=completed';
                    loadAllItems(route);
                });

                div.appendChild(divItemsLeft);
                div.appendChild(buttonAll);
                div.appendChild(buttonActive);
                div.appendChild(buttonCompleted);
                newItemsList.appendChild(div);

                if (route == '/items') {
                    buttonAll.classList.add('botonActivo');
                } else if (route == '/items?status=active') {
                    buttonActive.classList.add('botonActivo');
                } else if (route == '/items?status=completed') {
                    buttonCompleted.classList.add('botonActivo');
                }
            })
            .catch(error => console.error('Error:', error));
    }

    // DELETE
    function deleteItem(id) {
        fetch(`https://todolist-j854.onrender.com/items/${id}`, {  // Cambiar aquí
            method: 'DELETE',
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                loadAllItems(route);
            })
            .catch(error => console.error('Error:', error));
    }

    // PATCH STATUS
    function updateStatus(status, id) {  
        fetch(`https://todolist-j854.onrender.com/items/${id}/status`, {  // Cambiar aquí
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status }),
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                console.log(`status ${status}`);
                //loadAllItems(route);
            })
            .catch(error => console.error('Error:', error));
    }

    // PATCH TODO
    function updateItem(id, newName) {
        if (newName) {
            fetch(`https://todolist-j854.onrender.com/items/${id}`, {  // Cambiar aquí
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: newName }),
            })
                .then(response => response.json())
                .then(data => {
                    console.log(data);
                    loadAllItems(route);
                })
                .catch(error => console.error('Error:', error));
        }
    }    
});

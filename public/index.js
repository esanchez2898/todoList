document.addEventListener('DOMContentLoaded', () => {
    const addButton = document.getElementById('addButton');
    const newItemsList = document.getElementById('newItems');
    const inputField = document.getElementById('item');

    const route = '/activeItems'

    loadAllItems(route);

    addButton.addEventListener('click', (e) => {
        e.preventDefault();
        const itemName = inputField.value.trim();

        if (itemName) {
            addNewItem(itemName)
            inputField.value = '';
        }
    });

    /*refreshButton.addEventListener('click', (e) => {
        e.preventDefault();
        loadAllItems();
    });*/


    // POST
    function addNewItem(itemName) {
        fetch('/addItem', {
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
        fetch(route)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                newItemsList.innerHTML = '';

                const items = data.jsonResponse;

                /*if (Object.values(items).length == 0) {

                    const li = document.createElement('li');
                    li.textContent = `${Object.values(items).length} items left. Please insert a new Todo`;
                    //div.appendChild(li);
                    newItemsList.appendChild(li);

                } else {*/

                for (let id in items) {
                    const div = document.createElement('div');

                    //const li = document.createElement('li');
                    //li.textContent = `${items[id].name}`;


                    const inputText = document.createElement("input");
                    inputText.type = "text";
                    inputText.id = "miInput";
                    inputText.textContent = `${items[id].name}`;
                    inputText.value = `${items[id].name}`;

                    //console.log("testtttttttttttttiiiiiiiiiiinggg", data.jsonResponse[id].status === )

                    /*buttonAll.classList.add('buttonSelected');
                    buttonActive.classList.remove('buttonSelected');
                    buttonCompleted.classList.remove('buttonSelected');*/

                    const deleteButton = document.createElement('button');
                    deleteButton.textContent = '✖';
                    deleteButton.id = "deleteButton";
                    deleteButton.addEventListener('click', () => deleteItem(id));

                    const updateButton = document.createElement('button');
                    updateButton.textContent = '✎';
                    updateButton.id = "updateButton";
                    updateButton.addEventListener('click', () => updateItem(id, prompt('Enter new name:')));



                    /*const checkButton = document.createElement('button');
                    checkButton.textContent = '✔';
                    checkButton.id = "checkButton";                    
                    checkButton.addEventListener('click', () => {
                        //li.style.textDecoration = 'line-through';                            
                        completeItem(id)
                    });*/


                    const checkbox = document.createElement('input');
                    checkbox.type = 'checkbox';
                    checkbox.id = 'myCheckbox';

                    checkbox.addEventListener('click', () => {
                        completeItem(id)
                    });


                    if (data.jsonResponse[id].status === 'completed') {
                        inputText.classList.add('test')
                        checkbox.checked = true;
                    }

                    div.appendChild(deleteButton);
                    div.appendChild(updateButton);
                    //div.appendChild(checkButton);
                    div.appendChild(checkbox);
                    //div.appendChild(li);

                    div.appendChild(inputText);

                    newItemsList.appendChild(div);
                }

                // Crear los elementos
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

                // Configurar el contenido de los elementos
                span.textContent = Object.values(items).length;
                divItemsLeft.textContent = ' items left';
                divItemsLeft.prepend(span);

                buttonAll.textContent = 'All';
                buttonAll.addEventListener('click', () => {
                    route = '/allItems'
                    loadAllItems(route)
                })


                buttonActive.textContent = 'Active';
                buttonActive.addEventListener('click', () => {
                    route = '/activeItems'
                    loadAllItems(route)
                })


                buttonCompleted.textContent = 'Completed';
                buttonCompleted.addEventListener('click', () => {
                    route = '/completedItems'
                    loadAllItems(route)
                })


                // Añadir los elementos al contenedor
                div.appendChild(divItemsLeft);
                div.appendChild(buttonAll);
                div.appendChild(buttonActive);
                div.appendChild(buttonCompleted);
                newItemsList.appendChild(div);


                //if (data.jsonResponse[id].status === 'completed') {
                if (route === '/allItems') {
                    buttonAll.classList.add('botonActivo')
                    buttonActive.classList.remove('botonActivo')
                    buttonCompleted.classList.remove('botonActivo')

                } else if (route === '/activeItems') {
                    buttonAll.classList.remove('botonActivo')
                    buttonActive.classList.add('botonActivo')
                    buttonCompleted.classList.remove('botonActivo')
                    
                } else if (route === '/completedItems') {
                    buttonAll.classList.remove('botonActivo')
                    buttonActive.classList.remove('botonActivo')
                    buttonCompleted.classList.add('botonActivo')
                }


                //}
            })
            .catch(error => console.error('Error:', error));
    }



    // DELETE
    function deleteItem(id) {
        fetch(`/deleteItem/${id}`, {
            method: 'DELETE',
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                loadAllItems(route);
            })
            .catch(error => console.error('Error:', error));
    }

    // PUT STATUS
    function completeItem(id) {
        fetch(`/completeItem/${id}`, {
            method: 'PUT',
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                console.log("status completed")
                loadAllItems(route);
            })
            .catch(error => console.error('Error:', error));
    }
    // PUT STATUS
    function completeItem(id) {
        fetch(`/completeItem/${id}`, {
            method: 'PUT',
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                console.log("status completed")
                loadAllItems(route);
            })
            .catch(error => console.error('Error:', error));
    }

    // PUT
    function updateItem(id, newName) {
        if (newName) {
            fetch(`/updateItem/${id}`, {
                method: 'PUT',
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
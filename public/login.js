const loginSection = document.querySelector('.login');
const registerSection = document.querySelector('.register');
const showRegisterLink = document.getElementById('showRegister');
const showLoginLink = document.getElementById('showLogin');

const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');


toastr.options = {
    closeButton: true,
    progressBar: true,
    positionClass: 'toast-bottom-right',
    timeOut: '5000'
};




// Show the register section: Event listener for the "Register" link
showRegisterLink.addEventListener('click', (e) => {
    e.preventDefault();
    loginSection.hidden = true;
    registerSection.hidden = false;
});

// Show the login section: Event listener for the "Login" link
showLoginLink.addEventListener('click', (e) => {
    e.preventDefault();
    registerSection.hidden = true;
    loginSection.hidden = false;
});

// Basic form validation: Ensures that both email and password fields are filled
function validateForm(email, password) {
    if (!email || !password) {
        toastr.error('All fields are required');
        return false;  // Prevent form submission
    }
    return true;  // Proceed if both fields are filled
}




// ---------   Register   ---------

registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const userName = document.getElementById('name').value;
    const userEmail = document.getElementById('email').value;
    const userPassword = document.getElementById('pw').value;

    if (!validateForm(userEmail, userPassword)) return;  // Validate the form. If validation fails, stop here.

    // Mostrar mensaje de "Cargando..."
    Swal.fire({
        title: 'Loading...',
        text: 'Please wait while we log you in',
        allowOutsideClick: false,  // No permite cerrar la alerta haciendo clic fuera
        didOpen: () => {
            Swal.showLoading();  // Muestra el spinner de carga
        }
    });

    // Send a POST request to the server to register the new user
    fetch('https://todolist-j854.onrender.com/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },  // Send the data as JSON
        body: JSON.stringify({ name: userName, email: userEmail, password: userPassword })  // Send the user's details
    })
        .then(response => response.json())  // Convert the server response to JSON
        .then(data => {  // Handle the response
            if (data.message) {
                Swal.close();
                Swal.fire('Success', data.message, 'success').then(() => {
                    window.location.href = 'index.html';  // If registration is successful, redirect to login
                });
            } else {
                Swal.close();
                toastr.error(data.error);
            }
        })
        .catch(error => {  // Handle any errors that occur during the request
            Swal.close();
            toastr.error('Something went wrong with the connection');
            console.error('Error:', error);
        });
});




// ---------   Login   ---------

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const userEmail = document.getElementById('email-lg').value;
    const userPassword = document.getElementById('pw-lg').value;

    if (!validateForm(userEmail, userPassword)) return;  // Validate the form. If validation fails, stop here.

     // Mostrar mensaje de "Cargando..."
     Swal.fire({
        title: 'Loading...',
        text: 'Please wait while we log you in',
        allowOutsideClick: false,  // No permite cerrar la alerta haciendo clic fuera
        didOpen: () => {
            Swal.showLoading();  // Muestra el spinner de carga
        }
    });

    // Send a POST request to the server to log in the user
    fetch('https://todolist-j854.onrender.com/login', {  // Cambiar aquí
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },  // Send the data as JSON
        credentials: 'include', // Asegúrate de incluir las credenciales
        body: JSON.stringify({ email: userEmail, password: userPassword })  // Send the login credentials
    })
        .then(response => response.json())  // Convert the server response to JSON
        .then(data => {  // Handle the response
            if (data.error) {
                Swal.close();
                toastr.error(data.error);
            } else {
                Swal.close();
                Swal.fire('Success', data.message, 'success').then(() => {
                    window.location.href = 'todo.html';  // If login is successful, redirect to the 'todo' page     // what happen here?????????             how to control the access?
                });
            }
        })
        .catch(error => {  // Handle any errors that occur during the request
            Swal.close();
            toastr.error('Something went wrong with the connection');
            console.error('Error:', error);
        });
});

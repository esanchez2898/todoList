// Elementos del DOM
const loginSection = document.querySelector('.login');
const registerSection = document.querySelector('.register');
const showRegisterLink = document.getElementById('showRegister');
const showLoginLink = document.getElementById('showLogin');

const name = document.getElementById('name');
const email = document.getElementById('email');
const password = document.getElementById('pw');

const emailLg = document.getElementById('email-lg');
const passwordLg = document.getElementById('pw-lg');

// Configuración de Toastr
toastr.options = {
    "closeButton": true,
    "progressBar": true,
    "positionClass": "toast-bottom-right",
    "timeOut": "5000"
};

// Mostrar la sección de registro
showRegisterLink.addEventListener('click', (e) => {
    e.preventDefault();
    loginSection.style.display = 'none';
    registerSection.style.display = 'block';
});

// Mostrar la sección de login
showLoginLink.addEventListener('click', (e) => {
    e.preventDefault();
    registerSection.style.display = 'none';
    loginSection.style.display = 'block';
});

// Validación básica del formulario
function validateForm(email, password) {
    if (email.trim() === "" || password.trim() === "") {
        toastr.error("All fields are required");
        return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
        toastr.error("Invalid email format");
        return false;
    }
    if (password.length < 6) {
        toastr.error("Password should be at least 6 characters long");
        return false;
    }
    return true;
}

// Mostrar Loader
function showLoader() {
    Pace.start();  // Iniciar barra de carga
    document.getElementById('login').disabled = true; // Desactivar botón
}

// Ocultar Loader
function hideLoader() {
    Pace.stop();
    document.getElementById('login').disabled = false;
}

// Registro de usuario
document.getElementById('signIn').addEventListener('click', () => {
    const userName = name.value;
    const userEmail = email.value;
    const userPassword = password.value;

    if (!validateForm(userEmail, userPassword)) return;

    showLoader();
    
    fetch('/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: userName, email: userEmail, password: userPassword }),
    })
    .then(response => response.json())
    .then(data => {
        hideLoader();
        if (data.message) {
            Swal.fire({
                title: "Successful!",
                text: data.message,
                icon: "success",
            }).then((result) => {
                if (result.isConfirmed || result.isDismissed) {
                    window.location.href = 'index.html';
                }
            });
        } else {
            toastr.error(data.error);
        }
    })
    .catch(error => {
        hideLoader();
        toastr.error('Something went wrong with the connection');
        console.error('Error:', error);
    });
});

// Login de usuario
document.getElementById('login').addEventListener('click', () => {
    const userEmail = emailLg.value;
    const userPassword = passwordLg.value;

    if (!validateForm(userEmail, userPassword)) return;

    showLoader();

    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: userEmail, password: userPassword }),
    })
    .then(response => response.json())
    .then(data => {
        hideLoader();
        if (data.error) {
            toastr.error(data.error);
        } else {
            // Si el login es exitoso, redirigir al panel de tareas
            window.location.href = 'todo.html';
        }
    })
    .catch(error => {
        hideLoader();
        toastr.error('Something went wrong with the connection');
        console.error('Error:', error);
    });
});

document.getElementById('registerForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const username = document.getElementById('regUsername').value;
    const password = document.getElementById('regPassword').value;

    fetch('/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
    })
    .catch((error) => {
        console.error('Fehler:', error);
    });
});

document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;

    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        if (data.token) {
            // Hier kannst du den Token speichern (z.B. in localStorage)
            localStorage.setItem('token', data.token);
        }
    })
    .catch((error) => {
        console.error('Fehler:', error);
    });
});

import React, { useState } from 'react';
import styles from './Login.module.css';

const Login = () => {
    const [correo, setCorreo] = useState('');
    const [contrasena, setContrasena] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        const credentials = {
            correo,
            contrasena
        };

        fetch('http://localhost:5001/login/', {
            method: 'POST',
            body: JSON.stringify(credentials),
        })
        .then(response => response.json())
        .then(data => {
            if (data.mensaje === 'Login successful') {
                console.log('Login successful:', data);
                alert('Login successful');
                // Redirect to admin page or dashboard
            } else {
                alert(data.mensaje);
            }
        })
        .catch((error) => {
            console.error('Error:', error);
            alert('Error during login');
        });
    };

    return (
        <div className={styles.loginContainer}>
            <form onSubmit={handleSubmit} className={styles.loginForm}>
                <h2>Login</h2>
                <input
                    type="email"
                    value={correo}
                    onChange={(e) => setCorreo(e.target.value)}
                    placeholder="Correo Electrónico"
                    required
                />
                <input
                    type="password"
                    value={contrasena}
                    onChange={(e) => setContrasena(e.target.value)}
                    placeholder="Contraseña"
                    required
                />
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default Login;

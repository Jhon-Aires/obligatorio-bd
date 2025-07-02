import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Login.module.css';

const Login = () => {
    const [correo, setCorreo] = useState('');
    const [contrasena, setContrasena] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError('');

        const credentials = {
            correo,
            contrasena
        };

        try {
            const response = await fetch('http://localhost:5001/login/autenticar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include', // Importante para las cookies de sesión
                body: JSON.stringify(credentials),
            });

            const data = await response.json();

            if (response.ok && data.mensaje === 'Login exitoso') {
                console.log('Login exitoso:', data);
                
                // Redirigir según el tipo de usuario
                if (data.es_administrador) {
                    navigate('/inicioadm');
                } else {
                    navigate('/iniciousuario');
                }
            } else {
                setError(data.mensaje || 'Error en las credenciales');
            }
        } catch (error) {
            console.error('Error:', error);
            setError('Error de conexión con el servidor');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.loginContainer}>
            <form onSubmit={handleSubmit} className={styles.loginForm}>
                <h2>Iniciar Sesión - Marloy Maquinarias</h2>
                
                {error && (
                    <div className={styles.errorMessage}>
                        {error}
                    </div>
                )}
                
                <input
                    type="email"
                    value={correo}
                    onChange={(e) => setCorreo(e.target.value)}
                    placeholder="Correo Electrónico"
                    required
                    disabled={loading}
                />
                <input
                    type="password"
                    value={contrasena}
                    onChange={(e) => setContrasena(e.target.value)}
                    placeholder="Contraseña"
                    required
                    disabled={loading}
                />
                <button type="submit" disabled={loading}>
                    {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                </button>
                
                <div className={styles.loginInfo}>
                    <p><strong>Usuarios de prueba:</strong></p>
                    <p>Admin: admin@empresa.com / admin123</p>
                    <p>Para crear más usuarios, inicia sesión como administrador</p>
                </div>
            </form>
        </div>
    );
};

export default Login;

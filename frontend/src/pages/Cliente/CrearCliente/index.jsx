import React, { useState } from 'react';
import styles from './CrearCliente.module.css';

const CrearCliente = () => {
    const [nombre, setNombre] = useState('');
    const [direccion, setDireccion] = useState('');
    const [contacto, setContacto] = useState('');
    const [correo, setCorreo] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        const cliente = {
            nombre,
            direccion,
            contacto,
            correo
        };

        fetch('http://localhost:5001/clientes/', {
            method: 'POST',
            body: JSON.stringify(cliente),
            credentials: "include"
        })
        .then(response => response.json())
        .then(data => {
            console.log('Cliente creado:', data);
            alert('Cliente creado con éxito');
            // Reset form
            setNombre('');
            setDireccion('');
            setContacto('');
            setCorreo('');
        })
        .catch((error) => {
            console.error('Error:', error);
            alert('Error al crear cliente');
        });
    };

    return (
        <div className={styles.crearClienteContainer}>
            <form onSubmit={handleSubmit} className={styles.crearClienteForm}>
                <h2>Crear Nuevo Cliente</h2>
                <input
                    type="text"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    placeholder="Nombre"
                    required
                />
                <input
                    type="text"
                    value={direccion}
                    onChange={(e) => setDireccion(e.target.value)}
                    placeholder="Dirección"
                    required
                />
                <input
                    type="text"
                    value={contacto}
                    onChange={(e) => setContacto(e.target.value)}
                    placeholder="Contacto"
                />
                <input
                    type="email"
                    value={correo}
                    onChange={(e) => setCorreo(e.target.value)}
                    placeholder="Correo Electrónico"
                />
                <button type="submit">Crear Cliente</button>
            </form>
        </div>
    );
};

export default CrearCliente; 
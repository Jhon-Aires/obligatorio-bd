import React, { useState } from 'react';
import styles from './CrearTecnico.module.css';

const CrearTecnico = () => {
    const [ci, setCi] = useState('');
    const [nombre, setNombre] = useState('');
    const [apellido, setApellido] = useState('');
    const [contacto, setContacto] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        const tecnico = {
            ci,
            nombre,
            apellido,
            contacto
        };

        fetch('http://localhost:5001/tecnicos/', {
            method: 'POST',
            body: JSON.stringify(tecnico),
        })
        .then(response => response.json())
        .then(data => {
            console.log('Tecnico creado:', data);
            alert('Tecnico creado con éxito');
            // Reset form
            setCi('');
            setNombre('');
            setApellido('');
            setContacto('');
        })
        .catch((error) => {
            console.error('Error:', error);
            alert('Error al crear tecnico');
        });
    };

    return (
        <div className={styles.crearTecnicoContainer}>
            <form onSubmit={handleSubmit} className={styles.crearTecnicoForm}>
                <h2>Crear Nuevo Tecnico</h2>
                <input
                    type="number"
                    value={ci}
                    onChange={(e) => setCi(e.target.value)}
                    placeholder="CI"
                    required
                />
                <input
                    type="text"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    placeholder="Nombre"
                    required
                />
                <input
                    type="text"
                    value={apellido}
                    onChange={(e) => setApellido(e.target.value)}
                    placeholder="Apellido"
                    required
                />
                <input
                    type="text"
                    value={contacto}
                    onChange={(e) => setContacto(e.target.value)}
                    placeholder="Contacto"
                />
                <button type="submit">Crear Tecnico</button>
            </form>
        </div>
    );
};

export default CrearTecnico;

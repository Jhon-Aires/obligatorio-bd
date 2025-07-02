import React, { useState } from 'react';
import styles from './CrearMaquina.module.css';

const CrearMaquina = () => {
    const [modelo, setModelo] = useState('');
    const [costo, setCosto] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        const maquina = {
            modelo,
            costo_alquiler_mensual: costo,
        };

        fetch('http://localhost:5001/maquinas/', {
            method: 'POST',
            body: JSON.stringify(maquina),
            credentials: "include"
        })
        .then(response => response.json())
        .then(data => {
            console.log('Maquina creada:', data);
            alert('Maquina creada con éxito');
            // Reset form
            setModelo('');
            setCosto('');
        })
        .catch((error) => {
            console.error('Error:', error);
            alert('Error al crear maquina');
        });
    };

    return (
        <div className={styles.crearMaquinaContainer}>
            <form onSubmit={handleSubmit} className={styles.crearMaquinaForm}>
                <h2>Crear Nueva Maquina</h2>
                <input
                    type="text"
                    value={modelo}
                    onChange={(e) => setModelo(e.target.value)}
                    placeholder="Modelo"
                    required
                />
                <input
                    type="number"
                    value={costo}
                    onChange={(e) => setCosto(e.target.value)}
                    placeholder="Costo Alquiler Mensual"
                    required
                />
                <button type="submit">Crear Maquina</button>
            </form>
        </div>
    );
};

export default CrearMaquina; 
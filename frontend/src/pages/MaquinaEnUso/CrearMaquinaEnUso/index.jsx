import React, { useState } from 'react';
import styles from './CrearMaquinaEnUso.module.css';

const CrearMaquinaEnUso = () => {
    const [modelo, setModelo] = useState('');
    const [idCliente, setIdCliente] = useState('');
    const [ubicacion, setUbicacion] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        const maquinaEnUso = {
            modelo,
            id_cliente: idCliente,
            ubicacion_cliente: ubicacion
        };

        fetch('http://localhost:5001/maquinas_en_uso/', {
            method: 'POST',
            body: JSON.stringify(maquinaEnUso),
        })
        .then(response => response.json())
        .then(data => {
            console.log('Maquina en uso creada:', data);
            alert('Maquina en uso creada con éxito');
            // Reset form
            setModelo('');
            setIdCliente('');
            setUbicacion('');
        })
        .catch((error) => {
            console.error('Error:', error);
            alert('Error al crear maquina en uso');
        });
    };

    return (
        <div className={styles.crearMaquinaEnUsoContainer}>
            <form onSubmit={handleSubmit} className={styles.crearMaquinaEnUsoForm}>
                <h2>Crear Nueva Maquina en Uso</h2>
                <input
                    type="text"
                    value={modelo}
                    onChange={(e) => setModelo(e.target.value)}
                    placeholder="Modelo de Maquina"
                    required
                />
                <input
                    type="number"
                    value={idCliente}
                    onChange={(e) => setIdCliente(e.target.value)}
                    placeholder="ID Cliente"
                    required
                />
                <input
                    type="text"
                    value={ubicacion}
                    onChange={(e) => setUbicacion(e.target.value)}
                    placeholder="Ubicación del Cliente"
                    required
                />
                <button type="submit">Crear Maquina en Uso</button>
            </form>
        </div>
    );
};

export default CrearMaquinaEnUso; 
import React, { useState } from 'react';
import styles from './CrearRegistroConsumo.module.css';

const CrearRegistroConsumo = () => {
    const [id, setId] = useState('');
    const [idMaquina, setIdMaquina] = useState('');
    const [idInsumo, setIdInsumo] = useState('');
    const [fecha, setFecha] = useState('');
    const [cantidad, setCantidad] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        const registro = {
            id,
            id_maquina_en_uso: idMaquina,
            id_insumo: idInsumo,
            fecha,
            cantidad_usada: cantidad,
        };

        fetch('http://localhost:5001/registro_consumo/', {
            method: 'POST',
            body: JSON.stringify(registro),
        })
        .then(response => response.json())
        .then(data => {
            console.log('Registro de consumo creado:', data);
            alert('Registro de consumo creado con éxito');
            // Reset form
            setId('');
            setIdMaquina('');
            setIdInsumo('');
            setFecha('');
            setCantidad('');
        })
        .catch((error) => {
            console.error('Error:', error);
            alert('Error al crear registro de consumo');
        });
    };

    return (
        <div className={styles.crearRegistroContainer}>
            <form onSubmit={handleSubmit} className={styles.crearRegistroForm}>
                <h2>Crear Nuevo Registro de Consumo</h2>
                <input
                    type="text"
                    value={id}
                    onChange={(e) => setId(e.target.value)}
                    placeholder="ID Registro"
                    required
                />
                <input
                    type="number"
                    value={idMaquina}
                    onChange={(e) => setIdMaquina(e.target.value)}
                    placeholder="ID Máquina en Uso"
                    required
                />
                <input
                    type="number"
                    value={idInsumo}
                    onChange={(e) => setIdInsumo(e.target.value)}
                    placeholder="ID Insumo"
                    required
                />
                <input
                    type="date"
                    value={fecha}
                    onChange={(e) => setFecha(e.target.value)}
                    placeholder="Fecha"
                    required
                />
                <input
                    type="number"
                    value={cantidad}
                    onChange={(e) => setCantidad(e.target.value)}
                    placeholder="Cantidad Usada"
                    required
                />
                <button type="submit">Crear Registro</button>
            </form>
        </div>
    );
};

export default CrearRegistroConsumo; 
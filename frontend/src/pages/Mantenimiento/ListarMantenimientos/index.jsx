import React, { useState, useEffect } from 'react';
import styles from './ListarMantenimientos.module.css';

const ListarMantenimientos = () => {
    const [mantenimientos, setMantenimientos] = useState([]);

    useEffect(() => {
        fetch('http://localhost:5001/mantenimientos/', {credentials: "include"})
            .then(response => response.json())
            .then(data => setMantenimientos(data))
            .catch(error => console.error('Error fetching mantenimientos:', error));
    }, []);

    return (
        <div className={styles.listarMantenimientosContainer}>
            <h1>Lista de Mantenimientos</h1>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>ID Máquina en Uso</th>
                        <th>CI Técnico</th>
                        <th>Tipo</th>
                        <th>Fecha</th>
                        <th>Observaciones</th>
                    </tr>
                </thead>
                <tbody>
                    {mantenimientos.map(mantenimiento => (
                        <tr key={mantenimiento.id}>
                            <td>{mantenimiento.id}</td>
                            <td>{mantenimiento.id_maquina_en_uso}</td>
                            <td>{mantenimiento.ci_tecnico}</td>
                            <td>{mantenimiento.tipo}</td>
                            <td>{mantenimiento.fecha}</td>
                            <td>{mantenimiento.observaciones}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ListarMantenimientos; 
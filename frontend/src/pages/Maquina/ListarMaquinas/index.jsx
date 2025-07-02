import React, { useState, useEffect } from 'react';
import styles from './ListarMaquinas.module.css';

const ListarMaquinas = () => {
    const [maquinas, setMaquinas] = useState([]);

    useEffect(() => {
        fetch('http://localhost:5001/maquinas/', {credentials: "include"})
            .then(response => response.json())
            .then(data => setMaquinas(data))
            .catch(error => console.error('Error fetching maquinas:', error));
    }, []);

    return (
        <div className={styles.listarMaquinasContainer}>
            <h1>Lista de Maquinas</h1>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>Modelo</th>
                        <th>Costo Alquiler Mensual</th>
                    </tr>
                </thead>
                <tbody>
                    {maquinas.map(maquina => (
                        <tr key={maquina.modelo}>
                            <td>{maquina.modelo}</td>
                            <td>{maquina.costo_alquiler_mensual}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ListarMaquinas; 
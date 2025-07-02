import React, { useState, useEffect } from 'react';
import styles from './ListarMaquinasEnUso.module.css';

const ListarMaquinasEnUso = () => {
    const [maquinas, setMaquinas] = useState([]);

    useEffect(() => {
        fetch('http://localhost:5001/maquinas_en_uso/', {
            credentials: "incluide"
        })
            .then(response => response.json())
            .then(data => setMaquinas(data))
            .catch(error => console.error('Error fetching maquinas en uso:', error));
    }, []);

    return (
        <div className={styles.listarMaquinasEnUsoContainer}>
            <h1>Lista de Maquinas en Uso</h1>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Modelo</th>
                        <th>ID Cliente</th>
                        <th>Ubicación</th>
                    </tr>
                </thead>
                <tbody>
                    {maquinas.map(maquina => (
                        <tr key={maquina.id}>
                            <td>{maquina.id}</td>
                            <td>{maquina.modelo}</td>
                            <td>{maquina.id_cliente}</td>
                            <td>{maquina.ubicacion_cliente}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ListarMaquinasEnUso; 
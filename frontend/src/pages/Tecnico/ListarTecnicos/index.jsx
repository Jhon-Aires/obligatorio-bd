import React, { useState, useEffect } from 'react';
import styles from './ListarTecnicos.module.css';

const ListarTecnicos = () => {
    const [tecnicos, setTecnicos] = useState([]);

    useEffect(() => {
        fetch('http://localhost:5001/tecnicos/')
            .then(response => response.json())
            .then(data => setTecnicos(data))
            .catch(error => console.error('Error fetching tecnicos:', error));
    }, []);

    return (
        <div className={styles.listarTecnicosContainer}>
            <h1>Lista de Tecnicos</h1>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>CI</th>
                        <th>Nombre</th>
                        <th>Apellido</th>
                        <th>Contacto</th>
                    </tr>
                </thead>
                <tbody>
                    {tecnicos.map(tecnico => (
                        <tr key={tecnico.ci}>
                            <td>{tecnico.ci}</td>
                            <td>{tecnico.nombre}</td>
                            <td>{tecnico.apellido}</td>
                            <td>{tecnico.contacto}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ListarTecnicos; 
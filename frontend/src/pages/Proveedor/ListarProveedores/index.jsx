import React, { useState, useEffect } from 'react';
import styles from './ListarProveedores.module.css';

const ListarProveedores = () => {
    const [proveedores, setProveedores] = useState([]);

    useEffect(() => {
        fetch('http://localhost:5001/proveedores/')
            .then(response => response.json())
            .then(data => setProveedores(data))
            .catch(error => console.error('Error fetching proveedores:', error));
    }, []);

    return (
        <div className={styles.listarProveedoresContainer}>
            <h1>Lista de Proveedores</h1>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Apellido</th>
                        <th>Contacto</th>
                    </tr>
                </thead>
                <tbody>
                    {proveedores.map(proveedor => (
                        <tr key={proveedor.id}>
                            <td>{proveedor.id}</td>
                            <td>{proveedor.nombre}</td>
                            <td>{proveedor.apellido}</td>
                            <td>{proveedor.contacto}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ListarProveedores; 
import React, { useState, useEffect } from "react";

import { fetchFromApi } from "../../../services/fetch";
import styles from "./ListarClientes.module.css";

const ListarClientes = () => {
  const [clientes, setClientes] = useState([]);

  useEffect(() => {
    fetchFromApi("/clientes/")
      .then((response) => response.json())
      .then((data) => setClientes(data))
      .catch((error) => console.error("Error fetching clientes:", error));
  }, []);

  return (
    <div className={styles.listarClientesContainer}>
      <h1>Lista de Clientes</h1>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Dirección</th>
            <th>Contacto</th>
            <th>Correo</th>
          </tr>
        </thead>
        <tbody>
          {clientes.map((cliente) => (
            <tr key={cliente.id}>
              <td>{cliente.id}</td>
              <td>{cliente.nombre}</td>
              <td>{cliente.direccion}</td>
              <td>{cliente.contacto}</td>
              <td>{cliente.correo}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ListarClientes;

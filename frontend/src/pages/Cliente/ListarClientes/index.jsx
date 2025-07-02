import React, { useState, useEffect } from "react";
import styles from "../../common.module.css";

import { fetchFromApi } from "../../../services/fetch";

const ListarClientes = () => {
  const [clientes, setClientes] = useState([]);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    fetchFromApi("/clientes/")
      .then((response) => response.json())
      .then((data) => setClientes(data))
      .catch((error) => {
        console.error("Error fetching clientes:", error);
        setMessage({ 
          type: "error", 
          text: "Error al cargar los clientes" 
        });
      });
  }, []);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Lista de Clientes</h1>

      <div className={styles.card}>
        {message.text && (
          <div className={`${styles.message} ${styles[message.type]}`}>
            {message.text}
          </div>
        )}

        <div className={styles.tableContainer}>
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
                  <td>{cliente.contacto || "-"}</td>
                  <td>{cliente.correo || "-"}</td>
                </tr>
              ))}
              {clientes.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center" }}>
                    No hay clientes registrados
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ListarClientes;

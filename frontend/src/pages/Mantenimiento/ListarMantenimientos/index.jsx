import React, { useState, useEffect } from "react";
import styles from "../../common.module.css";

import { fetchFromApi } from "../../../services/fetch";

const ListarMantenimientos = () => {
  const [mantenimientos, setMantenimientos] = useState([]);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    fetchFromApi("/mantenimientos/")
      .then((response) => response.json())
      .then((data) => setMantenimientos(data))
      .catch((error) => {
        console.error("Error fetching mantenimientos:", error);
        setMessage({ 
          type: "error", 
          text: "Error al cargar los mantenimientos" 
        });
      });
  }, []);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Lista de Mantenimientos</h1>

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
                <th>ID Máquina en Uso</th>
                <th>CI Técnico</th>
                <th>Tipo</th>
                <th>Fecha</th>
                <th>Observaciones</th>
              </tr>
            </thead>
            <tbody>
              {mantenimientos.map((mantenimiento) => (
                <tr key={mantenimiento.id}>
                  <td>{mantenimiento.id}</td>
                  <td>{mantenimiento.id_maquina_en_uso}</td>
                  <td>{mantenimiento.ci_tecnico}</td>
                  <td>{mantenimiento.tipo}</td>
                  <td>{mantenimiento.fecha}</td>
                  <td>{mantenimiento.observaciones}</td>
                </tr>
              ))}
              {mantenimientos.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center" }}>
                    No hay mantenimientos registrados
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

export default ListarMantenimientos;

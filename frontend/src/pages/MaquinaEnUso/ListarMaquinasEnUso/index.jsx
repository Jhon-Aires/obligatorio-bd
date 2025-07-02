import React, { useState, useEffect } from "react";
import styles from "../../common.module.css";

import { fetchFromApi } from "../../../services/fetch";

const ListarMaquinasEnUso = () => {
  const [maquinas, setMaquinas] = useState([]);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    fetchFromApi("/maquinas_en_uso/")
      .then((response) => response.json())
      .then((data) => setMaquinas(data))
      .catch((error) => {
        console.error("Error fetching maquinas en uso:", error);
        setMessage({ 
          type: "error", 
          text: "Error al cargar las máquinas en uso" 
        });
      });
  }, []);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Lista de Máquinas en Uso</h1>

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
                <th>Modelo</th>
                <th>ID Cliente</th>
                <th>Ubicación</th>
              </tr>
            </thead>
            <tbody>
              {maquinas.map((maquina) => (
                <tr key={maquina.id}>
                  <td>{maquina.id}</td>
                  <td>{maquina.modelo}</td>
                  <td>{maquina.id_cliente}</td>
                  <td>{maquina.ubicacion_cliente}</td>
                </tr>
              ))}
              {maquinas.length === 0 && (
                <tr>
                  <td colSpan="4" style={{ textAlign: "center" }}>
                    No hay máquinas en uso registradas
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

export default ListarMaquinasEnUso;

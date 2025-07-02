import React, { useState, useEffect } from "react";
import styles from "../../common.module.css";

import { fetchFromApi } from "../../../services/fetch";

const ListarMaquinas = () => {
  const [maquinas, setMaquinas] = useState([]);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    fetchFromApi("/maquinas/")
      .then((response) => response.json())
      .then((data) => setMaquinas(data))
      .catch((error) => {
        console.error("Error fetching maquinas:", error);
        setMessage({ 
          type: "error", 
          text: "Error al cargar las máquinas" 
        });
      });
  }, []);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Lista de Máquinas</h1>

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
                <th>Modelo</th>
                <th>Costo Alquiler Mensual</th>
              </tr>
            </thead>
            <tbody>
              {maquinas.map((maquina) => (
                <tr key={maquina.modelo}>
                  <td>{maquina.modelo}</td>
                  <td>{maquina.costo_alquiler_mensual}</td>
                </tr>
              ))}
              {maquinas.length === 0 && (
                <tr>
                  <td colSpan="2" style={{ textAlign: "center" }}>
                    No hay máquinas registradas
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

export default ListarMaquinas;

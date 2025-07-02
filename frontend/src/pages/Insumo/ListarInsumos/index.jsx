import React, { useState, useEffect } from "react";
import styles from "../../common.module.css";

import { fetchFromApi } from "../../../services/fetch";

const ListarInsumos = () => {
  const [insumos, setInsumos] = useState([]);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    fetchFromApi("/insumos/")
      .then((response) => response.json())
      .then((data) => setInsumos(data))
      .catch((error) => {
        console.error("Error fetching insumos:", error);
        setMessage({ 
          type: "error", 
          text: "Error al cargar los insumos" 
        });
      });
  }, []);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Lista de Insumos</h1>

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
                <th>Descripción</th>
                <th>Tipo</th>
                <th>Precio Unitario</th>
                <th>ID Proveedor</th>
              </tr>
            </thead>
            <tbody>
              {insumos.map((insumo) => (
                <tr key={insumo.id}>
                  <td>{insumo.id}</td>
                  <td>{insumo.descripcion}</td>
                  <td>{insumo.tipo}</td>
                  <td>{insumo.precio_unitario}</td>
                  <td>{insumo.id_proveedor}</td>
                </tr>
              ))}
              {insumos.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center" }}>
                    No hay insumos registrados
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

export default ListarInsumos;

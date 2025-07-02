import React, { useState, useEffect } from "react";
import styles from "../../common.module.css";

import { fetchFromApi } from "../../../services/fetch";

const ListarRegistroConsumo = () => {
  const [registros, setRegistros] = useState([]);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    fetchFromApi("/registro_consumo/")
      .then((response) => response.json())
      .then((data) => setRegistros(data))
      .catch((error) => {
        console.error("Error fetching registro_consumo:", error);
        setMessage({ 
          type: "error", 
          text: "Error al cargar los registros de consumo" 
        });
      });
  }, []);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Lista de Registros de Consumo</h1>

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
                <th>ID Insumo</th>
                <th>Fecha</th>
                <th>Cantidad Usada</th>
              </tr>
            </thead>
            <tbody>
              {registros.map((registro) => (
                <tr key={registro.id}>
                  <td>{registro.id}</td>
                  <td>{registro.id_maquina_en_uso}</td>
                  <td>{registro.id_insumo}</td>
                  <td>{registro.fecha}</td>
                  <td>{registro.cantidad_usada}</td>
                </tr>
              ))}
              {registros.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center" }}>
                    No hay registros de consumo
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

export default ListarRegistroConsumo;

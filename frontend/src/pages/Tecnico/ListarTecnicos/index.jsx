import React, { useState, useEffect } from "react";
import styles from "../../common.module.css";

import { fetchFromApi } from "../../../services/fetch";

const ListarTecnicos = () => {
  const [tecnicos, setTecnicos] = useState([]);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    fetchFromApi("/tecnicos/")
      .then((response) => response.json())
      .then((data) => setTecnicos(data))
      .catch((error) => {
        console.error("Error fetching tecnicos:", error);
        setMessage({ 
          type: "error", 
          text: "Error al cargar los técnicos" 
        });
      });
  }, []);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Lista de Técnicos</h1>

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
                <th>CI</th>
                <th>Nombre</th>
                <th>Apellido</th>
                <th>Contacto</th>
              </tr>
            </thead>
            <tbody>
              {tecnicos.map((tecnico) => (
                <tr key={tecnico.ci}>
                  <td>{tecnico.ci}</td>
                  <td>{tecnico.nombre}</td>
                  <td>{tecnico.apellido}</td>
                  <td>{tecnico.contacto}</td>
                </tr>
              ))}
              {tecnicos.length === 0 && (
                <tr>
                  <td colSpan="4" style={{ textAlign: "center" }}>
                    No hay técnicos registrados
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

export default ListarTecnicos;

import React, { useState, useEffect } from "react";

import { fetchFromApi } from "../../../services/fetch";
import styles from "./ListarRegistroConsumo.module.css";

const ListarRegistroConsumo = () => {
  const [registros, setRegistros] = useState([]);

  useEffect(() => {
    fetchFromApi("/registro_consumo/")
      .then((response) => response.json())
      .then((data) => setRegistros(data))
      .catch((error) =>
        console.error("Error fetching registro_consumo:", error)
      );
  }, []);

  return (
    <div className={styles.listarRegistrosContainer}>
      <h1>Lista de Registros de Consumo</h1>
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
        </tbody>
      </table>
    </div>
  );
};

export default ListarRegistroConsumo;

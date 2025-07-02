import React, { useState, useEffect } from "react";

import { fetchFromApi } from "../../../services/fetch";
import styles from "./ListarInsumos.module.css";

const ListarInsumos = () => {
  const [insumos, setInsumos] = useState([]);

  useEffect(() => {
    fetchFromApi("/insumos/")
      .then((response) => response.json())
      .then((data) => setInsumos(data))
      .catch((error) => console.error("Error fetching insumos:", error));
  }, []);

  return (
    <div className={styles.listarInsumosContainer}>
      <h1>Lista de Insumos</h1>
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
        </tbody>
      </table>
    </div>
  );
};

export default ListarInsumos;

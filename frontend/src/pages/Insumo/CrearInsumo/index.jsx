import React, { useState } from "react";

import { fetchFromApi } from "../../../services/fetch";
import styles from "./CrearInsumo.module.css";

const CrearInsumo = () => {
  const [descripcion, setDescripcion] = useState("");
  const [tipo, setTipo] = useState("");
  const [precioUnitario, setPrecioUnitario] = useState("");
  const [idProveedor, setIdProveedor] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    const insumo = {
      descripcion,
      tipo,
      precio_unitario: precioUnitario,
      id_proveedor: idProveedor,
    };

    fetchFromApi("/insumos/", {
      method: "POST",
      body: JSON.stringify(insumo),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Insumo creado:", data);
        if (data.error) {
          alert(`Error: ${data.error} - ${data.mensaje}`);
        } else {
          alert("Insumo creado con éxito");
          // Reset form
          setDescripcion("");
          setTipo("");
          setPrecioUnitario("");
          setIdProveedor("");
        }
      })
      .catch((error) => {
        console.error("Error completo:", error);
        alert(`Error al crear insumo: ${error.message}`);
      });
  };

  return (
    <div className={styles.crearInsumoContainer}>
      <form onSubmit={handleSubmit} className={styles.crearInsumoForm}>
        <h2>Crear Nuevo Insumo</h2>
        <input
          type='text'
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          placeholder='Descripción'
          required
        />
        <input
          type='text'
          value={tipo}
          onChange={(e) => setTipo(e.target.value)}
          placeholder='Tipo'
          required
        />
        <input
          type='number'
          value={precioUnitario}
          onChange={(e) => setPrecioUnitario(e.target.value)}
          placeholder='Precio Unitario'
          required
        />
        <input
          type='number'
          value={idProveedor}
          onChange={(e) => setIdProveedor(e.target.value)}
          placeholder='ID Proveedor'
          required
        />
        <button type='submit'>Crear Insumo</button>
      </form>
    </div>
  );
};

export default CrearInsumo;

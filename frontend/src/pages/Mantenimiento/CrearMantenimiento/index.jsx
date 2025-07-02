import React, { useState } from "react";

import { fetchFromApi } from "../../../services/fetch";
import styles from "./CrearMantenimiento.module.css";

const CrearMantenimiento = () => {
  const [idMaquina, setIdMaquina] = useState("");
  const [ciTecnico, setCiTecnico] = useState("");
  const [tipo, setTipo] = useState("");
  const [fecha, setFecha] = useState("");
  const [observaciones, setObservaciones] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    const mantenimiento = {
      id_maquina_en_uso: idMaquina,
      ci_tecnico: ciTecnico,
      tipo,
      fecha,
      observaciones,
    };

    fetchFromApi("/mantenimientos/", {
      method: "POST",
      body: JSON.stringify(mantenimiento),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Mantenimiento creado:", data);
        alert("Mantenimiento creado con éxito");
        // Reset form
        setIdMaquina("");
        setCiTecnico("");
        setTipo("");
        setFecha("");
        setObservaciones("");
      })
      .catch((error) => {
        console.error("Error:", error);

        alert("Error al crear mantenimiento");
      });
  };

  return (
    <div className={styles.crearMantenimientoContainer}>
      <form onSubmit={handleSubmit} className={styles.crearMantenimientoForm}>
        <h2>Crear Nuevo Mantenimiento</h2>
        <input
          type='number'
          value={idMaquina}
          onChange={(e) => setIdMaquina(e.target.value)}
          placeholder='ID Maquina en Uso'
          required
        />
        <input
          type='number'
          value={ciTecnico}
          onChange={(e) => setCiTecnico(e.target.value)}
          placeholder='CI Tecnico'
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
          type='date'
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
          placeholder='Fecha'
          required
        />
        <input
          type='text'
          value={observaciones}
          onChange={(e) => setObservaciones(e.target.value)}
          placeholder='Observaciones'
        />
        <button type='submit'>Crear Mantenimiento</button>
      </form>
    </div>
  );
};

export default CrearMantenimiento;

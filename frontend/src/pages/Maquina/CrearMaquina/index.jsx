import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../common.module.css";

import { fetchFromApi } from "../../../services/fetch";

const CrearMaquina = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    modelo: "",
    costo_alquiler_mensual: "",
  });
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetchFromApi("/maquinas/", {
        method: "POST",
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      
      if (data.error) {
        setMessage({ type: "error", text: `Error: ${data.error} - ${data.mensaje}` });
      } else {
        setMessage({ type: "success", text: "Máquina creada con éxito" });
        setTimeout(() => {
          navigate("/maquina/listar");
        }, 2000);
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage({ type: "error", text: "Error al crear máquina" });
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Crear Nueva Máquina</h1>
      
      <div className={styles.card}>
        {message.text && (
          <div className={`${styles.message} ${styles[message.type]}`}>
            {message.text}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="modelo" className={styles.label}>Modelo</label>
            <input
              id="modelo"
              name="modelo"
              type="text"
              value={formData.modelo}
              onChange={handleChange}
              className={styles.input}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="costo_alquiler_mensual" className={styles.label}>Costo Alquiler Mensual</label>
            <input
              id="costo_alquiler_mensual"
              name="costo_alquiler_mensual"
              type="number"
              value={formData.costo_alquiler_mensual}
              onChange={handleChange}
              className={styles.input}
              required
            />
          </div>

          <button type="submit" className={styles.button}>
            Crear Máquina
          </button>
        </form>
      </div>
    </div>
  );
};

export default CrearMaquina;

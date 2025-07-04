import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { fetchFromApi } from "../../../services/fetch";
import styles from "../../common.module.css";

const ModificarMaquina = () => {
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
    
    if (!formData.modelo) {
      setMessage({ type: "error", text: "Por favor ingrese el modelo de la máquina" });
      return;
    }
    
    if (!formData.costo_alquiler_mensual) {
      setMessage({ type: "error", text: "Por favor ingrese el nuevo costo de alquiler mensual" });
      return;
    }
    
    try {
      const response = await fetchFromApi("/maquinas/", {
        method: "PATCH",
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al modificar máquina");
      }
      
      setMessage({ type: "success", text: "Máquina modificada con éxito" });
      setTimeout(() => {
        navigate("/maquina/listar");
      }, 2000);
    } catch (error) {
      console.error("Error:", error);
      setMessage({ type: "error", text: error.message || "Error al modificar máquina" });
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Modificar Máquina</h1>
      
      <div className={styles.card}>
        {message.text && (
          <div className={`${styles.message} ${styles[message.type]}`}>
            {message.text}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="modelo" className={styles.label}>Modelo de la Máquina</label>
            <input
              id="modelo"
              name="modelo"
              type="text"
              value={formData.modelo}
              onChange={handleChange}
              className={styles.input}
              required
              placeholder="Ingrese el modelo de la máquina a modificar"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="costo_alquiler_mensual" className={styles.label}>Nuevo Costo de Alquiler Mensual</label>
            <input
              id="costo_alquiler_mensual"
              name="costo_alquiler_mensual"
              type="number"
              step="0.01"
              min="0"
              value={formData.costo_alquiler_mensual}
              onChange={handleChange}
              className={styles.input}
              required
              placeholder="Ingrese el nuevo costo de alquiler mensual"
            />
          </div>

          <button type="submit" className={styles.button}>
            Modificar Máquina
          </button>
        </form>
      </div>
    </div>
  );
};

export default ModificarMaquina;

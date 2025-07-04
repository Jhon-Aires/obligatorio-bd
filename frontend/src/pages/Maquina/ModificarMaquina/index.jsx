import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { fetchFromApi } from "../../../services/fetch";
import styles from "../../common.module.css";

const ModificarMaquina = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    id: "",
    nombre: "",
    direccion: "",
    contacto: "",
    correo: "",
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
    
    if (!formData.id) {
      setMessage({ type: "error", text: "Por favor ingrese el ID del cliente" });
      return;
    }
    
    try {
      const response = await fetchFromApi("/clientes/", {
        method: "PATCH",
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al modificar cliente");
      }
      
      setMessage({ type: "success", text: "Cliente modificado con éxito" });
      setTimeout(() => {
        navigate("/cliente/listar");
      }, 2000);
    } catch (error) {
      console.error("Error:", error);
      setMessage({ type: "error", text: error.message || "Error al modificar cliente" });
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Modificar Cliente</h1>
      
      <div className={styles.card}>
        {message.text && (
          <div className={`${styles.message} ${styles[message.type]}`}>
            {message.text}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="id" className={styles.label}>ID del Cliente</label>
            <input
              id="id"
              name="id"
              type="number"
              value={formData.id}
              onChange={handleChange}
              className={styles.input}
              required
              placeholder="Ingrese el ID del cliente a modificar"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="nombre" className={styles.label}>Nombre</label>
            <input
              id="nombre"
              name="nombre"
              type="text"
              value={formData.nombre}
              onChange={handleChange}
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="direccion" className={styles.label}>Dirección</label>
            <input
              id="direccion"
              name="direccion"
              type="text"
              value={formData.direccion}
              onChange={handleChange}
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="contacto" className={styles.label}>Contacto</label>
            <input
              id="contacto"
              name="contacto"
              type="text"
              value={formData.contacto}
              onChange={handleChange}
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="correo" className={styles.label}>Correo Electrónico</label>
            <input
              id="correo"
              name="correo"
              type="email"
              value={formData.correo}
              onChange={handleChange}
              className={styles.input}
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

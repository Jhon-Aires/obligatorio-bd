import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { fetchFromApi } from "../../../services/fetch";
import styles from "../../common.module.css";

const ModificarTecnico = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    ci: "",
    nombre: "",
    apellido: "",
    contacto: ""
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
    
    if (!formData.ci) {
      setMessage({ type: "error", text: "Por favor ingrese la cédula del técnico" });
      return;
    }
    
    try {
      const response = await fetchFromApi("/tecnicos/", {
        method: "PATCH",
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al modificar técnico");
      }
      
      setMessage({ type: "success", text: "Técnico modificado con éxito" });
      setTimeout(() => {
        navigate("/tecnico/listar");
      }, 2000);
    } catch (error) {
      console.error("Error:", error);
      setMessage({ type: "error", text: error.message || "Error al modificar técnico" });
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Modificar Técnico</h1>
      
      <div className={styles.card}>
        {message.text && (
          <div className={`${styles.message} ${styles[message.type]}`}>
            {message.text}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="ci" className={styles.label}>Cédula del Técnico</label>
            <input
              id="ci"
              name="ci"
              type="text"
              value={formData.ci}
              onChange={handleChange}
              className={styles.input}
              required
              placeholder="Ingrese la cédula del técnico a modificar"
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
              placeholder="Nuevo nombre (opcional)"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="apellido" className={styles.label}>Apellido</label>
            <input
              id="apellido"
              name="apellido"
              type="text"
              value={formData.apellido}
              onChange={handleChange}
              className={styles.input}
              placeholder="Nuevo apellido (opcional)"
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
              placeholder="Nuevo contacto (opcional)"
            />
          </div>

          <button type="submit" className={styles.button}>
            Modificar Técnico
          </button>
        </form>
      </div>
    </div>
  );
};

export default ModificarTecnico;

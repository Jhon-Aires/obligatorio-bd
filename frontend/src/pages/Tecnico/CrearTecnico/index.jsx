import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../common.module.css";

import { fetchFromApi } from "../../../services/fetch";

const CrearTecnico = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    ci: "",
    nombre: "",
    apellido: "",
    contacto: "",
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
      // Validar campos requeridos
      const requiredFields = ["ci", "nombre", "apellido"];
      const emptyFields = requiredFields.filter(field => !formData[field]);
      
      if (emptyFields.length > 0) {
        setMessage({ 
          type: "error", 
          text: `Los siguientes campos son requeridos: ${emptyFields.join(", ")}` 
        });
        return;
      }

      const response = await fetchFromApi("/tecnicos/", {
        method: "POST",
        body: JSON.stringify({
          ...formData,
          ci: Number(formData.ci)
        }),
      });
      const data = await response.json();
      
      if (data.error) {
        setMessage({ type: "error", text: `Error: ${data.error} - ${data.mensaje}` });
      } else {
        setMessage({ type: "success", text: "Técnico creado con éxito" });
        setTimeout(() => {
          navigate("/tecnico/listar");
        }, 2000);
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage({ type: "error", text: "Error al crear técnico" });
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Crear Nuevo Técnico</h1>
      
      <div className={styles.card}>
        {message.text && (
          <div className={`${styles.message} ${styles[message.type]}`}>
            {message.text}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="ci" className={styles.label}>CI</label>
            <input
              id="ci"
              name="ci"
              type="number"
              value={formData.ci}
              onChange={handleChange}
              className={styles.input}
              required
              placeholder="Ingrese la CI del técnico"
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
              required
              placeholder="Ingrese el nombre del técnico"
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
              required
              placeholder="Ingrese el apellido del técnico"
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
              placeholder="Ingrese el contacto del técnico"
            />
          </div>

          <button type="submit" className={styles.button}>
            Crear Técnico
          </button>
        </form>
      </div>
    </div>
  );
};

export default CrearTecnico;

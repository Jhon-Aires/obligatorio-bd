import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../common.module.css";

import { fetchFromApi } from "../../../services/fetch";

const ModificarUsuario = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    correo: "",
    contrasena: "",
    es_administrador: false
  });
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!formData.correo) {
      setMessage({ type: "error", text: "Por favor ingrese el correo del usuario" });
      return;
    }
    
    // Filtrar solo los campos que tienen contenido
    const dataToSend = { correo: formData.correo };
    
    if (formData.contrasena && formData.contrasena.trim() !== "") {
      dataToSend.contrasena = formData.contrasena.trim();
    }
    
    // es_administrador siempre se envía ya que es un boolean
    dataToSend.es_administrador = formData.es_administrador;
    
    // Verificar que al menos un campo adicional al correo esté presente
    if (Object.keys(dataToSend).length === 1) {
      setMessage({ type: "error", text: "Por favor ingrese al menos un campo a modificar" });
      return;
    }
    
    try {
      const response = await fetchFromApi("/login/usuarios", {
        method: "PATCH",
        body: JSON.stringify(dataToSend),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al modificar usuario");
      }
      
      setMessage({ type: "success", text: "Usuario modificado con éxito" });
      setTimeout(() => {
        navigate("/usuario/listar");
      }, 2000);
    } catch (error) {
      console.error("Error:", error);
      setMessage({ type: "error", text: error.message || "Error al modificar usuario" });
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Modificar Usuario</h1>
      
      <div className={styles.card}>
        {message.text && (
          <div className={`${styles.message} ${styles[message.type]}`}>
            {message.text}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="correo" className={styles.label}>Correo Electrónico del Usuario</label>
            <input
              id="correo"
              name="correo"
              type="email"
              value={formData.correo}
              onChange={handleChange}
              className={styles.input}
              required
              placeholder="Ingrese el correo del usuario a modificar"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="contrasena" className={styles.label}>Nueva Contraseña</label>
            <input
              id="contrasena"
              name="contrasena"
              type="password"
              value={formData.contrasena}
              onChange={handleChange}
              className={styles.input}
              placeholder="Nueva contraseña (opcional)"
            />
          </div>

          <div className={styles.formGroup}>
            <label className={`${styles.label} ${styles.checkboxLabel}`}>
              <input
                type="checkbox"
                name="es_administrador"
                checked={formData.es_administrador}
                onChange={handleChange}
                className={styles.checkbox}
              />
              Es Administrador
            </label>
          </div>

          <button type="submit" className={styles.button}>
            Modificar Usuario
          </button>
        </form>
      </div>
    </div>
  );
};

export default ModificarUsuario; 
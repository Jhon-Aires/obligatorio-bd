import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../common.module.css";

import { fetchFromApi } from "../../../services/fetch";

const CrearUsuario = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    correo: "",
    contrasena: "",
    confirmar_contrasena: "",
    es_administrador: false,
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
    try {
      // Validar campos requeridos
      const requiredFields = ["correo", "contrasena", "confirmar_contrasena"];
      const emptyFields = requiredFields.filter(field => !formData[field]);
      
      if (emptyFields.length > 0) {
        setMessage({ 
          type: "error", 
          text: `Los siguientes campos son requeridos: ${emptyFields.join(", ")}` 
        });
        return;
      }

      // Validar formato de correo
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.correo)) {
        setMessage({ 
          type: "error", 
          text: "El formato del correo electrónico no es válido" 
        });
        return;
      }

      // Validar que las contraseñas coincidan
      if (formData.contrasena !== formData.confirmar_contrasena) {
        setMessage({ 
          type: "error", 
          text: "Las contraseñas no coinciden" 
        });
        return;
      }

      // Validar longitud mínima de contraseña
      if (formData.contrasena.length < 6) {
        setMessage({ 
          type: "error", 
          text: "La contraseña debe tener al menos 6 caracteres" 
        });
        return;
      }

      const usuarioACrear = {
        correo: formData.correo,
        contrasena: formData.contrasena,
        es_administrador: formData.es_administrador
      };

      const response = await fetchFromApi("/login/", {
        method: "POST",
        body: JSON.stringify(usuarioACrear),
      });
      const data = await response.json();
      
      if (data.error) {
        setMessage({ type: "error", text: `Error: ${data.error}` });
      } else {
        setMessage({ type: "success", text: "Usuario creado con éxito" });
        setTimeout(() => {
          navigate("/usuario/listar");
        }, 2000);
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage({ type: "error", text: "Error al crear usuario" });
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Crear Nuevo Usuario</h1>
      
      <div className={styles.card}>
        {message.text && (
          <div className={`${styles.message} ${styles[message.type]}`}>
            {message.text}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="correo" className={styles.label}>Correo Electrónico</label>
            <input
              id="correo"
              name="correo"
              type="email"
              value={formData.correo}
              onChange={handleChange}
              className={styles.input}
              required
              placeholder="ejemplo@empresa.com"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="contrasena" className={styles.label}>Contraseña</label>
            <input
              id="contrasena"
              name="contrasena"
              type="password"
              value={formData.contrasena}
              onChange={handleChange}
              className={styles.input}
              required
              placeholder="Mínimo 6 caracteres"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="confirmar_contrasena" className={styles.label}>Confirmar Contraseña</label>
            <input
              id="confirmar_contrasena"
              name="confirmar_contrasena"
              type="password"
              value={formData.confirmar_contrasena}
              onChange={handleChange}
              className={styles.input}
              required
              placeholder="Repita la contraseña"
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
            Crear Usuario
          </button>
        </form>
      </div>
    </div>
  );
};

export default CrearUsuario; 
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../common.module.css";

import { fetchFromApi } from "../../../services/fetch";

const CrearProveedor = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
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
      const requiredFields = ["nombre", "apellido", "contacto"];
      const emptyFields = requiredFields.filter(field => !formData[field]);
      
      if (emptyFields.length > 0) {
        setMessage({ 
          type: "error", 
          text: `Los siguientes campos son requeridos: ${emptyFields.join(", ")}` 
        });
        return;
      }

      const proveedorACrear = {
        ...formData,
        contacto: Number(formData.contacto),
      };

      const response = await fetchFromApi("/proveedores/", {
        method: "POST",
        body: JSON.stringify(proveedorACrear),
      });
      const data = await response.json();
      
      if (data.error) {
        setMessage({ type: "error", text: `Error: ${data.error} - ${data.mensaje}` });
      } else {
        setMessage({ type: "success", text: "Proveedor creado con éxito" });
        setTimeout(() => {
          navigate("/proveedor/listar");
        }, 2000);
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage({ type: "error", text: "Error al crear proveedor" });
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Crear Nuevo Proveedor</h1>
      
      <div className={styles.card}>
        {message.text && (
          <div className={`${styles.message} ${styles[message.type]}`}>
            {message.text}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className={styles.form}>
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
              placeholder="Ingrese el nombre del proveedor"
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
              placeholder="Ingrese el apellido del proveedor"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="contacto" className={styles.label}>Contacto</label>
            <input
              id="contacto"
              name="contacto"
              type="number"
              value={formData.contacto}
              onChange={handleChange}
              className={styles.input}
              required
              placeholder="Ingrese el número de contacto"
            />
          </div>

          <button type="submit" className={styles.button}>
            Crear Proveedor
          </button>
        </form>
      </div>
    </div>
  );
};

export default CrearProveedor;

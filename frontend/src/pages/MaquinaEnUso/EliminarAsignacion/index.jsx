import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../common.module.css";

import { fetchFromApi } from "../../../services/fetch";

const EliminarAsignacion = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    id: "",
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
      setMessage({ type: "error", text: "Por favor ingrese el ID de la asignación a eliminar" });
      return;
    }
    
    try {
      const response = await fetchFromApi("/maquinas_en_uso/", {
        method: "DELETE",
        body: JSON.stringify({ id: formData.id }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al eliminar asignación");
      }
      
      setMessage({ type: "success", text: "Asignación eliminada con éxito" });
      setTimeout(() => {
        navigate("/maquinaenuso/listar");
      }, 2000);
    } catch (error) {
      console.error("Error:", error);
      setMessage({ type: "error", text: error.message || "Error al eliminar asignación" });
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Eliminar Asignación de Máquina</h1>
      
      <div className={styles.card}>
        {message.text && (
          <div className={`${styles.message} ${styles[message.type]}`}>
            {message.text}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="id" className={styles.label}>ID de la Asignación a Eliminar</label>
            <input
              id="id"
              name="id"
              type="number"
              value={formData.id}
              onChange={handleChange}
              className={styles.input}
              required
              placeholder="Ingrese el ID de la asignación a eliminar"
            />
          </div>

          <button type="submit" className={styles.button}>
            Eliminar Asignación
          </button>
        </form>
      </div>
    </div>
  );
};

export default EliminarAsignacion;

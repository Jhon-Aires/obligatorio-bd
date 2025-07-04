import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../common.module.css";

import { fetchFromApi } from "../../../services/fetch";

const EliminarMantenimiento = () => {
  const navigate = useNavigate();
  const [mantenimientos, setMantenimientos] = useState([]);
  const [selectedMantenimiento, setSelectedMantenimiento] = useState("");
  const [message, setMessage] = useState({ type: "", text: "" });

  // Cargar lista de mantenimientos al montar el componente
  useEffect(() => {
    fetchFromApi("/mantenimientos/")
      .then((response) => response.json())
      .then((data) => setMantenimientos(data))
      .catch((error) => {
        console.error("Error:", error);
        setMessage({ 
          type: "error", 
          text: "Error al cargar la lista de mantenimientos",
        });
      });
  }, []);

  const handleChange = (e) => {
    setSelectedMantenimiento(e.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!selectedMantenimiento) {
      setMessage({ type: "error", text: "Por favor seleccione un mantenimiento" });
      return;
    }

    // Confirmar antes de eliminar
    if (!window.confirm("¿Está seguro que desea eliminar este mantenimiento?")) {
      return;
    }

    try {
      const response = await fetchFromApi("/mantenimientos/", {
        method: "DELETE",
        body: JSON.stringify({
          id: parseInt(selectedMantenimiento)
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al eliminar mantenimiento");
      }
      
      setMessage({ type: "success", text: "Mantenimiento eliminado con éxito" });
      setSelectedMantenimiento(""); // Limpiar selección
      
      // Recargar lista de mantenimientos
      const updatedResponse = await fetchFromApi("/mantenimientos/");
      const updatedData = await updatedResponse.json();
      setMantenimientos(updatedData);

      // Redireccionar después de 2 segundos
      setTimeout(() => {
        navigate("/mantenimiento/listar");
      }, 2000);
    } catch (error) {
      console.error("Error:", error);
      setMessage({
        type: "error",
        text: error.message || "Error al eliminar mantenimiento",
      });
    }
  };

  // Función para formatear la fecha
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Eliminar Mantenimiento</h1>
      
      <div className={styles.card}>
        {message.text && (
          <div className={`${styles.message} ${styles[message.type]}`}>
            {message.text}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor='mantenimiento' className={styles.label}>
              Seleccionar Mantenimiento
            </label>
            <select
              id='mantenimiento'
              name='mantenimiento'
              value={selectedMantenimiento}
              onChange={handleChange}
              className={styles.input}
              required
            >
              <option value=''>Seleccione un mantenimiento</option>
              {mantenimientos.map((mantenimiento) => (
                <option key={mantenimiento.id} value={mantenimiento.id}>
                  ID: {mantenimiento.id} - Tipo: {mantenimiento.tipo} - Fecha: {formatDate(mantenimiento.fecha)}
                </option>
              ))}
            </select>
          </div>

          {selectedMantenimiento && (
            <div className={styles.warningMessage}>
              <p>⚠️ ADVERTENCIA: Esta acción eliminará permanentemente el registro de mantenimiento seleccionado.</p>
              <button type='submit' className={`${styles.button} ${styles.deleteButton}`}>
                Eliminar Mantenimiento
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default EliminarMantenimiento; 
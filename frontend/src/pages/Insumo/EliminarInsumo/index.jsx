import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../common.module.css";

import { fetchFromApi } from "../../../services/fetch";

const EliminarInsumo = () => {
  const navigate = useNavigate();
  const [insumos, setInsumos] = useState([]);
  const [selectedInsumo, setSelectedInsumo] = useState("");
  const [message, setMessage] = useState({ type: "", text: "" });

  // Cargar lista de insumos al montar el componente
  useEffect(() => {
    fetchFromApi("/insumos/")
      .then((response) => response.json())
      .then((data) => setInsumos(data))
      .catch((error) => {
        console.error("Error:", error);
        setMessage({ 
          type: "error", 
          text: "Error al cargar la lista de insumos",
        });
      });
  }, []);

  const handleChange = (e) => {
    setSelectedInsumo(e.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!selectedInsumo) {
      setMessage({ type: "error", text: "Por favor seleccione un insumo" });
      return;
    }

    // Confirmar antes de eliminar
    if (!window.confirm("¿Está seguro que desea eliminar este insumo? Esta acción eliminará también todos los registros de consumo asociados.")) {
      return;
    }

    try {
      const response = await fetchFromApi("/insumos/consumo", {
        method: "DELETE",
        body: JSON.stringify({
          id: parseInt(selectedInsumo)
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al eliminar insumo");
      }
      
      setMessage({ type: "success", text: "Insumo eliminado con éxito" });
      setSelectedInsumo(""); // Limpiar selección
      
      // Recargar lista de insumos
      const updatedResponse = await fetchFromApi("/insumos/");
      const updatedData = await updatedResponse.json();
      setInsumos(updatedData);

      // Redireccionar después de 2 segundos
      setTimeout(() => {
        navigate("/insumo/listar");
      }, 2000);
    } catch (error) {
      console.error("Error:", error);
      setMessage({
        type: "error",
        text: error.message || "Error al eliminar insumo",
      });
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Eliminar Insumo</h1>
      
      <div className={styles.card}>
        {message.text && (
          <div className={`${styles.message} ${styles[message.type]}`}>
            {message.text}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor='insumo' className={styles.label}>
              Seleccionar Insumo
            </label>
            <select
              id='insumo'
              name='insumo'
              value={selectedInsumo}
              onChange={handleChange}
              className={styles.input}
              required
            >
              <option value=''>Seleccione un insumo</option>
              {insumos.map((insumo) => (
                <option key={insumo.id} value={insumo.id}>
                  {insumo.descripcion} - {insumo.tipo} - ${insumo.precio_unitario}
                </option>
              ))}
            </select>
          </div>

          {selectedInsumo && (
            <div className={styles.warningMessage}>
              <p>⚠️ ADVERTENCIA: Esta acción eliminará permanentemente el insumo y todos sus registros de consumo asociados.</p>
              <button type='submit' className={`${styles.button} ${styles.deleteButton}`}>
                Eliminar Insumo
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default EliminarInsumo; 
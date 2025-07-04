import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../common.module.css";

import { fetchFromApi } from "../../../services/fetch";

const EliminarTecnico = () => {
  const navigate = useNavigate();
  const [tecnicos, setTecnicos] = useState([]);
  const [selectedTecnico, setSelectedTecnico] = useState("");
  const [message, setMessage] = useState({ type: "", text: "" });
  const [mantenimientosInfo, setMantenimientosInfo] = useState([]);

  // Cargar lista de técnicos al montar el componente
  useEffect(() => {
    // Cargar técnicos con su información de mantenimientos
    fetchFromApi("/tecnicos/mantenimientos")
      .then((response) => response.json())
      .then((data) => setTecnicos(data))
      .catch((error) => {
        console.error("Error:", error);
        setMessage({ 
          type: "error", 
          text: "Error al cargar la lista de técnicos",
        });
      });
  }, []);

  // Cargar mantenimientos asociados cuando se selecciona un técnico
  useEffect(() => {
    if (selectedTecnico) {
      fetchFromApi("/mantenimientos/")
        .then((response) => response.json())
        .then((data) => {
          const mantenimientosDelTecnico = data.filter(
            mantenimiento => mantenimiento.ci_tecnico === parseInt(selectedTecnico)
          );
          setMantenimientosInfo(mantenimientosDelTecnico);
        })
        .catch((error) => {
          console.error("Error:", error);
          setMessage({
            type: "error",
            text: "Error al cargar los mantenimientos asociados",
          });
        });
    } else {
      setMantenimientosInfo([]);
    }
  }, [selectedTecnico]);

  const handleChange = (e) => {
    setSelectedTecnico(e.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!selectedTecnico) {
      setMessage({ type: "error", text: "Por favor seleccione un técnico" });
      return;
    }

    // Confirmar antes de eliminar, mencionando los mantenimientos asociados
    const mensajeConfirmacion = mantenimientosInfo.length > 0
      ? `¿Está seguro que desea eliminar este técnico? Esta acción también eliminará ${mantenimientosInfo.length} registro(s) de mantenimiento asociado(s).`
      : "¿Está seguro que desea eliminar este técnico?";

    if (!window.confirm(mensajeConfirmacion)) {
      return;
    }

    try {
      const response = await fetchFromApi("/tecnicos/", {
        method: "DELETE",
        body: JSON.stringify({
          ci: parseInt(selectedTecnico)
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al eliminar técnico");
      }
      
      setMessage({ type: "success", text: "Técnico eliminado con éxito" });
      setSelectedTecnico(""); // Limpiar selección
      
      // Recargar lista de técnicos
      const updatedResponse = await fetchFromApi("/tecnicos/mantenimientos");
      const updatedData = await updatedResponse.json();
      setTecnicos(updatedData);

      // Redireccionar después de 2 segundos
      setTimeout(() => {
        navigate("/tecnico/listar");
      }, 2000);
    } catch (error) {
      console.error("Error:", error);
      setMessage({
        type: "error",
        text: error.message || "Error al eliminar técnico",
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
      <h1 className={styles.title}>Eliminar Técnico</h1>
      
      <div className={styles.card}>
        {message.text && (
          <div className={`${styles.message} ${styles[message.type]}`}>
            {message.text}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor='tecnico' className={styles.label}>
              Seleccionar Técnico
            </label>
            <select
              id='tecnico'
              name='tecnico'
              value={selectedTecnico}
              onChange={handleChange}
              className={styles.input}
              required
            >
              <option value=''>Seleccione un técnico</option>
              {tecnicos.map((tecnico) => (
                <option key={tecnico.ci} value={tecnico.ci}>
                  {tecnico.nombre} {tecnico.apellido} - CI: {tecnico.ci} - Mantenimientos: {tecnico.cantidad_mantenimientos}
                </option>
              ))}
            </select>
          </div>

          {selectedTecnico && (
            <div className={styles.warningMessage}>
              <p>⚠️ ADVERTENCIA: Esta acción eliminará permanentemente el técnico seleccionado.</p>
              {mantenimientosInfo.length > 0 && (
                <div className={styles.warningDetails}>
                  <p>Los siguientes mantenimientos también serán eliminados:</p>
                  <ul>
                    {mantenimientosInfo.map((mantenimiento) => (
                      <li key={mantenimiento.id}>
                        ID: {mantenimiento.id} - Tipo: {mantenimiento.tipo} - Fecha: {formatDate(mantenimiento.fecha)}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <button type='submit' className={`${styles.button} ${styles.deleteButton}`}>
                Eliminar Técnico
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default EliminarTecnico; 
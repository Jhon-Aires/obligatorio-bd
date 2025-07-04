import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../common.module.css";

import { fetchFromApi } from "../../../services/fetch";

const EliminarMaquina = () => {
  const navigate = useNavigate();
  const [maquinas, setMaquinas] = useState([]);
  const [selectedMaquina, setSelectedMaquina] = useState("");
  const [message, setMessage] = useState({ type: "", text: "" });
  const [maquinasEnUso, setMaquinasEnUso] = useState([]);
  const [clientes, setClientes] = useState([]);

  // Cargar lista de máquinas y clientes al montar el componente
  useEffect(() => {
    // Cargar máquinas
    fetchFromApi("/maquinas/")
      .then((response) => response.json())
      .then((data) => setMaquinas(data))
      .catch((error) => {
        console.error("Error:", error);
        setMessage({ 
          type: "error", 
          text: "Error al cargar la lista de máquinas",
        });
      });

    // Cargar clientes para mostrar nombres
    fetchFromApi("/clientes/")
      .then((response) => response.json())
      .then((data) => setClientes(data))
      .catch((error) => {
        console.error("Error:", error);
        setMessage({ 
          type: "error", 
          text: "Error al cargar los clientes",
        });
      });
  }, []);

  // Cargar máquinas en uso cuando se selecciona una máquina
  useEffect(() => {
    if (selectedMaquina) {
      fetchFromApi("/maquinas_en_uso/")
        .then((response) => response.json())
        .then((data) => {
          const maquinasDelModelo = data.filter(
            maquina => maquina.modelo === selectedMaquina
          );
          setMaquinasEnUso(maquinasDelModelo);
        })
        .catch((error) => {
          console.error("Error:", error);
          setMessage({
            type: "error",
            text: "Error al cargar las máquinas en uso",
          });
        });
    } else {
      setMaquinasEnUso([]);
    }
  }, [selectedMaquina]);

  const getClienteName = (clienteId) => {
    const cliente = clientes.find(c => c.id === clienteId);
    return cliente ? cliente.nombre : `Cliente ID: ${clienteId}`;
  };

  const handleChange = (e) => {
    setSelectedMaquina(e.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!selectedMaquina) {
      setMessage({ type: "error", text: "Por favor seleccione una máquina" });
      return;
    }

    // Si hay máquinas en uso, mostrar error
    if (maquinasEnUso.length > 0) {
      setMessage({ 
        type: "error", 
        text: `No se puede eliminar la máquina porque tiene ${maquinasEnUso.length} asignación(es) activa(s). Elimine primero las asignaciones.` 
      });
      return;
    }

    // Confirmar antes de eliminar
    if (!window.confirm("¿Está seguro que desea eliminar esta máquina? Esta acción no se puede deshacer.")) {
      return;
    }

    try {
      const response = await fetchFromApi("/maquinas/", {
        method: "DELETE",
        body: JSON.stringify({
          modelo: selectedMaquina
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al eliminar máquina");
      }
      
      setMessage({ type: "success", text: "Máquina eliminada con éxito" });
      setSelectedMaquina(""); // Limpiar selección
      
      // Recargar lista de máquinas
      const updatedResponse = await fetchFromApi("/maquinas/");
      const updatedData = await updatedResponse.json();
      setMaquinas(updatedData);

      // Redireccionar después de 2 segundos
      setTimeout(() => {
        navigate("/maquina/listar");
      }, 2000);
    } catch (error) {
      console.error("Error:", error);
      setMessage({
        type: "error",
        text: error.message || "Error al eliminar máquina",
      });
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Eliminar Máquina</h1>
      
      <div className={styles.card}>
        {message.text && (
          <div className={`${styles.message} ${styles[message.type]}`}>
            {message.text}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor='maquina' className={styles.label}>
              Seleccionar Máquina
            </label>
            <select
              id='maquina'
              name='maquina'
              value={selectedMaquina}
              onChange={handleChange}
              className={styles.input}
              required
            >
              <option value=''>Seleccione una máquina</option>
              {maquinas.map((maquina) => (
                <option key={maquina.modelo} value={maquina.modelo}>
                  {`${maquina.modelo} - Costo Alquiler: $${maquina.costo_alquiler_mensual}`}
                </option>
              ))}
            </select>
          </div>

          {selectedMaquina && (
            <div className={styles.warningMessage}>
              <p>⚠️ ADVERTENCIA: Esta acción eliminará permanentemente la máquina seleccionada.</p>
              
              {maquinasEnUso.length > 0 ? (
                <div className={styles.warningDetails}>
                  <p className={styles.errorText}>No se puede eliminar la máquina porque tiene las siguientes asignaciones activas:</p>
                  <ul>
                    {maquinasEnUso.map((maquina) => (
                      <li key={maquina.id}>
                        ID: {maquina.id} - Cliente: {getClienteName(maquina.id_cliente)} - Ubicación: {maquina.ubicacion_cliente}
                      </li>
                    ))}
                  </ul>
                  <p>Debe eliminar primero estas asignaciones antes de poder eliminar la máquina.</p>
                </div>
              ) : (
                <button type='submit' className={`${styles.button} ${styles.deleteButton}`}>
                  Eliminar Máquina
                </button>
              )}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default EliminarMaquina; 
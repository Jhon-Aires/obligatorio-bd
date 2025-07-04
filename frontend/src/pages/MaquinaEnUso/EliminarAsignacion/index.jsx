import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../common.module.css";

import { fetchFromApi } from "../../../services/fetch";

const EliminarAsignacion = () => {
  const navigate = useNavigate();
  const [asignaciones, setAsignaciones] = useState([]);
  const [selectedAsignacion, setSelectedAsignacion] = useState("");
  const [message, setMessage] = useState({ type: "", text: "" });
  const [mantenimientos, setMantenimientos] = useState([]);
  const [registrosConsumo, setRegistrosConsumo] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Cargar datos iniciales
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [maquinasResponse, clientesResponse] = await Promise.all([
          fetchFromApi("/maquinas_en_uso/"),
          fetchFromApi("/clientes/")
        ]);

        const maquinasData = await maquinasResponse.json();
        const clientesData = await clientesResponse.json();

        setAsignaciones(maquinasData);
        setClientes(clientesData);
      } catch (error) {
        console.error("Error:", error);
        setMessage({
          type: "error",
          text: "Error al cargar los datos iniciales",
        });
      }
    };

    fetchData();
  }, []);

  // Cargar dependencias cuando se selecciona una asignación
  useEffect(() => {
    if (!selectedAsignacion) {
      setMantenimientos([]);
      setRegistrosConsumo([]);
      return;
    }

    setIsLoading(true);
    Promise.all([
      // Cargar mantenimientos
      fetchFromApi("/mantenimientos/")
        .then(response => response.json())
        .then(data => data.filter(m => m.id_maquina_en_uso === parseInt(selectedAsignacion))),
      
      // Cargar registros de consumo
      fetchFromApi("/registro_consumo/")
        .then(response => response.json())
        .then(data => data.filter(r => r.id_maquina_en_uso === parseInt(selectedAsignacion)))
    ])
    .then(([mantenimientosData, registrosData]) => {
      setMantenimientos(mantenimientosData);
      setRegistrosConsumo(registrosData);
    })
    .catch((error) => {
      console.error("Error:", error);
      setMessage({
        type: "error",
        text: "Error al cargar los datos asociados",
      });
    })
    .finally(() => {
      setIsLoading(false);
    });
  }, [selectedAsignacion]);

  const getClienteName = (clienteId) => {
    const cliente = clientes.find(c => c.id === clienteId);
    return cliente ? cliente.nombre : `Cliente ID: ${clienteId}`;
  };

  const handleChange = (e) => {
    setSelectedAsignacion(e.target.value);
    setMessage({ type: "", text: "" });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!selectedAsignacion) {
      setMessage({ type: "error", text: "Por favor seleccione una asignación" });
      return;
    }

    // Construir mensaje de confirmación
    let mensajeConfirmacion = "¿Está seguro que desea eliminar esta asignación?\n\n";
    if (mantenimientos.length > 0 || registrosConsumo.length > 0) {
      mensajeConfirmacion += `Se eliminarán también:\n`;
      if (mantenimientos.length > 0) {
        mensajeConfirmacion += `- ${mantenimientos.length} mantenimiento(s)\n`;
      }
      if (registrosConsumo.length > 0) {
        mensajeConfirmacion += `- ${registrosConsumo.length} registro(s) de consumo\n`;
      }
    }
    mensajeConfirmacion += "\nEsta acción no se puede deshacer.";

    if (!window.confirm(mensajeConfirmacion)) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetchFromApi("/maquinas_en_uso/", {
        method: "DELETE",
        body: JSON.stringify({ id: parseInt(selectedAsignacion) }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al eliminar asignación");
      }
      
      setMessage({ type: "success", text: "Asignación eliminada con éxito" });
      setSelectedAsignacion("");
      
      // Recargar lista de asignaciones
      const updatedResponse = await fetchFromApi("/maquinas_en_uso/");
      const updatedData = await updatedResponse.json();
      setAsignaciones(updatedData);

      // Redireccionar después de 2 segundos
      setTimeout(() => {
        navigate("/maquinaenuso/listar");
      }, 2000);
    } catch (error) {
      console.error("Error:", error);
      setMessage({
        type: "error",
        text: error.message || "Error al eliminar asignación",
      });
    } finally {
      setIsLoading(false);
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
      <h1 className={styles.title}>Eliminar Asignación de Máquina</h1>
      
      <div className={styles.card}>
        {message.text && (
          <div 
            className={`${styles.message} ${styles[message.type]}`}
            role="alert"
            aria-live="polite"
          >
            {message.text}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="asignacion" className={styles.label}>
              Seleccionar Asignación
            </label>
            <select
              id="asignacion"
              name="asignacion"
              value={selectedAsignacion}
              onChange={handleChange}
              className={styles.input}
              required
              disabled={isLoading}
              aria-disabled={isLoading}
            >
              <option value="">Seleccione una asignación</option>
              {asignaciones.map((asignacion) => (
                <option key={asignacion.id} value={asignacion.id}>
                  {`ID: ${asignacion.id} - Modelo: ${asignacion.modelo} - Cliente: ${getClienteName(asignacion.id_cliente)} - Ubicación: ${asignacion.ubicacion_cliente}`}
                </option>
              ))}
            </select>
          </div>

          {selectedAsignacion && !isLoading && (
            <div className={styles.warningMessage}>
              <p>⚠️ ADVERTENCIA: Esta acción eliminará permanentemente la asignación seleccionada.</p>
              
              {(mantenimientos.length > 0 || registrosConsumo.length > 0) && (
                <div className={styles.warningDetails}>
                  {mantenimientos.length > 0 && (
                    <>
                      <h3>Mantenimientos que serán eliminados:</h3>
                      <ul>
                        {mantenimientos.map((mantenimiento) => (
                          <li key={mantenimiento.id}>
                            ID: {mantenimiento.id} - Tipo: {mantenimiento.tipo} - Fecha: {formatDate(mantenimiento.fecha)}
                          </li>
                        ))}
                      </ul>
                    </>
                  )}

                  {registrosConsumo.length > 0 && (
                    <>
                      <h3>Registros de consumo que serán eliminados:</h3>
                      <ul>
                        {registrosConsumo.map((registro) => (
                          <li key={registro.id}>
                            ID: {registro.id} - Cantidad: {registro.cantidad_usada} - Fecha: {formatDate(registro.fecha)}
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              )}

              <button 
                type="submit" 
                className={`${styles.button} ${styles.deleteButton}`}
                disabled={isLoading}
                aria-disabled={isLoading}
              >
                {isLoading ? "Eliminando..." : "Eliminar Asignación"}
              </button>
            </div>
          )}

          {isLoading && (
            <div className={styles.loadingMessage}>
              Cargando datos asociados...
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default EliminarAsignacion;

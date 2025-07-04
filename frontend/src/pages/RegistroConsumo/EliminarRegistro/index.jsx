import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../common.module.css";

import { fetchFromApi } from "../../../services/fetch";

const EliminarRegistroConsumo = () => {
  const navigate = useNavigate();
  const [registros, setRegistros] = useState([]);
  const [selectedRegistro, setSelectedRegistro] = useState("");
  const [message, setMessage] = useState({ type: "", text: "" });
  const [maquinasEnUso, setMaquinasEnUso] = useState([]);
  const [insumos, setInsumos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Cargar datos iniciales
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [registrosResponse, maquinasResponse, insumosResponse, clientesResponse] = await Promise.all([
          fetchFromApi("/registro_consumo/"),
          fetchFromApi("/maquinas_en_uso/"),
          fetchFromApi("/insumos/"),
          fetchFromApi("/clientes/")
        ]);

        const [registrosData, maquinasData, insumosData, clientesData] = await Promise.all([
          registrosResponse.json(),
          maquinasResponse.json(),
          insumosResponse.json(),
          clientesResponse.json()
        ]);

        setRegistros(registrosData);
        setMaquinasEnUso(maquinasData);
        setInsumos(insumosData);
        setClientes(clientesData);
      } catch (error) {
        console.error("Error:", error);
        setMessage({
          type: "error",
          text: "Error al cargar los datos iniciales",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const getInsumoInfo = (insumoId) => {
    const insumo = insumos.find(i => i.id === insumoId);
    return insumo ? `${insumo.descripcion} - ${insumo.tipo}` : 'Insumo no encontrado';
  };

  const getMaquinaInfo = (maquinaId) => {
    const maquina = maquinasEnUso.find(m => m.id === maquinaId);
    if (!maquina) return 'Máquina no encontrada';

    const cliente = clientes.find(c => c.id === maquina.id_cliente);
    const clienteNombre = cliente ? cliente.nombre : 'Cliente no encontrado';

    return `${maquina.modelo} - Cliente: ${clienteNombre} - Ubicación: ${maquina.ubicacion_cliente}`;
  };

  const handleChange = (e) => {
    setSelectedRegistro(e.target.value);
    setMessage({ type: "", text: "" });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!selectedRegistro) {
      setMessage({ type: "error", text: "Por favor seleccione un registro" });
      return;
    }

    if (!window.confirm("¿Está seguro que desea eliminar este registro de consumo? Esta acción no se puede deshacer.")) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetchFromApi("/registro_consumo/", {
        method: "DELETE",
        body: JSON.stringify({ id: parseInt(selectedRegistro) }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al eliminar registro");
      }

      setMessage({ type: "success", text: "Registro de consumo eliminado con éxito" });
      setSelectedRegistro("");
      
      // Recargar lista de registros
      const updatedResponse = await fetchFromApi("/registro_consumo/");
      const updatedData = await updatedResponse.json();
      setRegistros(updatedData);

      setTimeout(() => {
        navigate("/registroconsumo/listar");
      }, 2000);
    } catch (error) {
      console.error("Error:", error);
      setMessage({
        type: "error",
        text: error.message || "Error al eliminar registro de consumo",
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
      day: '2-digit'
    });
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Eliminar Registro de Consumo</h1>

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
            <label htmlFor="registro" className={styles.label}>
              Seleccionar Registro de Consumo
            </label>
            <select
              id="registro"
              name="registro"
              value={selectedRegistro}
              onChange={handleChange}
              className={styles.input}
              required
              disabled={isLoading}
              aria-disabled={isLoading}
            >
              <option value="">Seleccione un registro</option>
              {registros.map((registro) => (
                <option key={registro.id} value={registro.id}>
                  {`ID: ${registro.id} - Fecha: ${formatDate(registro.fecha)} - Cantidad: ${registro.cantidad_usada}`}
                </option>
              ))}
            </select>
          </div>

          {selectedRegistro && !isLoading && (
            <div className={styles.warningMessage}>
              <p>⚠️ ADVERTENCIA: Esta acción eliminará permanentemente el registro seleccionado.</p>
              
              {registros.find(r => r.id === parseInt(selectedRegistro)) && (
                <div className={styles.warningDetails}>
                  <h3>Detalles del registro a eliminar:</h3>
                  <div className={styles.detailsGrid}>
                    <p><strong>Insumo:</strong> {getInsumoInfo(registros.find(r => r.id === parseInt(selectedRegistro)).id_insumo)}</p>
                    <p><strong>Máquina:</strong> {getMaquinaInfo(registros.find(r => r.id === parseInt(selectedRegistro)).id_maquina_en_uso)}</p>
                  </div>
                </div>
              )}

              <button 
                type="submit" 
                className={`${styles.button} ${styles.deleteButton}`}
                disabled={isLoading}
                aria-disabled={isLoading}
              >
                {isLoading ? "Eliminando..." : "Eliminar Registro"}
              </button>
            </div>
          )}

          {isLoading && (
            <div className={styles.loadingMessage}>
              Cargando datos...
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default EliminarRegistroConsumo;

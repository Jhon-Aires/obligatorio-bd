import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../common.module.css";

import { fetchFromApi } from "../../../services/fetch";

const ModificarMantenimiento = () => {
  const navigate = useNavigate();
  const [mantenimientos, setMantenimientos] = useState([]);
  const [selectedMantenimiento, setSelectedMantenimiento] = useState("");
  const [maquinasEnUso, setMaquinasEnUso] = useState([]);
  const [tecnicos, setTecnicos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    id: "",
    id_maquina_en_uso: "",
    ci_tecnico: "",
    tipo: "",
    fecha: "",
    observaciones: ""
  });

  // Cargar datos iniciales
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [mantenimientosRes, maquinasRes, tecnicosRes, clientesRes] = await Promise.all([
          fetchFromApi("/mantenimientos/"),
          fetchFromApi("/maquinas_en_uso/"),
          fetchFromApi("/tecnicos/"),
          fetchFromApi("/clientes/")
        ]);

        const [mantenimientosData, maquinasData, tecnicosData, clientesData] = await Promise.all([
          mantenimientosRes.json(),
          maquinasRes.json(),
          tecnicosRes.json(),
          clientesRes.json()
        ]);

        setMantenimientos(mantenimientosData);
        setMaquinasEnUso(maquinasData);
        setTecnicos(tecnicosData);
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

  // Cargar datos del mantenimiento seleccionado
  useEffect(() => {
    if (!selectedMantenimiento) {
      setFormData({
        id: "",
        id_maquina_en_uso: "",
        ci_tecnico: "",
        tipo: "",
        fecha: "",
        observaciones: ""
      });
      return;
    }

    const mantenimiento = mantenimientos.find(m => m.id === parseInt(selectedMantenimiento));
    if (!mantenimiento) return;

    // Formatear la fecha para el input type="date"
    const fecha = new Date(mantenimiento.fecha);
    const fechaFormateada = fecha.toISOString().split('T')[0];

    setFormData({
      id: mantenimiento.id,
      id_maquina_en_uso: mantenimiento.id_maquina_en_uso,
      ci_tecnico: mantenimiento.ci_tecnico,
      tipo: mantenimiento.tipo,
      fecha: fechaFormateada,
      observaciones: mantenimiento.observaciones || ""
    });
  }, [selectedMantenimiento, mantenimientos]);

  const getMaquinaInfo = (maquinaId) => {
    const maquina = maquinasEnUso.find(m => m.id === maquinaId);
    if (!maquina) return 'Máquina no encontrada';

    const cliente = clientes.find(c => c.id === maquina.id_cliente);
    const clienteNombre = cliente ? cliente.nombre : 'Cliente no encontrado';

    return `${maquina.modelo} - Cliente: ${clienteNombre} - Ubicación: ${maquina.ubicacion_cliente}`;
  };

  const getTecnicoInfo = (ci) => {
    const tecnico = tecnicos.find(t => t.ci === ci);
    return tecnico ? `${tecnico.nombre} ${tecnico.apellido} - CI: ${tecnico.ci}` : 'Técnico no encontrado';
  };

  const handleMantenimientoSelect = (e) => {
    setSelectedMantenimiento(e.target.value);
    setMessage({ type: "", text: "" });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.id_maquina_en_uso) {
      setMessage({ type: "error", text: "Debe seleccionar una máquina" });
      return false;
    }

    if (!formData.ci_tecnico) {
      setMessage({ type: "error", text: "Debe seleccionar un técnico" });
      return false;
    }

    if (!formData.tipo.trim()) {
      setMessage({ type: "error", text: "El tipo de mantenimiento es requerido" });
      return false;
    }

    if (!formData.fecha) {
      setMessage({ type: "error", text: "La fecha es requerida" });
      return false;
    }

    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!selectedMantenimiento) {
      setMessage({ type: "error", text: "Por favor seleccione un mantenimiento" });
      return;
    }

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const response = await fetchFromApi("/mantenimientos/", {
        method: "PATCH",
        body: JSON.stringify({
          id: parseInt(selectedMantenimiento),
          id_maquina_en_uso: parseInt(formData.id_maquina_en_uso),
          ci_tecnico: parseInt(formData.ci_tecnico),
          tipo: formData.tipo,
          fecha: formData.fecha,
          observaciones: formData.observaciones
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al modificar mantenimiento");
      }
      
      setMessage({ type: "success", text: "Mantenimiento modificado con éxito" });
      
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
        text: error.message || "Error al modificar mantenimiento",
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
      <h1 className={styles.title}>Modificar Mantenimiento</h1>
      
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
            <label htmlFor="mantenimiento" className={styles.label}>
              Seleccionar Mantenimiento
            </label>
            <select
              id="mantenimiento"
              name="mantenimiento"
              value={selectedMantenimiento}
              onChange={handleMantenimientoSelect}
              className={styles.input}
              required
              disabled={isLoading}
              aria-disabled={isLoading}
            >
              <option value="">Seleccione un mantenimiento</option>
              {mantenimientos.map((mantenimiento) => (
                <option key={mantenimiento.id} value={mantenimiento.id}>
                  {`ID: ${mantenimiento.id} - ${mantenimiento.tipo} - Fecha: ${formatDate(mantenimiento.fecha)}`}
                </option>
              ))}
            </select>
          </div>

          {selectedMantenimiento && (
            <>
              <div className={styles.formGroup}>
                <label htmlFor="id_maquina_en_uso" className={styles.label}>
                  Máquina
                </label>
                <select
                  id="id_maquina_en_uso"
                  name="id_maquina_en_uso"
                  value={formData.id_maquina_en_uso}
                  onChange={handleChange}
                  className={styles.input}
                  required
                  disabled={isLoading}
                  aria-disabled={isLoading}
                >
                  <option value="">Seleccione una máquina</option>
                  {maquinasEnUso.map((maquina) => (
                    <option key={maquina.id} value={maquina.id}>
                      {getMaquinaInfo(maquina.id)}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="ci_tecnico" className={styles.label}>
                  Técnico
                </label>
                <select
                  id="ci_tecnico"
                  name="ci_tecnico"
                  value={formData.ci_tecnico}
                  onChange={handleChange}
                  className={styles.input}
                  required
                  disabled={isLoading}
                  aria-disabled={isLoading}
                >
                  <option value="">Seleccione un técnico</option>
                  {tecnicos.map((tecnico) => (
                    <option key={tecnico.ci} value={tecnico.ci}>
                      {getTecnicoInfo(tecnico.ci)}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="tipo" className={styles.label}>
                  Tipo de Mantenimiento
                </label>
                <input
                  id="tipo"
                  name="tipo"
                  type="text"
                  value={formData.tipo}
                  onChange={handleChange}
                  className={styles.input}
                  required
                  disabled={isLoading}
                  maxLength={50}
                  placeholder="Tipo de mantenimiento"
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="fecha" className={styles.label}>
                  Fecha
                </label>
                <input
                  id="fecha"
                  name="fecha"
                  type="date"
                  value={formData.fecha}
                  onChange={handleChange}
                  className={styles.input}
                  required
                  disabled={isLoading}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="observaciones" className={styles.label}>
                  Observaciones
                </label>
                <textarea
                  id="observaciones"
                  name="observaciones"
                  value={formData.observaciones}
                  onChange={handleChange}
                  className={styles.input}
                  disabled={isLoading}
                  rows={4}
                  maxLength={255}
                  placeholder="Observaciones del mantenimiento"
                />
              </div>

              <button 
                type="submit" 
                className={styles.button}
                disabled={isLoading}
                aria-disabled={isLoading}
              >
                {isLoading ? "Modificando..." : "Modificar Mantenimiento"}
              </button>
            </>
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

export default ModificarMantenimiento; 
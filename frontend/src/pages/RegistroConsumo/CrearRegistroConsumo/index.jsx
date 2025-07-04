import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../common.module.css";

import { fetchFromApi } from "../../../services/fetch";

const CrearRegistroConsumo = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    id: "",
    id_maquina_en_uso: "",
    id_insumo: "",
    fecha: "",
    cantidad_usada: "",
  });
  const [message, setMessage] = useState({ type: "", text: "" });
  const [maquinasEnUso, setMaquinasEnUso] = useState([]);
  const [insumos, setInsumos] = useState([]);
  const [clientes, setClientes] = useState([]);

  useEffect(() => {
    // Cargar máquinas en uso
    fetchFromApi("/maquinas_en_uso/")
      .then((response) => response.json())
      .then((data) => setMaquinasEnUso(data))
      .catch((error) => {
        console.error("Error fetching maquinas en uso:", error);
        setMessage({
          type: "error",
          text: "Error al cargar las máquinas en uso"
        });
      });

    // Cargar insumos
    fetchFromApi("/insumos/")
      .then((response) => response.json())
      .then((data) => setInsumos(data))
      .catch((error) => {
        console.error("Error fetching insumos:", error);
        setMessage({
          type: "error",
          text: "Error al cargar los insumos"
        });
      });

    // Cargar clientes para mostrar nombres en lugar de IDs
    fetchFromApi("/clientes/")
      .then((response) => response.json())
      .then((data) => setClientes(data))
      .catch((error) => {
        console.error("Error fetching clientes:", error);
        setMessage({
          type: "error",
          text: "Error al cargar los clientes"
        });
      });
  }, []);

  // Función para obtener el nombre del cliente por ID
  const getClienteName = (clienteId) => {
    const cliente = clientes.find(c => c.id === clienteId);
    return cliente ? cliente.nombre : `Cliente ID: ${clienteId}`;
  };

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
      const response = await fetchFromApi("/registro_consumo/", {
        method: "POST",
        body: JSON.stringify(formData),
      });
      const data = await response.json();

      if (data.error) {
        setMessage({ type: "error", text: `Error: ${data.error} - ${data.mensaje}` });
      } else {
        setMessage({ type: "success", text: "Registro de consumo creado con éxito" });
        setTimeout(() => {
          navigate("/registro-consumo/listar");
        }, 2000);
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage({ type: "error", text: "Error al crear registro de consumo" });
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Crear Nuevo Registro de Consumo</h1>

      <div className={styles.card}>
        {message.text && (
          <div className={`${styles.message} ${styles[message.type]}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="id_maquina_en_uso" className={styles.label}>Máquina en Uso</label>
            <select
              id="id_maquina_en_uso"
              name="id_maquina_en_uso"
              value={formData.id_maquina_en_uso}
              onChange={handleChange}
              className={styles.input}
              required
            >
              <option value="">Seleccione una máquina</option>
              {maquinasEnUso.map((maquina) => (
                <option key={maquina.id} value={maquina.id}>
                  {`Modelo: ${maquina.modelo} - ${getClienteName(maquina.id_cliente)} - Ubicación: ${maquina.ubicacion_cliente}`}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="id_insumo" className={styles.label}>Insumo</label>
            <select
              id="id_insumo"
              name="id_insumo"
              value={formData.id_insumo}
              onChange={handleChange}
              className={styles.input}
              required
            >
              <option value="">Seleccione un insumo</option>
              {insumos.map((insumo) => (
                <option key={insumo.id} value={insumo.id}>
                  {`${insumo.descripcion} - Tipo: ${insumo.tipo} - Precio: $${insumo.precio_unitario}`}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="fecha" className={styles.label}>Fecha</label>
            <input
              id="fecha"
              name="fecha"
              type="date"
              value={formData.fecha}
              onChange={handleChange}
              className={styles.input}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="cantidad_usada" className={styles.label}>Cantidad Usada</label>
            <input
              id="cantidad_usada"
              name="cantidad_usada"
              type="number"
              value={formData.cantidad_usada}
              onChange={handleChange}
              className={styles.input}
              required
            />
          </div>

          <button type="submit" className={styles.button}>
            Crear Registro
          </button>
        </form>
      </div>
    </div>
  );
};

export default CrearRegistroConsumo;

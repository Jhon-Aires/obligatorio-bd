import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../common.module.css";

import { fetchFromApi } from "../../../services/fetch";

const CrearMaquinaEnUso = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    modelo: "",
    id_cliente: "",
    ubicacion_cliente: "",
  });
  const [message, setMessage] = useState({ type: "", text: "" });
  const [maquinas, setMaquinas] = useState([]);
  const [clientes, setClientes] = useState([]);

  useEffect(() => {
    // Cargar máquinas
    fetchFromApi("/maquinas/")
      .then((response) => response.json())
      .then((data) => setMaquinas(data))
      .catch((error) => {
        console.error("Error fetching maquinas:", error);
        setMessage({ 
          type: "error", 
          text: "Error al cargar las máquinas" 
        });
      });

    // Cargar clientes
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
      const requiredFields = ["modelo", "id_cliente", "ubicacion_cliente"];
      const emptyFields = requiredFields.filter(field => !formData[field]);
      
      if (emptyFields.length > 0) {
        setMessage({ 
          type: "error", 
          text: `Los siguientes campos son requeridos: ${emptyFields.join(", ")}` 
        });
        return;
      }

      const maquinaEnUsoACrear = {
        ...formData,
        id_cliente: Number(formData.id_cliente)
      };

      const response = await fetchFromApi("/maquinas_en_uso/", {
        method: "POST",
        body: JSON.stringify(maquinaEnUsoACrear),
      });
      const data = await response.json();
      
      if (data.error) {
        setMessage({ type: "error", text: `Error: ${data.error} - ${data.mensaje}` });
      } else {
        setMessage({ type: "success", text: "Máquina en uso creada con éxito" });
        setTimeout(() => {
          navigate("/maquinaenuso/listar");
        }, 2000);
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage({ type: "error", text: "Error al crear máquina en uso" });
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Crear Nueva Máquina en Uso</h1>
      
      <div className={styles.card}>
        {message.text && (
          <div className={`${styles.message} ${styles[message.type]}`}>
            {message.text}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="modelo" className={styles.label}>Modelo de Máquina</label>
            <select
              id="modelo"
              name="modelo"
              value={formData.modelo}
              onChange={handleChange}
              className={styles.input}
              required
            >
              <option value="">Seleccione un modelo</option>
              {maquinas.map((maquina) => (
                <option key={maquina.modelo} value={maquina.modelo}>
                  {maquina.modelo}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="id_cliente" className={styles.label}>Cliente</label>
            <select
              id="id_cliente"
              name="id_cliente"
              value={formData.id}
              onChange={handleChange}
              className={styles.input}
              required
            >
              <option value="">Seleccione un cliente</option>
              {clientes.map((cliente) => (
                <option key={cliente.id} value={cliente.id}>
                  {`${cliente.nombre} - ID: ${cliente.id}`}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="ubicacion_cliente" className={styles.label}>Ubicación del Cliente</label>
            <input
              id="ubicacion_cliente"
              name="ubicacion_cliente"
              type="text"
              value={formData.ubicacion_cliente}
              onChange={handleChange}
              className={styles.input}
              required
              placeholder="Ingrese la ubicación del cliente"
            />
          </div>

          <button type="submit" className={styles.button}>
            Crear Máquina en Uso
          </button>
        </form>
      </div>
    </div>
  );
};

export default CrearMaquinaEnUso;

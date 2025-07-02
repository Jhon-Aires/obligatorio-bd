import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../common.module.css";

import { fetchFromApi } from "../../../services/fetch";

const CrearMantenimiento = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    id_maquina_en_uso: "",
    ci_tecnico: "",
    tipo: "",
    fecha: "",
    observaciones: "",
  });
  const [message, setMessage] = useState({ type: "", text: "" });
  const [maquinasEnUso, setMaquinasEnUso] = useState([]);
  const [tecnicos, setTecnicos] = useState([]);

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

    // Cargar técnicos
    fetchFromApi("/tecnicos/")
      .then((response) => response.json())
      .then((data) => setTecnicos(data))
      .catch((error) => {
        console.error("Error fetching tecnicos:", error);
        setMessage({ 
          type: "error", 
          text: "Error al cargar los técnicos" 
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
      const requiredFields = ["id_maquina_en_uso", "ci_tecnico", "tipo", "fecha"];
      const emptyFields = requiredFields.filter(field => !formData[field]);
      
      if (emptyFields.length > 0) {
        setMessage({ 
          type: "error", 
          text: `Los siguientes campos son requeridos: ${emptyFields.join(", ")}` 
        });
        return;
      }

      const mantenimientoACrear = {
        ...formData,
        id_maquina_en_uso: Number(formData.id_maquina_en_uso),
        ci_tecnico: Number(formData.ci_tecnico)
      };

      const response = await fetchFromApi("/mantenimientos/", {
        method: "POST",
        body: JSON.stringify(mantenimientoACrear),
      });
      const data = await response.json();
      
      if (data.error) {
        setMessage({ type: "error", text: `Error: ${data.error} - ${data.mensaje}` });
      } else {
        setMessage({ type: "success", text: "Mantenimiento creado con éxito" });
        setTimeout(() => {
          navigate("/mantenimiento/listar");
        }, 2000);
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage({ type: "error", text: "Error al crear mantenimiento" });
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Crear Nuevo Mantenimiento</h1>
      
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
                  {`ID: ${maquina.id} - Cliente: ${maquina.id_cliente}`}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="ci_tecnico" className={styles.label}>Técnico</label>
            <select
              id="ci_tecnico"
              name="ci_tecnico"
              value={formData.ci_tecnico}
              onChange={handleChange}
              className={styles.input}
              required
            >
              <option value="">Seleccione un técnico</option>
              {tecnicos.map((tecnico) => (
                <option key={tecnico.ci} value={tecnico.ci}>
                  {`${tecnico.nombre} ${tecnico.apellido} - CI: ${tecnico.ci}`}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="tipo" className={styles.label}>Tipo</label>
            <input
              id="tipo"
              name="tipo"
              type="text"
              value={formData.tipo}
              onChange={handleChange}
              className={styles.input}
              required
              placeholder="Ingrese el tipo de mantenimiento"
            />
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
            <label htmlFor="observaciones" className={styles.label}>Observaciones</label>
            <textarea
              id="observaciones"
              name="observaciones"
              value={formData.observaciones}
              onChange={handleChange}
              className={styles.input}
              rows="3"
              placeholder="Ingrese las observaciones del mantenimiento"
            />
          </div>

          <button type="submit" className={styles.button}>
            Crear Mantenimiento
          </button>
        </form>
      </div>
    </div>
  );
};

export default CrearMantenimiento;

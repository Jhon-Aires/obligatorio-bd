import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../common.module.css";

import { fetchFromApi } from "../../../services/fetch";

const CrearInsumo = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    descripcion: "",
    tipo: "",
    precio_unitario: "",
    id_proveedor: "",
  });
  const [message, setMessage] = useState({ type: "", text: "" });
  const [proveedores, setProveedores] = useState([]);

  useEffect(() => {
    // Cargar proveedores
    fetchFromApi("/proveedores/")
      .then((response) => response.json())
      .then((data) => setProveedores(data))
      .catch((error) => {
        console.error("Error fetching proveedores:", error);
        setMessage({ 
          type: "error", 
          text: "Error al cargar los proveedores" 
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
      const requiredFields = ["descripcion", "tipo", "precio_unitario", "id_proveedor"];
      const emptyFields = requiredFields.filter(field => !formData[field]);
      
      if (emptyFields.length > 0) {
        setMessage({ 
          type: "error", 
          text: `Los siguientes campos son requeridos: ${emptyFields.join(", ")}` 
        });
        return;
      }

      const insumoACrear = {
        ...formData,
        precio_unitario: Number(formData.precio_unitario),
        id_proveedor: Number(formData.id_proveedor)
      };

      const response = await fetchFromApi("/insumos/", {
        method: "POST",
        body: JSON.stringify(insumoACrear),
      });
      const data = await response.json();
      
      if (data.error) {
        setMessage({ type: "error", text: `Error: ${data.error} - ${data.mensaje}` });
      } else {
        setMessage({ type: "success", text: "Insumo creado con éxito" });
        setTimeout(() => {
          navigate("/insumo/listar");
        }, 2000);
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage({ type: "error", text: "Error al crear insumo" });
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Crear Nuevo Insumo</h1>
      
      <div className={styles.card}>
        {message.text && (
          <div className={`${styles.message} ${styles[message.type]}`}>
            {message.text}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="descripcion" className={styles.label}>Descripción</label>
            <input
              id="descripcion"
              name="descripcion"
              type="text"
              value={formData.descripcion}
              onChange={handleChange}
              className={styles.input}
              required
              placeholder="Ingrese la descripción del insumo"
            />
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
              placeholder="Ingrese el tipo de insumo"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="precio_unitario" className={styles.label}>Precio Unitario</label>
            <input
              id="precio_unitario"
              name="precio_unitario"
              type="number"
              value={formData.precio_unitario}
              onChange={handleChange}
              className={styles.input}
              required
              placeholder="Ingrese el precio unitario"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="id_proveedor" className={styles.label}>Proveedor</label>
            <select
              id="id_proveedor"
              name="id_proveedor"
              value={formData.id_proveedor}
              onChange={handleChange}
              className={styles.input}
              required
            >
              <option value="">Seleccione un proveedor</option>
              {proveedores.map((proveedor) => (
                <option key={proveedor.id} value={proveedor.id}>
                  {`${proveedor.nombre} ${proveedor.apellido} - Contacto: ${proveedor.contacto}`}
                </option>
              ))}
            </select>
          </div>

          <button type="submit" className={styles.button}>
            Crear Insumo
          </button>
        </form>
      </div>
    </div>
  );
};

export default CrearInsumo;

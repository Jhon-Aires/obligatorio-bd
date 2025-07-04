import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../common.module.css";

import { fetchFromApi } from "../../../services/fetch";

const EliminarProveedor = () => {
  const navigate = useNavigate();
  const [proveedores, setProveedores] = useState([]);
  const [selectedProveedor, setSelectedProveedor] = useState("");
  const [message, setMessage] = useState({ type: "", text: "" });
  const [insumosAsociados, setInsumosAsociados] = useState([]);

  // Cargar lista de proveedores al montar el componente
  useEffect(() => {
    fetchFromApi("/proveedores/")
      .then((response) => response.json())
      .then((data) => setProveedores(data))
      .catch((error) => {
        console.error("Error:", error);
        setMessage({ 
          type: "error", 
          text: "Error al cargar la lista de proveedores",
        });
      });
  }, []);

  // Cargar insumos asociados cuando se selecciona un proveedor
  useEffect(() => {
    if (selectedProveedor) {
      fetchFromApi("/insumos/")
        .then((response) => response.json())
        .then((data) => {
          const insumosDelProveedor = data.filter(
            insumo => insumo.id_proveedor === parseInt(selectedProveedor)
          );
          setInsumosAsociados(insumosDelProveedor);
        })
        .catch((error) => {
          console.error("Error:", error);
          setMessage({
            type: "error",
            text: "Error al cargar los insumos asociados",
          });
        });
    } else {
      setInsumosAsociados([]);
    }
  }, [selectedProveedor]);

  const handleChange = (e) => {
    setSelectedProveedor(e.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!selectedProveedor) {
      setMessage({ type: "error", text: "Por favor seleccione un proveedor" });
      return;
    }

    // Confirmar antes de eliminar, mencionando los insumos asociados
    const mensajeConfirmacion = insumosAsociados.length > 0
      ? `¿Está seguro que desea eliminar este proveedor? Esta acción también eliminará ${insumosAsociados.length} insumo(s) asociado(s).`
      : "¿Está seguro que desea eliminar este proveedor?";

    if (!window.confirm(mensajeConfirmacion)) {
      return;
    }

    try {
      const response = await fetchFromApi("/proveedores/", {
        method: "DELETE",
        body: JSON.stringify({
          id: parseInt(selectedProveedor)
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al eliminar proveedor");
      }
      
      setMessage({ type: "success", text: "Proveedor eliminado con éxito" });
      setSelectedProveedor(""); // Limpiar selección
      
      // Recargar lista de proveedores
      const updatedResponse = await fetchFromApi("/proveedores/");
      const updatedData = await updatedResponse.json();
      setProveedores(updatedData);

      // Redireccionar después de 2 segundos
      setTimeout(() => {
        navigate("/proveedor/listar");
      }, 2000);
    } catch (error) {
      console.error("Error:", error);
      setMessage({
        type: "error",
        text: error.message || "Error al eliminar proveedor",
      });
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Eliminar Proveedor</h1>
      
      <div className={styles.card}>
        {message.text && (
          <div className={`${styles.message} ${styles[message.type]}`}>
            {message.text}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor='proveedor' className={styles.label}>
              Seleccionar Proveedor
            </label>
            <select
              id='proveedor'
              name='proveedor'
              value={selectedProveedor}
              onChange={handleChange}
              className={styles.input}
              required
            >
              <option value=''>Seleccione un proveedor</option>
              {proveedores.map((proveedor) => (
                <option key={proveedor.id} value={proveedor.id}>
                  {proveedor.nombre} {proveedor.apellido} - Contacto: {proveedor.contacto}
                </option>
              ))}
            </select>
          </div>

          {selectedProveedor && (
            <div className={styles.warningMessage}>
              <p>⚠️ ADVERTENCIA: Esta acción eliminará permanentemente el proveedor seleccionado.</p>
              {insumosAsociados.length > 0 && (
                <div className={styles.warningDetails}>
                  <p>Los siguientes insumos también serán eliminados:</p>
                  <ul>
                    {insumosAsociados.map((insumo) => (
                      <li key={insumo.id}>
                        {insumo.descripcion} - {insumo.tipo} - ${insumo.precio_unitario}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <button type='submit' className={`${styles.button} ${styles.deleteButton}`}>
                Eliminar Proveedor
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default EliminarProveedor; 
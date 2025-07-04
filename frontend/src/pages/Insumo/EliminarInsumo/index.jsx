import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../common.module.css";

import { fetchFromApi } from "../../../services/fetch";

const EliminarInsumo = () => {
  const navigate = useNavigate();
  const [insumos, setInsumos] = useState([]);
  const [selectedInsumo, setSelectedInsumo] = useState("");
  const [message, setMessage] = useState({ type: "", text: "" });
  const [proveedores, setProveedores] = useState([]);
  const [registrosConsumo, setRegistrosConsumo] = useState([]);

  // Cargar lista de insumos y proveedores al montar el componente
  useEffect(() => {
    // Cargar insumos
    fetchFromApi("/insumos/")
      .then((response) => response.json())
      .then((data) => setInsumos(data))
      .catch((error) => {
        console.error("Error:", error);
        setMessage({ 
          type: "error", 
          text: "Error al cargar la lista de insumos",
        });
      });

    // Cargar proveedores
    fetchFromApi("/proveedores/")
      .then((response) => response.json())
      .then((data) => setProveedores(data))
      .catch((error) => {
        console.error("Error:", error);
        setMessage({ 
          type: "error", 
          text: "Error al cargar los proveedores",
        });
      });
  }, []);

  // Cargar registros de consumo cuando se selecciona un insumo
  useEffect(() => {
    if (selectedInsumo) {
      fetchFromApi("/registro_consumo/")
        .then((response) => response.json())
        .then((data) => {
          const registrosDelInsumo = data.filter(
            registro => registro.id_insumo === parseInt(selectedInsumo)
          );
          setRegistrosConsumo(registrosDelInsumo);
        })
        .catch((error) => {
          console.error("Error:", error);
          setMessage({
            type: "error",
            text: "Error al cargar los registros de consumo",
          });
        });
    } else {
      setRegistrosConsumo([]);
    }
  }, [selectedInsumo]);

  const getProveedorInfo = (id_proveedor) => {
    const proveedor = proveedores.find(p => p.id === id_proveedor);
    return proveedor ? `${proveedor.nombre} ${proveedor.apellido}` : 'Proveedor no encontrado';
  };

  const handleChange = (e) => {
    setSelectedInsumo(e.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!selectedInsumo) {
      setMessage({ type: "error", text: "Por favor seleccione un insumo" });
      return;
    }

    // Confirmar antes de eliminar
    const mensajeConfirmacion = registrosConsumo.length > 0
      ? `¿Está seguro que desea eliminar este insumo? Esta acción eliminará también ${registrosConsumo.length} registro(s) de consumo asociado(s).`
      : "¿Está seguro que desea eliminar este insumo?";

    if (!window.confirm(mensajeConfirmacion)) {
      return;
    }

    try {
      const response = await fetchFromApi("/insumos/consumo", {
        method: "DELETE",
        body: JSON.stringify({
          id: parseInt(selectedInsumo)
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al eliminar insumo");
      }
      
      setMessage({ type: "success", text: "Insumo eliminado con éxito" });
      setSelectedInsumo(""); // Limpiar selección
      
      // Recargar lista de insumos
      const updatedResponse = await fetchFromApi("/insumos/");
      const updatedData = await updatedResponse.json();
      setInsumos(updatedData);

      // Redireccionar después de 2 segundos
      setTimeout(() => {
        navigate("/insumo/listar");
      }, 2000);
    } catch (error) {
      console.error("Error:", error);
      setMessage({
        type: "error",
        text: error.message || "Error al eliminar insumo",
      });
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
      <h1 className={styles.title}>Eliminar Insumo</h1>
      
      <div className={styles.card}>
        {message.text && (
          <div className={`${styles.message} ${styles[message.type]}`}>
            {message.text}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor='insumo' className={styles.label}>
              Seleccionar Insumo
            </label>
            <select
              id='insumo'
              name='insumo'
              value={selectedInsumo}
              onChange={handleChange}
              className={styles.input}
              required
            >
              <option value=''>Seleccione un insumo</option>
              {insumos.map((insumo) => (
                <option key={insumo.id} value={insumo.id}>
                  {`${insumo.descripcion} - Tipo: ${insumo.tipo} - Precio: $${insumo.precio_unitario} - Proveedor: ${getProveedorInfo(insumo.id_proveedor)}`}
                </option>
              ))}
            </select>
          </div>

          {selectedInsumo && (
            <div className={styles.warningMessage}>
              <p>⚠️ ADVERTENCIA: Esta acción eliminará permanentemente el insumo seleccionado.</p>
              {registrosConsumo.length > 0 && (
                <div className={styles.warningDetails}>
                  <p>Los siguientes registros de consumo también serán eliminados:</p>
                  <ul>
                    {registrosConsumo.map((registro) => (
                      <li key={registro.id}>
                        ID: {registro.id} - Fecha: {formatDate(registro.fecha)} - Cantidad: {registro.cantidad_usada}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <button type='submit' className={`${styles.button} ${styles.deleteButton}`}>
                Eliminar Insumo
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default EliminarInsumo; 
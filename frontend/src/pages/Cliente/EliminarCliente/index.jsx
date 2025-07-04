import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../common.module.css";

import { fetchFromApi } from "../../../services/fetch";

const EliminarCliente = () => {
  const navigate = useNavigate();
  const [clientes, setClientes] = useState([]);
  const [selectedClient, setSelectedClient] = useState("");
  const [message, setMessage] = useState({ type: "", text: "" });

  // Cargar lista de clientes al montar el componente
  useEffect(() => {
    fetchFromApi("/clientes/")
      .then((response) => response.json())
      .then((data) => setClientes(data))
      .catch((error) => {
        console.error("Error:", error);
        setMessage({ 
          type: "error", 
          text: "Error al cargar la lista de clientes",
        });
      });
  }, []);

  const handleChange = (e) => {
    setSelectedClient(e.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!selectedClient) {
      setMessage({ type: "error", text: "Por favor seleccione un cliente" });
      return;
    }

    // Confirmar antes de eliminar
    if (!window.confirm("¿Está seguro que desea eliminar este cliente? Esta acción no se puede deshacer.")) {
      return;
    }

    try {
      const response = await fetchFromApi("/clientes/", {
        method: "DELETE",
        body: JSON.stringify({
          id: parseInt(selectedClient)
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al eliminar cliente");
      }
      
      setMessage({ type: "success", text: "Cliente eliminado con éxito" });
      setSelectedClient(""); // Limpiar selección
      
      // Recargar lista de clientes
      const updatedResponse = await fetchFromApi("/clientes/");
      const updatedData = await updatedResponse.json();
      setClientes(updatedData);

      // Redireccionar después de 2 segundos
      setTimeout(() => {
        navigate("/cliente/listar");
      }, 2000);
    } catch (error) {
      console.error("Error:", error);
      setMessage({
        type: "error",
        text: error.message || "Error al eliminar cliente",
      });
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Eliminar Cliente</h1>
      
      <div className={styles.card}>
        {message.text && (
          <div className={`${styles.message} ${styles[message.type]}`}>
            {message.text}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor='cliente' className={styles.label}>
              Seleccionar Cliente
            </label>
            <select
              id='cliente'
              name='cliente'
              value={selectedClient}
              onChange={handleChange}
              className={styles.input}
              required
            >
              <option value=''>Seleccione un cliente</option>
              {clientes.map((cliente) => (
                <option key={cliente.id} value={cliente.id}>
                  {cliente.nombre} - {cliente.direccion} 
                  {cliente.contacto ? ` - ${cliente.contacto}` : ''}
                </option>
              ))}
            </select>
          </div>

          {selectedClient && (
            <div className={styles.warningMessage}>
              <p>⚠️ ADVERTENCIA: Esta acción eliminará permanentemente el cliente y todos sus datos asociados.</p>
              <button type='submit' className={`${styles.button} ${styles.deleteButton}`}>
                Eliminar Cliente
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default EliminarCliente; 
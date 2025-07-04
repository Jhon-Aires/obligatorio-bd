import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { fetchFromApi } from "../../../services/fetch";
import styles from "../../common.module.css";

const ModificarCliente = () => {
  const navigate = useNavigate();
  const [clientes, setClientes] = useState([]);
  const [selectedClientId, setSelectedClientId] = useState("");
  const [formData, setFormData] = useState({
    id: "",
    nombre: "",
    direccion: "",
    contacto: "",
    correo: "",
  });
  const [message, setMessage] = useState({ type: "", text: "" });
  const [isLoading, setIsLoading] = useState(false);

  // Cargar lista de clientes al montar el componente
  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const response = await fetchFromApi("/clientes/");
        if (!response.ok) throw new Error("Error al cargar clientes");
        const data = await response.json();
        setClientes(data);
      } catch (error) {
        console.error("Error:", error);
        setMessage({
          type: "error",
          text: "Error al cargar la lista de clientes",
        });
      }
    };

    fetchClientes();
  }, []);

  // Cargar datos del cliente seleccionado
  useEffect(() => {
    if (!selectedClientId) return;

    const clienteSeleccionado = clientes.find(
      (cliente) => cliente.id === Number(selectedClientId)
    );

    if (!clienteSeleccionado) return;

    setFormData({
      id: clienteSeleccionado.id,
      nombre: clienteSeleccionado.nombre || "",
      direccion: clienteSeleccionado.direccion || "",
      contacto: clienteSeleccionado.contacto || "",
      correo: clienteSeleccionado.correo || "",
    });
  }, [selectedClientId, clientes]);

  const handleClienteSelect = (e) => {
    const { value } = e.target;
    setSelectedClientId(value);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const validateForm = () => {
    if (!selectedClientId) {
      setMessage({ type: "error", text: "Por favor seleccione un cliente" });
      return false;
    }

    if (!formData.nombre.trim()) {
      setMessage({ type: "error", text: "El nombre es requerido" });
      return false;
    }

    if (!formData.direccion.trim()) {
      setMessage({ type: "error", text: "La dirección es requerida" });
      return false;
    }

    if (formData.correo && !formData.correo.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setMessage({ type: "error", text: "El formato del correo electrónico no es válido" });
      return false;
    }

    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const response = await fetchFromApi("/clientes/", {
        method: "PATCH",
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al modificar cliente");
      }

      setMessage({ type: "success", text: "Cliente modificado con éxito" });
      setTimeout(() => {
        navigate("/cliente/listar");
      }, 2000);
    } catch (error) {
      console.error("Error:", error);
      setMessage({
        type: "error",
        text: error.message || "Error al modificar cliente",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Modificar Cliente</h1>

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
            <label htmlFor="clienteSelect" className={styles.label}>
              Seleccionar Cliente
            </label>
            <select
              id="clienteSelect"
              name="clienteSelect"
              value={selectedClientId}
              onChange={handleClienteSelect}
              className={styles.input}
              required
              aria-required="true"
              disabled={isLoading}
            >
              <option value="">Seleccione un cliente</option>
              {clientes.map((cliente) => (
                <option key={cliente.id} value={cliente.id}>
                  {`${cliente.id} - ${cliente.nombre}`}
                </option>
              ))}
            </select>
          </div>

          {selectedClientId && (
            <>
              <div className={styles.formGroup}>
                <label htmlFor="nombre" className={styles.label}>
                  Nombre
                </label>
                <input
                  id="nombre"
                  name="nombre"
                  type="text"
                  value={formData.nombre}
                  onChange={handleChange}
                  onKeyDown={handleKeyDown}
                  className={styles.input}
                  required
                  aria-required="true"
                  disabled={isLoading}
                  maxLength={50}
                  placeholder="Nombre del cliente"
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="direccion" className={styles.label}>
                  Dirección
                </label>
                <input
                  id="direccion"
                  name="direccion"
                  type="text"
                  value={formData.direccion}
                  onChange={handleChange}
                  onKeyDown={handleKeyDown}
                  className={styles.input}
                  required
                  aria-required="true"
                  disabled={isLoading}
                  maxLength={100}
                  placeholder="Dirección del cliente"
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="contacto" className={styles.label}>
                  Contacto
                </label>
                <input
                  id="contacto"
                  name="contacto"
                  type="tel"
                  value={formData.contacto}
                  onChange={handleChange}
                  onKeyDown={handleKeyDown}
                  className={styles.input}
                  disabled={isLoading}
                  maxLength={12}
                  placeholder="Número de contacto"
                  aria-describedby="contactoHelp"
                />
                <small id="contactoHelp" className={styles.helpText}>
                  Formato: números sin espacios ni guiones
                </small>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="correo" className={styles.label}>
                  Correo Electrónico
                </label>
                <input
                  id="correo"
                  name="correo"
                  type="email"
                  value={formData.correo}
                  onChange={handleChange}
                  onKeyDown={handleKeyDown}
                  className={styles.input}
                  disabled={isLoading}
                  maxLength={100}
                  placeholder="correo@ejemplo.com"
                  aria-describedby="correoHelp"
                />
                <small id="correoHelp" className={styles.helpText}>
                  Formato: ejemplo@dominio.com
                </small>
              </div>

              <button
                type="submit"
                className={`${styles.button} ${isLoading ? styles.loading : ""}`}
                disabled={isLoading}
                aria-disabled={isLoading}
              >
                {isLoading ? "Modificando..." : "Modificar Cliente"}
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default ModificarCliente;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../common.module.css";

import { fetchFromApi } from "../../../services/fetch";

const ModificarProveedor = () => {
  const navigate = useNavigate();
  const [proveedores, setProveedores] = useState([]);
  const [formData, setFormData] = useState({
    id: "",
    nombre: "",
    apellido: "",
    contacto: "",
  });
  const [message, setMessage] = useState({ type: "", text: "" });

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

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Si se selecciona un proveedor, prellenar los campos con sus datos actuales
    if (name === "id" && value) {
      const proveedorSeleccionado = proveedores.find(
        (p) => p.id === parseInt(value)
      );
      if (proveedorSeleccionado) {
        setFormData({
          id: value,
          nombre: proveedorSeleccionado.nombre,
          apellido: proveedorSeleccionado.apellido,
          contacto: proveedorSeleccionado.contacto,
        });
        return;
      }
    }

    // Para otros campos, actualizar normalmente
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.id) {
      setMessage({ type: "error", text: "Por favor seleccione un proveedor" });
      return;
    }

    try {
      // Validar que nombre y apellido solo contengan letras si se proporcionan
      if (!formData.nombre) {
        setMessage({ type: "error", text: "El nombre no puede estar vacío" });
        return;
      }
      if (!formData.apellido) {
        setMessage({ type: "error", text: "El apellido no puede estar vacío" });
        return;
      }

      if (
        !formData.contacto ||
        !/^\d+$/.test(formData.contacto) ||
        String(formData.contacto).length !== 9
      ) {
        setMessage({
          type: "error",
          text: "El contacto debe contener solo números y 9 digitos",
        });
        return;
      }

      // Filtrar campos vacíos para no enviarlos
      const datosAEnviar = Object.fromEntries(
        Object.entries(formData).filter(([_, value]) => value !== "")
      );

      const response = await fetchFromApi("/proveedores/", {
        method: "PATCH",
        body: JSON.stringify(datosAEnviar),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al modificar proveedor");
      }

      setMessage({ type: "success", text: "Proveedor modificado con éxito" });
      setTimeout(() => {
        navigate("/proveedor/listar");
      }, 2000);
    } catch (error) {
      console.error("Error:", error);
      setMessage({
        type: "error",
        text: error.message || "Error al modificar proveedor",
      });
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Modificar Proveedor</h1>

      <div className={styles.card}>
        {message.text && (
          <div className={`${styles.message} ${styles[message.type]}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor='id' className={styles.label}>
              Seleccionar Proveedor
            </label>
            <select
              id='id'
              name='id'
              value={formData.id}
              onChange={handleChange}
              className={styles.input}
              required
            >
              <option value=''>Seleccione un proveedor</option>
              {proveedores.map((proveedor) => (
                <option key={proveedor.id} value={proveedor.id}>
                  {proveedor.nombre} {proveedor.apellido} - {proveedor.contacto}
                </option>
              ))}
            </select>
          </div>

          {formData.id && (
            <>
              <div className={styles.formGroup}>
                <label htmlFor='nombre' className={styles.label}>
                  Nombre
                </label>
                <input
                  id='nombre'
                  name='nombre'
                  type='text'
                  value={formData.nombre}
                  onChange={handleChange}
                  className={styles.input}
                  placeholder='Ingrese el nombre'
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor='apellido' className={styles.label}>
                  Apellido
                </label>
                <input
                  id='apellido'
                  name='apellido'
                  type='text'
                  value={formData.apellido}
                  onChange={handleChange}
                  className={styles.input}
                  placeholder='Ingrese el apellido'
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor='contacto' className={styles.label}>
                  Contacto
                </label>
                <input
                  id='contacto'
                  name='contacto'
                  type='text'
                  value={formData.contacto}
                  onChange={handleChange}
                  className={styles.input}
                  placeholder='Ingrese el contacto'
                />
              </div>

              <button type='submit' className={styles.button}>
                Guardar Cambios
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default ModificarProveedor;

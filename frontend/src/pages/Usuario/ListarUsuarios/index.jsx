import React, { useState, useEffect } from "react";
import styles from "../../common.module.css";

import { fetchFromApi } from "../../../services/fetch";

const ListarUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [message, setMessage] = useState({ type: "", text: "" });

  const cargarUsuarios = () => {
    fetchFromApi("/login/usuarios/")
      .then((response) => response.json())
      .then((data) => setUsuarios(data))
      .catch((error) => {
        console.error("Error fetching usuarios:", error);
        setMessage({ 
          type: "error", 
          text: "Error al cargar los usuarios" 
        });
      });
  };

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const handleEliminar = async (correo) => {
    if (window.confirm(`¿Está seguro que desea eliminar el usuario ${correo}?`)) {
      try {
        const response = await fetchFromApi("/login/usuarios/", {
          method: "DELETE",
          body: JSON.stringify({ correo }),
        });
        const data = await response.json();
        
        if (data.error) {
          setMessage({ type: "error", text: data.error });
        } else {
          setMessage({ type: "success", text: "Usuario eliminado con éxito" });
          cargarUsuarios(); // Recargar la lista
        }
      } catch (error) {
        console.error("Error:", error);
        setMessage({ type: "error", text: "Error al eliminar usuario" });
      }
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Lista de Usuarios</h1>

      <div className={styles.card}>
        {message.text && (
          <div className={`${styles.message} ${styles[message.type]}`}>
            {message.text}
          </div>
        )}

        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Correo</th>
                <th>Tipo de Usuario</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((usuario) => (
                <tr key={usuario.correo}>
                  <td>{usuario.correo}</td>
                  <td>{usuario.es_administrador ? "Administrador" : "Usuario Regular"}</td>
                  <td>
                    <button
                      onClick={() => handleEliminar(usuario.correo)}
                      className={styles.deleteButton}
                      title="Eliminar usuario"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
              {usuarios.length === 0 && (
                <tr>
                  <td colSpan="3" style={{ textAlign: "center" }}>
                    No hay usuarios registrados
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ListarUsuarios; 
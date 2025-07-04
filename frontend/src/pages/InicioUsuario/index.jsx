import React from "react";
import { Link } from "react-router-dom";

import { fetchFromApi } from "../../services/fetch";
import styles from "./InicioUsuario.module.css";

const InicioUsuario = () => {
  const handleLogout = () => {
    fetchFromApi("/login/logout", {
      method: "POST",
    })
      .then(() => {
        window.location.href = "/login";
      })
      .catch((error) => {
        console.error("Error al cerrar sesión:", error);
      });
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Panel de Usuario - Marloy Maquinarias</h1>
        <button onClick={handleLogout} className={styles.logoutBtn}>
          Cerrar Sesión
        </button>
      </header>

      <main className={styles.main}>
        <h2>Bienvenido al Sistema</h2>
        <p>
          Como usuario limitado, tienes acceso a las siguientes funcionalidades:
        </p>

        <div className={styles.sectionsGrid}>
          {/* Clientes */}
          <section className={styles.section}>
            <h3>👥 Gestión de Clientes</h3>
            <div className={styles.buttonGroup}>
              <Link to='/cliente/alta' className={styles.actionBtn}>
                Crear Cliente
              </Link>
              <Link to='/cliente/listar' className={styles.actionBtn}>
                Listar Clientes
              </Link>
              <Link to='/cliente/modificar' className={styles.actionBtn}>
                Modificar Clientes
              </Link>
            </div>
          </section>

          {/* Insumos */}
          <section className={styles.section}>
            <h3>📦 Gestión de Insumos</h3>
            <div className={styles.buttonGroup}>
              <Link to='/insumo/listar' className={styles.actionBtn}>
                Listar Insumos
              </Link>
              <Link to='/insumo/alta' className={styles.actionBtn}>
                Crear Insumo
              </Link>
            </div>
          </section>

          {/* Mantenimientos */}
          <section className={styles.section}>
            <h3>🔧 Gestión de Mantenimientos</h3>
            <div className={styles.buttonGroup}>
              <Link to='/mantenimiento/listar' className={styles.actionBtn}>
                Listar Mantenimientos
              </Link>
              <Link to='/mantenimiento/alta' className={styles.actionBtn}>
                Crear Mantenimiento
              </Link>
              <Link to='/mantenimiento/modificar' className={styles.actionBtn}>
                Modificar Mantenimiento
              </Link>
            </div>
          </section>
          
          {/* Maquinas */}
          <section className={styles.section}>
            <h3>🔧 Gestión de Maquinas</h3>
            <div className={styles.buttonGroup}>
              <Link to='/maquina/listar' className={styles.actionBtn}>
                Listar Maquinas
              </Link>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default InicioUsuario;

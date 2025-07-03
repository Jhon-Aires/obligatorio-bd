import React from "react";
import { Link } from "react-router-dom";

import { fetchFromApi } from "../../services/fetch";
import styles from "./inicioadm.module.css";

const InicioAdm = () => {
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
        <h1>Panel Administrador - Marloy Maquinarias</h1>
        <button onClick={handleLogout} className={styles.logoutBtn}>
          Cerrar Sesión
        </button>
      </header>

      <main className={styles.main}>
        <h2>Bienvenido al Panel de Administración</h2>
        <p>
          Como administrador, tienes acceso completo a todas las funcionalidades del sistema:
        </p>

        <div className={styles.sectionsGrid}>
          {/* Usuarios */}
          <section className={styles.section}>
            <h3>👥 Usuarios</h3>
            <div className={styles.buttonGroup}>
              <Link to='/usuario/crear' className={styles.actionBtn}>
                Crear Usuario
              </Link>
              <Link to='/usuario/listar' className={styles.actionBtn}>
                Listar Usuarios
              </Link>
            </div>
          </section>

          {/* Proveedores */}
          <section className={styles.section}>
            <h3>🏪 Proveedores</h3>
            <div className={styles.buttonGroup}>
              <Link to='/proveedor/alta' className={styles.actionBtn}>
                Crear Proveedor
              </Link>
              <Link to='/proveedor/listar' className={styles.actionBtn}>
                Listar Proveedores
              </Link>
            </div>
          </section>

          {/* Insumos */}
          <section className={styles.section}>
            <h3>📦 Insumos</h3>
            <div className={styles.buttonGroup}>
              <Link to='/insumo/alta' className={styles.actionBtn}>
                Crear Insumo
              </Link>
              <Link to='/insumo/listar' className={styles.actionBtn}>
                Listar Insumos
              </Link>
            </div>
          </section>

          {/* Clientes */}
          <section className={styles.section}>
            <h3>👤 Clientes</h3>
            <div className={styles.buttonGroup}>
              <Link to='/cliente/alta' className={styles.actionBtn}>
                Crear Cliente
              </Link>
              <Link to='/cliente/listar' className={styles.actionBtn}>
                Listar Clientes
              </Link>
            </div>
          </section>

          {/* Máquinas */}
          <section className={styles.section}>
            <h3>🏗️ Máquinas</h3>
            <div className={styles.buttonGroup}>
              <Link to='/maquina/alta' className={styles.actionBtn}>
                Crear Máquina
              </Link>
              <Link to='/maquina/listar' className={styles.actionBtn}>
                Listar Máquinas
              </Link>
            </div>
          </section>

          {/* Técnicos */}
          <section className={styles.section}>
            <h3>🔧 Técnicos</h3>
            <div className={styles.buttonGroup}>
              <Link to='/tecnico/alta' className={styles.actionBtn}>
                Crear Técnico
              </Link>
              <Link to='/tecnico/listar' className={styles.actionBtn}>
                Listar Técnicos
              </Link>
            </div>
          </section>

          {/* Mantenimientos */}
          <section className={styles.section}>
            <h3>⚙️ Mantenimientos</h3>
            <div className={styles.buttonGroup}>
              <Link to='/mantenimiento/alta' className={styles.actionBtn}>
                Crear Mantenimiento
              </Link>
              <Link to='/mantenimiento/listar' className={styles.actionBtn}>
                Listar Mantenimientos
              </Link>
            </div>
          </section>

          {/* Máquinas en Uso */}
          <section className={styles.section}>
            <h3>🔄 Máquinas en Uso</h3>
            <div className={styles.buttonGroup}>
              <Link to='/maquinaenuso/alta' className={styles.actionBtn}>
                Asignar Máquina
              </Link>
              <Link to='/maquinaenuso/listar' className={styles.actionBtn}>
                Listar Asignaciones
              </Link>
              <Link to='/maquinaenuso/baja' className={styles.actionBtn}>
                Eliminar Asignación
              </Link>
            </div>
          </section>

          {/* Registro de Consumo */}
          <section className={styles.section}>
            <h3>📊 Registro de Consumo</h3>
            <div className={styles.buttonGroup}>
              <Link to='/registroconsumo/alta' className={styles.actionBtn}>
                Crear Registro
              </Link>
              <Link to='/registroconsumo/listar' className={styles.actionBtn}>
                Listar Registros
              </Link>
              <Link to='/registroconsumo/baja' className={styles.actionBtn}>
                Eliminar Registro
              </Link>
            </div>
          </section>
        </div>

        <div className={styles.info}>
          <h4>ℹ️ Información Importante</h4>
          <ul>
            <li>Tienes acceso completo a todas las funcionalidades del sistema</li>
            <li>Puedes gestionar usuarios, proveedores, máquinas y más</li>
            <li>Recuerda mantener actualizada la información del sistema</li>
          </ul>
        </div>
      </main>
    </div>
  );
};

export default InicioAdm;

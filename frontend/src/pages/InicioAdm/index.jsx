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
          Como administrador, tienes acceso completo a todas las funcionalidades
          del sistema:
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
              <Link to='/usuario/modificar' className={styles.actionBtn}>
                Modificar Usuarios
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
              <Link to='/proveedor/modificar' className={styles.actionBtn}>
                Modificar Proveedor
              </Link>
              <Link to='/proveedor/baja' className={styles.actionBtn}>
                Eliminar Proveedor
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
              <Link to='/insumo/baja' className={styles.actionBtn}>
                Eliminar Insumo
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
              <Link to="/cliente/modificar" className={styles.actionBtn}>
                Modificar Cliente
              </Link>
              <Link to="/cliente/baja" className={styles.actionBtn}>
                Eliminar Cliente
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
              <Link to='/maquina/modificar' className={styles.actionBtn}>
                Modificar Máquinas
              </Link>
              <Link to='/maquina/baja' className={styles.actionBtn}>
                Eliminar Máquina
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
              <Link to='/tecnico/modificar' className={styles.actionBtn}>
                Modificar Técnicos
              </Link>
              <Link to='/tecnico/baja' className={styles.actionBtn}>
                Eliminar Técnico
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
              <Link to='/mantenimiento/modificar' className={styles.actionBtn}>
                Modificar Mantenimiento
              </Link>
              <Link to='/mantenimiento/baja' className={styles.actionBtn}>
                Eliminar Mantenimiento
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
      </main>
    </div>
  );
};

export default InicioAdm;

import { Link } from "react-router-dom";

import { fetchFromApi } from "../../services/fetch";
import classes from "./inicioadm.module.css";

export default function InicioAdm() {
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
    <div className={classes.pageContainer}>
      <nav className={classes.navbar}>
        <h1 className={classes.navbarTitle}>
          Panel Administrador - Coffe's Marloy
        </h1>
        <button onClick={handleLogout} className={classes.logoutBtn}>
          Cerrar Sesión
        </button>
        <div className={classes.navbarButtons}>
          <div className={classes.navSection}>
            <h2 className={classes.sectionTitle}>👥 Usuarios</h2>
            <Link to='/usuario/crear' className={classes.navbarButton}>
              Crear Usuario
            </Link>
            <Link to='/usuario/listar' className={classes.navbarButton}>
              Gestionar Usuarios
            </Link>
          </div>

          <div className={classes.navSection}>
            <h2 className={classes.sectionTitle}>🏪 Proveedores</h2>
            <Link to='/proveedor/alta' className={classes.navbarButton}>
              Crear
            </Link>
            <Link to='/proveedor/listar' className={classes.navbarButton}>
              Listar
            </Link>
          </div>

          <div className={classes.navSection}>
            <h2 className={classes.sectionTitle}>📦 Insumos</h2>
            <Link to='/insumo/alta' className={classes.navbarButton}>
              Crear
            </Link>
            <Link to='/insumo/listar' className={classes.navbarButton}>
              Listar
            </Link>
          </div>

          <div className={classes.navSection}>
            <h2 className={classes.sectionTitle}>👤 Clientes</h2>
            <Link to='/cliente/alta' className={classes.navbarButton}>
              Crear
            </Link>
            <Link to='/cliente/listar' className={classes.navbarButton}>
              Listar
            </Link>
          </div>

          <div className={classes.navSection}>
            <h2 className={classes.sectionTitle}>🏗️ Máquinas</h2>
            <Link to='/maquina/alta' className={classes.navbarButton}>
              Crear
            </Link>
            <Link to='/maquina/listar' className={classes.navbarButton}>
              Listar
            </Link>
          </div>

          <div className={classes.navSection}>
            <h2 className={classes.sectionTitle}>🔧 Técnicos</h2>
            <Link to='/tecnico/alta' className={classes.navbarButton}>
              Crear
            </Link>
            <Link to='/tecnico/listar' className={classes.navbarButton}>
              Listar
            </Link>
          </div>

          <div className={classes.navSection}>
            <h2 className={classes.sectionTitle}>⚙️ Mantenimientos</h2>
            <Link to='/mantenimiento/alta' className={classes.navbarButton}>
              Crear
            </Link>
            <Link to='/mantenimiento/listar' className={classes.navbarButton}>
              Listar
            </Link>
          </div>

          <div className={classes.navSection}>
            <h2 className={classes.sectionTitle}>Máquinas en Uso</h2>
            <Link to='/maquinaenuso/alta' className={classes.navbarButton}>
              Crear
            </Link>
            <Link to='/maquinaenuso/baja' className={classes.navbarButton}>
              Borrar
            </Link>
            <Link to='/maquinaenuso/listar' className={classes.navbarButton}>
              Listar
            </Link>
          </div>

          <div className={classes.navSection}>
            <h2 className={classes.sectionTitle}>Registro de Consumo</h2>
            <Link to='/registroconsumo/alta' className={classes.navbarButton}>
              Crear
            </Link>
            <Link to='/registroconsumo/baja' className={classes.navbarButton}>
              Borrar
            </Link>
            <Link to='/registroconsumo/listar' className={classes.navbarButton}>
              Listar
            </Link>
          </div>
        </div>
      </nav>

      <div className={classes.content}>
        <h2 className={classes.welcomeTitle}>Bienvenido Administrador</h2>
      </div>
    </div>
  );
}

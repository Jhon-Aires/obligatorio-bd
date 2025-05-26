import classes from './inicioadm.module.css'

export default function InicioAdm() {
    return (
        <div className={classes.pageContainer}>
            <nav className={classes.navbar}>
                <h1 className={classes.navbarTitle}>Cafés Marloy</h1>
                <div className={classes.navbarButtons}>
                    <button className={classes.navbarButton}>Crear proveedor</button>
                    <button className={classes.navbarButton}>Dar de baja proveedor</button>
                    <button className={classes.navbarButton}>Insumos</button>


                    <button className={classes.navbarButton}>Agregar clientes</button>
                    <button className={classes.navbarButton}>Eliminar clientes</button>

                    <button className={classes.navbarButton}>Crear máquinas</button>
                    <button className={classes.navbarButton}>Eliminar máquinas</button>

                    <button className={classes.navbarButton}>Crear técnicos</button>
                    <button className={classes.navbarButton}>Eliminar técnicos</button>

                    <button className={classes.navbarButton}>Ingresar mantenimientos</button>
                    <button className={classes.navbarButton}>Eliminar mantenimientos</button>
                </div>
            </nav>

            <div className={classes.content}>
                <h2 className={classes.welcomeTitle}>Bienvenido Administrador</h2>
            </div>
        </div>
    );
}

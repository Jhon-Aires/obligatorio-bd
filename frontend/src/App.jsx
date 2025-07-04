import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Inicioadm from './pages/InicioAdm';
import InicioUsuario from './pages/InicioUsuario';
import Login from "./pages/Login";
import CrearProveedor from './pages/Proveedor/CrearProveedor';
import ListarProveedores from './pages/Proveedor/ListarProveedores';
import ModificarProveedor from './pages/Proveedor/ModificarProveedor';
import EliminarProveedor from './pages/Proveedor/EliminarProveedor';
import CrearInsumo from './pages/Insumo/CrearInsumo';
import ListarInsumos from './pages/Insumo/ListarInsumos';
import EliminarInsumo from './pages/Insumo/EliminarInsumo';
import CrearCliente from './pages/Cliente/CrearCliente';
import ListarClientes from './pages/Cliente/ListarClientes';
import ModificarCliente from './pages/Cliente/ModificarCliente';
import EliminarCliente from './pages/Cliente/EliminarCliente';
import CrearMaquina from './pages/Maquina/CrearMaquina';
import ListarMaquinas from './pages/Maquina/ListarMaquinas';
import ModificarMaquina from './pages/Maquina/ModificarMaquina';
import EliminarMaquina from './pages/Maquina/EliminarMaquina';
import CrearMaquinaEnUso from './pages/MaquinaEnUso/CrearMaquinaEnUso';
import ListarMaquinasEnUso from './pages/MaquinaEnUso/ListarMaquinasEnUso';
import EliminarAsignacion from './pages/MaquinaEnUso/EliminarAsignacion';
import CrearTecnico from './pages/Tecnico/CrearTecnico';
import ListarTecnicos from './pages/Tecnico/ListarTecnicos';
import ModificarTecnico from './pages/Tecnico/ModificarTecnico';
import EliminarTecnico from './pages/Tecnico/EliminarTecnico';
import CrearMantenimiento from './pages/Mantenimiento/CrearMantenimiento';
import ListarMantenimientos from './pages/Mantenimiento/ListarMantenimientos';
import EliminarMantenimiento from './pages/Mantenimiento/EliminarMantenimiento';
import CrearRegistroConsumo from './pages/RegistroConsumo/CrearRegistroConsumo';
import ListarRegistroConsumo from './pages/RegistroConsumo/ListarRegistroConsumo';
import EliminarRegistroConsumo from './pages/RegistroConsumo/EliminarRegistro';
import CrearUsuario from './pages/Usuario/CrearUsuario';
import ListarUsuarios from './pages/Usuario/ListarUsuarios';
import ModificarUsuario from './pages/Usuario/ModificarUsuario';
import ModificarMantenimiento from './pages/Mantenimiento/ModificarMantenimiento';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public route */}
        <Route path="/login" element={<Login />} />

        {/* Admin-only routes */}
        <Route element={<ProtectedRoute requireAdmin={true} />}>
          <Route path="/inicioadm" element={<Inicioadm />} />
          <Route path="/usuario/crear" element={<CrearUsuario />} />
          <Route path="/usuario/listar" element={<ListarUsuarios />} />
          <Route path="/usuario/modificar" element={<ModificarUsuario />} />
          <Route path="/proveedor/alta" element={<CrearProveedor />} />
          <Route path="/proveedor/modificar" element={<ModificarProveedor />} />
          <Route path="/proveedor/baja" element={<EliminarProveedor />} />
          <Route path="/maquina/alta" element={<CrearMaquina />} />
          <Route path="/maquina/modificar" element={<ModificarMaquina />} />
          <Route path="/maquina/baja" element={<EliminarMaquina />} />
          <Route path="/maquinaenuso/alta" element={<CrearMaquinaEnUso />} />
          <Route path="/maquinaenuso/listar" element={<ListarMaquinasEnUso />} />
          <Route path="/maquinaenuso/baja" element={<EliminarAsignacion />} />
          <Route path="/tecnico/alta" element={<CrearTecnico />} />
          <Route path="/tecnico/listar" element={<ListarTecnicos />} />
          <Route path="/tecnico/modificar" element={<ModificarTecnico />} />
          <Route path="/tecnico/baja" element={<EliminarTecnico />} />
          <Route path="/registroconsumo/alta" element={<CrearRegistroConsumo />} />
          <Route path="/registroconsumo/listar" element={<ListarRegistroConsumo />} />
          <Route path="/cliente/baja" element={<EliminarCliente />} />
          <Route path="/insumo/baja" element={<EliminarInsumo />} />
          <Route path="/mantenimiento/baja" element={<EliminarMantenimiento />} />
          <Route path="/registroconsumo/baja" element={<EliminarRegistroConsumo />} />
        </Route>

        {/* Routes accessible to all authenticated users */}
        <Route element={<ProtectedRoute />}>
          <Route path="/iniciousuario" element={<InicioUsuario />} />
          <Route path="/cliente/alta" element={<CrearCliente />} />
          <Route path="/cliente/listar" element={<ListarClientes />} />
          <Route path="/cliente/modificar" element={<ModificarCliente />} />
          <Route path="/insumo/alta" element={<CrearInsumo />} />
          <Route path="/insumo/listar" element={<ListarInsumos />} />
          <Route path="/mantenimiento/alta" element={<CrearMantenimiento />} />
          <Route path="/mantenimiento/modificar" element={<ModificarMantenimiento />} />
          <Route path="/mantenimiento/listar" element={<ListarMantenimientos />} />
          <Route path="/maquina/listar" element={<ListarMaquinas />} />
          <Route path="/proveedor/listar" element={<ListarProveedores />} />
        </Route>

        {/* Default route */}
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

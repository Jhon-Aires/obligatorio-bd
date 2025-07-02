import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Inicioadm from './pages/InicioAdm';
import InicioUsuario from './pages/InicioUsuario';
import Login from "./pages/Login";
import CrearProveedor from './pages/Proveedor/CrearProveedor';
import ListarProveedores from './pages/Proveedor/ListarProveedores';
import CrearInsumo from './pages/Insumo/CrearInsumo';
import ListarInsumos from './pages/Insumo/ListarInsumos';
import CrearCliente from './pages/Cliente/CrearCliente';
import ListarClientes from './pages/Cliente/ListarClientes';
import CrearMaquina from './pages/Maquina/CrearMaquina';
import ListarMaquinas from './pages/Maquina/ListarMaquinas';
import CrearMaquinaEnUso from './pages/MaquinaEnUso/CrearMaquinaEnUso';
import ListarMaquinasEnUso from './pages/MaquinaEnUso/ListarMaquinasEnUso';
import CrearTecnico from './pages/Tecnico/CrearTecnico';
import ListarTecnicos from './pages/Tecnico/ListarTecnicos';
import CrearMantenimiento from './pages/Mantenimiento/CrearMantenimiento';
import ListarMantenimientos from './pages/Mantenimiento/ListarMantenimientos';
import CrearRegistroConsumo from './pages/RegistroConsumo/CrearRegistroConsumo';
import ListarRegistroConsumo from './pages/RegistroConsumo/ListarRegistroConsumo';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public route */}
        <Route path="/login" element={<Login />} />

        {/* Admin-only routes */}
        <Route element={<ProtectedRoute requireAdmin={true} />}>
          <Route path="/inicioadm" element={<Inicioadm />} />
          <Route path="/proveedor/alta" element={<CrearProveedor />} />
          <Route path="/maquina/alta" element={<CrearMaquina />} />
          <Route path="/maquinaenuso/alta" element={<CrearMaquinaEnUso />} />
          <Route path="/maquinaenuso/listar" element={<ListarMaquinasEnUso />} />
          <Route path="/tecnico/alta" element={<CrearTecnico />} />
          <Route path="/tecnico/listar" element={<ListarTecnicos />} />
          <Route path="/registroconsumo/alta" element={<CrearRegistroConsumo />} />
          <Route path="/registroconsumo/listar" element={<ListarRegistroConsumo />} />
        </Route>

        {/* Routes accessible to all authenticated users */}
        <Route element={<ProtectedRoute />}>
          <Route path="/iniciousuario" element={<InicioUsuario />} />
          <Route path="/cliente/alta" element={<CrearCliente />} />
          <Route path="/cliente/listar" element={<ListarClientes />} />
          <Route path="/insumo/alta" element={<CrearInsumo />} />
          <Route path="/insumo/listar" element={<ListarInsumos />} />
          <Route path="/mantenimiento/alta" element={<CrearMantenimiento />} />
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

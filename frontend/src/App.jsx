import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Inicioadm from './pages/InicioAdm';
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
        <Route path="/login" element={<Login />} />
        <Route path="/inicioadm" element={<Inicioadm />} />
        <Route path="/proveedor/alta" element={<CrearProveedor />} />
        <Route path="/proveedor/listar" element={<ListarProveedores />} />
        <Route path="/insumo/alta" element={<CrearInsumo />} />
        <Route path="/insumo/listar" element={<ListarInsumos />} />
        <Route path="/cliente/alta" element={<CrearCliente />} />
        <Route path="/cliente/listar" element={<ListarClientes />} />
        <Route path="/maquina/alta" element={<CrearMaquina />} />
        <Route path="/maquina/listar" element={<ListarMaquinas />} />
        <Route path="/maquinaenuso/alta" element={<CrearMaquinaEnUso />} />
        <Route path="/maquinaenuso/listar" element={<ListarMaquinasEnUso />} />
        <Route path="/tecnico/alta" element={<CrearTecnico />} />
        <Route path="/tecnico/listar" element={<ListarTecnicos />} />
        <Route path="/mantenimiento/alta" element={<CrearMantenimiento />} />
        <Route path="/mantenimiento/listar" element={<ListarMantenimientos />} />
        <Route path="/registroconsumo/alta" element={<CrearRegistroConsumo />} />
        <Route path="/registroconsumo/listar" element={<ListarRegistroConsumo />} />
        {/* <Route path="/proveedor/baja" element={<BorrarProveedor />} /> */}
        {/* <Route path="/proveedor/modificacion" element={<EditarProveedor />} /> */}
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

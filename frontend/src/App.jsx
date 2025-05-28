import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Inicioadm from './pages/InicioAdm';
import Login from "./pages/Login";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/inicioadm" element={<Inicioadm />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

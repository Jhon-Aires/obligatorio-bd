import { BrowserRouter, Routes, Route } from "react-router-dom";
import Inicioadm from './pages/InicioAdm';
import Login from "./pages/Login";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/inicioadm" element={<Inicioadm />} />
      </Routes>
    </BrowserRouter>
  );
}

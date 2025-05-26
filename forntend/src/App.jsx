import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from './pages/login';
import Inicioadm from './pages/inicioadm';

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

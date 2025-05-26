import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  
  const handleSubmit = (e) => {
    e.preventDefault();
    const emailParts = email.split("@");
    
    if (password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }

    console.log("Email:", emailParts);
    setError("");
    document.alert("Inicio de sesión exitoso (simulado).");
    navigate("/inicio");
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-2xl shadow-md w-96"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Iniciar Sesión</h2>

        {error && <div className="text-red-600 mb-4 text-sm">{error}</div>}

        <label className="block mb-2">Correo electrónico</label>
        <input
          type="email"
          className="w-full px-3 py-2 border rounded-xl mb-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="tucorreo@gmail.com"
        />

        <label className="block mb-2">Contraseña</label>
        <input
          type="password"
          className="w-full px-3 py-2 border rounded-xl mb-4"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition"
        >
          Ingresar
        </button>
      </form>
    </div>
  );
}
export default Login;

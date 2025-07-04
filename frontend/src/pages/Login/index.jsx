import React, { useEffect, useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";

import styles from "./Login.module.css";
import { fetchFromApi } from '../../services/fetch';

const Login = () => {
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    setLoading(true);
    const checkAuth = async () => {
      try {
        const response = await fetchFromApi("/login/verificar-sesion");

        if (!response.ok) {
          throw new Error(data.mensaje || "Error al verificar sesión");
        }

        const data = await response.json();

        console.log("data", data);

        setIsAuthenticated(data.autenticado);
        setIsAdmin(data.es_administrador);
      } catch (error) {
        console.log("error", error);

        console.error("Error verificando autenticación:", error);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    const credentials = {
      correo,
      contrasena,
    };
    try {
      const response = await fetch("http://localhost:5001/login/autenticar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Importante para las cookies de sesión
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (response.ok && data.mensaje === "Login exitoso") {
        console.log("Login exitoso:", data);

        // Redirigir según el tipo de usuario
        if (data.es_administrador) {
          console.log("Usuario administrador");

          navigate("/inicioadm");
        } else {
          console.log("Usuario no administrador");
          navigate("/iniciousuario");
        }
      } else {
        setError(data.mensaje || "Error en las credenciales");
      }
    } catch (error) {
      console.error("Error:", error);
      setError("Error de conexión con el servidor");
    } finally {
      setLoading(false);
    }
  };

  if (isAuthenticated && isAdmin) {
    return <Navigate to='/inicioAdm' replace />;
  }
  
  if (isAuthenticated && !isAdmin) {
    return <Navigate to='/iniciousuario' replace />;
  }

  return (
    <div className={styles.loginContainer}>
      <form onSubmit={handleSubmit} className={styles.loginForm}>
        <h2>
          Marloy Maquinarias
          <br />
          Inicia Sesión
        </h2>

        {error && <div className={styles.errorMessage}>{error}</div>}

        <input
          type='email'
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
          placeholder='Correo'
          required
          disabled={loading}
        />
        <input
          type='password'
          value={contrasena}
          onChange={(e) => setContrasena(e.target.value)}
          placeholder='Contraseña'
          required
          disabled={loading}
        />
        <button type='submit' disabled={loading}>
          {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
        </button>

        <div className={styles.loginInfo}>
          <p>
            <strong>Usuarios de prueba:</strong>
          </p>
          <p>Admin: admin@empresa.com / admin123</p>
          <p>Para crear más usuarios, inicia sesión como administrador</p>
        </div>
      </form>
    </div>
  );
};

export default Login;

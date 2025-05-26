import React from "react";
import '../components/login.css';
import {Link} from "react-router-dom";

const Login = () => {
return(
<div>
    <h1>login</h1>
    <input placeholder = "ingrese su usuario"></input>
    <Link to="/home">
    <button>Ingrsar</button>
    </Link>
</div>
)
}
  return (
    <div className="login-wrapper">
      <div className="login-container">
        <h1>Login</h1>
        <input placeholder="Ingrese su usuario" />
        <Link to="./home">
            <button className="login-button">Ingresar</button>
        </Link>
      </div>
    </div>
  );


export default Login;
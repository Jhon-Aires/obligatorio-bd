import { useState } from "react";

import classes from "./CrearProveedor.module.css";

const inputs = [
  { name: "nombre", type: "text", label: "Nombre" },
  { name: "apellido", type: "text", label: "Apellido" },
  { name: "contacto", type: "text", label: "Contacto" },
];

const getNuevoProveedorDefault = (defaultValue = "") => {
  const defaultProveedor = {};

  inputs.forEach((input) => {
    defaultProveedor[input.name] = defaultValue;
  });

  return defaultProveedor;
};

const validateInputs = (proveedor) => {
  const errors = {};

  inputs.forEach((input) => {
    if (!proveedor[input.name]) {
      errors[input.name] = `${input.label} es requerido`;
    }
  });

  return Object.keys(errors).length > 0 ? errors : null;
};

function CrearProveedor() {
  const [nuevoProveedor, setNuevoProveedor] = useState(
    getNuevoProveedorDefault()
  );

  const [error, setError] = useState(getNuevoProveedorDefault(null));

  const onSubmit = async (e) => {
    e.preventDefault();

    const errors = validateInputs(nuevoProveedor);
    if (errors) {
      setError(errors);
      return;
    }

    try {

      const proveedorACrear = {
        ...nuevoProveedor,
        contacto: Number(nuevoProveedor.contacto)
      };
      fetch("http://localhost:5001/proveedores", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(proveedorACrear),
        credentials: "include", // Asegura que las cookies de sesión se envíen
      }).then((res) => {
        if (res.ok) {
          res.json().then((data) => {
            console.log("Proveedor creado:", data);
            alert("Proveedor creado con éxito");
            setNuevoProveedor(getNuevoProveedorDefault());
            setError(getNuevoProveedorDefault(null));
          });
        } else {
          alert("Error al crear el proveedor");
        }
      });
    } catch (error) {
      console.error("Error:", error);
      alert("Error al crear el proveedor");
    }
  };

  const onInputChange = (e) => {
    const { name, value } = e.target;

    setNuevoProveedor({
      ...nuevoProveedor,
      [name]: value,
    });

    if (error[name]) {
      setError({
        ...error,
        [name]: null,
      });
    }
  };

  return (
    <div className={classes.crearProveedorContainer}>
      <form onSubmit={onSubmit} className={classes.crearProveedorForm}>
        <h2>Crear Proveedor</h2>
        {inputs.map((input) => (
          <label className={classes.inputContainer} key={input.name}>
            {input.label}:
            <input
              type={input.type}
              name={input.name}
              value={nuevoProveedor[input.name]}
              onChange={onInputChange}
            />
            {error[input.name] && (
              <span className={classes.error}>{error[input.name]}</span>
            )}
          </label>
        ))}
        <button type="submit">Crear Proveedor</button>
      </form>
    </div>
  );
}

export default CrearProveedor;

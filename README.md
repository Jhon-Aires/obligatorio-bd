# Obligatorio Bases De Datos

## Levantar el proyecto

### Requerimientos
- Tener docker instalado y listo para correr un proyecto
- Tener git instalado
### Pasos
- Clonar el repo
- Abrir docker
- Abrir una terminal en el directorio del proyecto
- Correr `docker compose up`

### Puertos:
- Frontend: `localhost:3000` o `127.0.0.1:3000`
- Backend: `localhost:5001` o `127.0.0.1:5001`
- Base de Datos: `localhost:3308` o `127.0.0.1:3308`

## BD
### 📋 Tablas

### 🧑‍💻 `login`
| Columna           | Tipo          | Restricciones             |
|-------------------|---------------|---------------------------|
| `correo`          | VARCHAR(100)  | PRIMARY KEY               |
| `contrasena`      | VARCHAR(30)   | NOT NULL                  |
| `es_administrador`| BOOLEAN       | NOT NULL                  |

---

### 🏢 `proveedores`
| Columna    | Tipo         | Restricciones                        |
|------------|--------------|--------------------------------------|
| `id`       | INT          | AUTO_INCREMENT, PRIMARY KEY          |
| `nombre`   | VARCHAR(20)  | NOT NULL                             |
| `apellido` | VARCHAR(20)  | NOT NULL                             |
| `contacto` | VARCHAR(12)  | —                                    |

---

### 🧱 `insumos`
| Columna          | Tipo           | Restricciones                             |
|------------------|----------------|-------------------------------------------|
| `id`             | INT            | AUTO_INCREMENT, PRIMARY KEY               |
| `descripcion`    | VARCHAR(255)   | —                                         |
| `tipo`           | VARCHAR(50)    | NOT NULL                                  |
| `precio_unitario`| DECIMAL(8,2)   | NOT NULL                                  |
| `id_proveedor`   | INT            | FOREIGN KEY → `proveedores(id)`           |

---

### 👥 `clientes`
| Columna     | Tipo           | Restricciones                        |
|-------------|----------------|--------------------------------------|
| `id`        | INT            | AUTO_INCREMENT, PRIMARY KEY          |
| `nombre`    | VARCHAR(50)    | NOT NULL                             |
| `direccion` | VARCHAR(100)   | NOT NULL                             |
| `contacto`  | VARCHAR(12)    | —                                    |
| `correo`    | VARCHAR(100)   | —                                    |

---

### 🏗️ `maquinas`
| Columna                 | Tipo          | Restricciones     |
|-------------------------|---------------|-------------------|
| `modelo`                | VARCHAR(30)   | PRIMARY KEY       |
| `costo_alquiler_mensual`| DECIMAL(8,2)  | —                 |

---

### 🛠️ `maquinas_en_uso`
| Columna           | Tipo          | Restricciones                             |
|-------------------|---------------|-------------------------------------------|
| `id`              | INT           | AUTO_INCREMENT, PRIMARY KEY               |
| `modelo`          | VARCHAR(30)   | FOREIGN KEY → `maquinas(modelo)`          |
| `id_cliente`      | INT           | FOREIGN KEY → `clientes(id)`              |
| `ubicacion_cliente`| VARCHAR(100) | —                                         |

---

### 👨‍🔧 `tecnicos`
| Columna    | Tipo         | Restricciones                                |
|------------|--------------|----------------------------------------------|
| `ci`       | INT          | PRIMARY KEY, CHECK entre 10000000 y 99999999 |
| `nombre`   | VARCHAR(20)  | NOT NULL                                     |
| `apellido` | VARCHAR(20)  | NOT NULL                                     |
| `contacto` | VARCHAR(12)  | —                                            |

---

### 🔧 `mantenimientos`
| Columna           | Tipo         | Restricciones                              |
|-------------------|--------------|--------------------------------------------|
| `id`              | INT          | AUTO_INCREMENT, PRIMARY KEY                |
| `id_maquina_en_uso`| INT         | FOREIGN KEY → `maquinas_en_uso(id)`        |
| `ci_tecnico`      | INT          | FOREIGN KEY → `tecnicos(ci)`               |
| `tipo`            | VARCHAR(50)  | NOT NULL                                   |
| `fecha`           | DATE         | NOT NULL                                   |
| `observaciones`   | VARCHAR(255) | —                                          |

---

### ⛽ `registro_consumo`
| Columna           | Tipo         | Restricciones                             |
|-------------------|--------------|-------------------------------------------|
| `id`              | VARCHAR(35)  | PRIMARY KEY                               |
| `id_maquina_en_uso`| INT         | FOREIGN KEY → `maquinas_en_uso(id)`       |
| `id_insumo`       | INT          | FOREIGN KEY → `insumos(id)`               |
| `fecha`           | DATE         | NOT NULL                                  |
| `cantidad_usada`  | INT          | NOT NULL                                  |

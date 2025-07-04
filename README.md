# 📊 Obligatorio Bases De Datos

## 🚀 Levantar el proyecto

### ⚙️ Requerimientos
- 🐳 Tener docker instalado y listo para correr un proyecto
- 📦 Tener git instalado

### 📝 Pasos
- 📥 Clonar el repo
- 🐋 Abrir docker
- 💻 Abrir una terminal en el directorio del proyecto
- 🏃‍♂️ Correr `docker compose up`

### 🔌 Puertos:
- 🎨 Frontend: `localhost:3000` o `127.0.0.1:3000`
- 🔧 Backend: `localhost:5001` o `127.0.0.1:5001`
- 🗄️ Base de Datos: `localhost:3308` o `127.0.0.1:3308`

## 🎯 BD
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

### 📦 `insumos`
| Columna          | Tipo           | Restricciones                             |
|------------------|----------------|-------------------------------------------|
| `id`             | INT            | AUTO_INCREMENT, PRIMARY KEY               |
| `descripcion`    | VARCHAR(255)   | —                                         |
| `tipo`           | VARCHAR(50)    | NOT NULL                                  |
| `precio_unitario`| DECIMAL(8,2)   | NOT NULL                                  |
| `id_proveedor`   | INT            | NOT NULL, FOREIGN KEY → `proveedores(id)` ON DELETE CASCADE |

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

### ⚙️ `maquinas_en_uso`
| Columna           | Tipo          | Restricciones                             |
|-------------------|---------------|-------------------------------------------|
| `id`              | INT           | AUTO_INCREMENT, PRIMARY KEY               |
| `modelo`          | VARCHAR(30)   | FOREIGN KEY → `maquinas(modelo)` ON DELETE CASCADE |
| `id_cliente`      | INT           | FOREIGN KEY → `clientes(id)` ON DELETE CASCADE |
| `ubicacion_cliente`| VARCHAR(100) | —                                         |
| —                 | —            | UNIQUE (modelo, ubicacion_cliente)         |

---

### 👨‍🔧 `tecnicos`
| Columna    | Tipo         | Restricciones                                |
|------------|--------------|----------------------------------------------|
| `ci`       | INT          | PRIMARY KEY, CHECK (CI BETWEEN 10000000 AND 99999999) |
| `nombre`   | VARCHAR(20)  | NOT NULL                                     |
| `apellido` | VARCHAR(20)  | NOT NULL                                     |
| `contacto` | VARCHAR(12)  | —                                            |

---

### 🔧 `mantenimientos`
| Columna           | Tipo          | Restricciones                              |
|-------------------|---------------|--------------------------------------------|
| `id`              | INT           | AUTO_INCREMENT, PRIMARY KEY                |
| `id_maquina_en_uso`| INT          | FOREIGN KEY → `maquinas_en_uso(id)` ON DELETE CASCADE |
| `ci_tecnico`      | INT          | NOT NULL, FOREIGN KEY → `tecnicos(ci)` ON DELETE CASCADE |
| `tipo`            | VARCHAR(50)   | NOT NULL                                   |
| `fecha`           | DATETIME      | CHECK (MINUTE(fecha) = 0 AND SECOND(fecha) = 0) |
| `observaciones`   | VARCHAR(255)  | —                                          |
| —                 | —            | UNIQUE (fecha, ci_tecnico)                 |

---

### ⛽ `registro_consumo`
| Columna           | Tipo         | Restricciones                             |
|-------------------|--------------|-------------------------------------------|
| `id`              | INT          | AUTO_INCREMENT, PRIMARY KEY               |
| `id_maquina_en_uso`| INT         | NOT NULL, FOREIGN KEY → `maquinas_en_uso(id)` ON DELETE CASCADE |
| `id_insumo`       | INT          | NOT NULL, FOREIGN KEY → `insumos(id)` ON DELETE CASCADE |
| `fecha`           | DATE         | NOT NULL                                  |
| `cantidad_usada`  | INT          | NOT NULL                                  |

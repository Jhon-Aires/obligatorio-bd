CREATE DATABASE IF NOT EXISTS marloy
  DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE marloy;

CREATE TABLE IF NOT EXISTS login (
    correo VARCHAR(100) PRIMARY KEY, 
    contrasena VARCHAR(30) NOT NULL, 
    es_administrador BOOLEAN NOT NULL
);

CREATE TABLE IF NOT EXISTS proveedores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR (20) NOT NULL, 
    apellido VARCHAR(20) NOT NULL,
    contacto VARCHAR(12)
);

CREATE TABLE IF NOT EXISTS insumos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    descripcion VARCHAR(255),
    tipo VARCHAR(50) NOT NULL,
    precio_unitario DECIMAL(8,2) NOT NULL,
    id_proveedor INT NOT NULL,
    FOREIGN KEY (id_proveedor) REFERENCES proveedores(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS clientes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    direccion VARCHAR(100) NOT NULL,
    contacto VARCHAR(12),
    correo VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS maquinas (
	modelo VARCHAR(30) PRIMARY KEY,
	costo_alquiler_mensual DECIMAL(8,2) 
);

CREATE TABLE IF NOT EXISTS maquinas_en_uso (
    id INT AUTO_INCREMENT PRIMARY KEY, 
    modelo VARCHAR(30),
    id_cliente INT,
    ubicacion_cliente VARCHAR(100),

    -- restriccion: modelo y ubicacion_cliente unica
    UNIQUE (modelo, ubicacion_cliente),

    FOREIGN KEY (id_cliente) REFERENCES clientes(id) ON DELETE CASCADE,
    FOREIGN KEY (modelo) REFERENCES maquinas(modelo) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS tecnicos (
    ci INT CHECK (CI BETWEEN 10000000 AND 99999999) PRIMARY KEY,
    nombre VARCHAR(20) NOT NULL, 
    apellido VARCHAR(20) NOT NULL, 
    contacto VARCHAR(12)
); 

CREATE TABLE IF NOT EXISTS mantenimientos (
    id INT AUTO_INCREMENT PRIMARY KEY, 
    id_maquina_en_uso INT, 
    ci_tecnico INT NOT NULL, 
    tipo VARCHAR(50) NOT NULL, 
    fecha DATETIME,
    observaciones VARCHAR(255),
    -- restriccion: minutos y segundos en cero
    CHECK (
        MINUTE(fecha) = 0 AND
        SECOND(fecha) = 0
    ),

    -- restriccion: fecha y tecnico unica
    UNIQUE (fecha, ci_tecnico),

    FOREIGN KEY (ci_tecnico) REFERENCES tecnicos(ci) ON DELETE CASCADE,
    FOREIGN KEY (id_maquina_en_uso) REFERENCES maquinas_en_uso(id) ON DELETE CASCADE,
    CONSTRAINT unique_tecnico_fecha UNIQUE (ci_tecnico, fecha)
);


CREATE TABLE IF NOT EXISTS registro_consumo (
    id VARCHAR(35) PRIMARY KEY, 
    id_maquina_en_uso INT NOT NULL, 
    id_insumo  INT NOT NULL, 
    fecha DATE NOT NULL, 
    cantidad_usada  INT NOT NULL,
    FOREIGN KEY (id_maquina_en_uso) REFERENCES maquinas_en_uso(id) ON DELETE CASCADE,
    FOREIGN KEY (id_insumo) REFERENCES insumos(id) ON DELETE CASCADE
); 

INSERT INTO login (correo, contrasena, es_administrador) VALUES 
    ('admin@empresa.com', 'admin123', TRUE),
    ('limitadito@empresa.com', 'limitadito123', FALSE);

INSERT INTO proveedores (nombre, apellido, contacto) VALUES
    ('Carlos', 'Pérez', '0987654321'),
    ('Ana', 'López', '0912345678'),
    ('Luis', 'Gómez', '0991122334');

INSERT INTO insumos (descripcion, tipo, precio_unitario, id_proveedor) VALUES
    ('Aceite lubricante industrial', 'Lubricante', 250.00, 1),
    ('Filtro de aire modelo XZ', 'Filtro', 120.50, 2),
    ('Tornillos reforzados 50mm', 'Repuesto', 35.75, 3);

INSERT INTO clientes (nombre, direccion, contacto, correo) VALUES
    ('Constructora Alfa', 'Av. Italia 1234, Montevideo', '099998877', 'contacto@alfa.com'),
    ('TechMaq S.A.', 'Ruta 8 Km 24, Canelones', '098123456', 'soporte@techmaq.com');

INSERT INTO maquinas (modelo, costo_alquiler_mensual) VALUES
    ('CAT-EX200', 15000.00),
    ('BOBCAT-T590', 9800.50);

INSERT INTO maquinas_en_uso (modelo, id_cliente, ubicacion_cliente) VALUES
    ('CAT-EX200', 1, 'Obra zona Cordón'),
    ('BOBCAT-T590', 2, 'Parque industrial Norte');

INSERT INTO tecnicos (ci, nombre, apellido, contacto) VALUES
    (45781234, 'Javier', 'Rodríguez', '099111222'),
    (50871234, 'Martina', 'Fernández', '098444555');

INSERT INTO mantenimientos (id, id_maquina_en_uso, ci_tecnico, tipo, fecha, observaciones) VALUES
    (1, 1, 45781234, 'Cambio de filtro', '2025-05-01 08:00:00', 'Filtro de aire obstruido'),
    (2, 2, 50871234, 'Lubricación general', '2025-05-15 10:00:00', 'Aplicado aceite de alto rendimiento');

INSERT INTO registro_consumo (id, id_maquina_en_uso, id_insumo, fecha, cantidad_usada) VALUES
    ('rc-001', 1, 1, '2025-05-10', 5),
    ('rc-002', 2, 2, '2025-05-11', 2),
    ('rc-003', 1, 3, '2025-05-12', 10);

-- Crear los usuarios de MySQL
CREATE USER 'admin_user'@'%' IDENTIFIED BY 'adminpass';
CREATE USER 'limited_user'@'%' IDENTIFIED BY 'userpass';

-- Dar acceso total sobre las tablas de marloy
GRANT ALL PRIVILEGES ON marloy.* TO 'admin_user'@'%';

-- Dar acceso limitado al otro usuario
GRANT SELECT, INSERT, UPDATE, DELETE ON marloy.insumos TO 'limited_user'@'%';
GRANT SELECT, INSERT, UPDATE, DELETE ON marloy.clientes TO 'limited_user'@'%';
GRANT SELECT, INSERT, UPDATE, DELETE ON marloy.mantenimientos TO 'limited_user'@'%';

-- Aplicar cambios
FLUSH PRIVILEGES;


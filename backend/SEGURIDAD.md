# Sistema de Autenticación y Autorización - Documentación

## Descripción General

Se ha implementado un sistema robusto de autenticación y autorización en la aplicación Flask para controlar el acceso a los datos de las tablas.

## Componentes Implementados

### 1. Archivo `auth_utils.py`
Contiene los decoradores y utilidades de autenticación:

- **`@login_required`**: Requiere que el usuario esté autenticado
- **`@admin_required`**: Requiere que el usuario sea administrador
- Funciones auxiliares para validar sesiones y obtener información del usuario

### 2. Mejoras en `db.py`
- Validación de sesión antes de crear conexiones
- Función `get_admin_connection()` para operaciones específicas
- Manejo de errores de conexión mejorado

### 3. Niveles de Acceso por Módulo

#### 🔓 **Acceso Público** (Sin autenticación)
- `POST /login/autenticar` - Iniciar sesión
- `GET /health` - Verificación de salud de la API

#### 🔒 **Acceso Autenticado** (Usuarios logueados)
- `GET /clientes/` - Listar clientes
- `POST /clientes/` - Crear cliente
- `PATCH /clientes/` - Editar cliente
- `GET /insumos/` - Listar insumos
- `POST /insumos/` - Crear insumo
- `GET /maquinas/` - Listar máquinas
- `GET /proveedores/` - Listar proveedores

#### 🔐 **Acceso de Administrador** (Solo administradores)
- `POST /login/` - Crear usuarios
- `DELETE /clientes/` - Eliminar clientes
- `POST /maquinas/` - Crear máquinas
- `PATCH /maquinas/` - Editar máquinas
- `DELETE /maquinas/` - Eliminar máquinas
- `POST /proveedores/` - Crear proveedores

### 4. Controles de Seguridad Implementados

#### A Nivel de Aplicación:
- ✅ Verificación de sesión en todas las rutas protegidas
- ✅ Validación de permisos de administrador
- ✅ Manejo de errores de autenticación
- ✅ Validación de campos requeridos
- ✅ Manejo de excepciones globales

#### A Nivel de Base de Datos:
- ✅ Usuarios diferenciados (`admin_user` y `limited_user`)
- ✅ Permisos específicos por tabla
- ✅ Conexiones según tipo de usuario

### 5. Nuevas Rutas Agregadas

#### `/login/verificar-sesion` (GET)
Permite verificar si el usuario está autenticado:
```json
{
  "autenticado": true,
  "correo": "usuario@ejemplo.com",
  "es_administrador": true
}
```

#### `/health` (GET)
Verificación de salud de la API:
```json
{
  "status": "OK",
  "mensaje": "API funcionando correctamente"
}
```

## Estructura de Permisos de Base de Datos

### Usuario Administrador (`admin_user`)
- **Acceso**: Completo a todas las tablas
- **Permisos**: SELECT, INSERT, UPDATE, DELETE
- **Tablas**: Todas las tablas de la base de datos

### Usuario Limitado (`limited_user`)
- **Acceso**: Limitado a tablas específicas
- **Permisos**: SELECT, INSERT, UPDATE, DELETE
- **Tablas**: 
  - `insumos`
  - `clientes`
  - `mantenimientos`

## Flujo de Autenticación

1. **Login**: Usuario envía credenciales a `/login/autenticar`
2. **Validación**: Sistema verifica credenciales contra la tabla `login`
3. **Sesión**: Se establece sesión con `user_type` y `correo`
4. **Acceso**: Cada solicitud valida la sesión y permisos
5. **Conexión DB**: Se usa el usuario de BD apropiado según el tipo de usuario

## Mensajes de Error Estandarizados

- **401 Unauthorized**: "Debe iniciar sesión para acceder a este recurso"
- **403 Forbidden**: "Solo los administradores pueden realizar esta acción"
- **400 Bad Request**: "Faltan campos requeridos: [campos]"
- **404 Not Found**: "[Recurso] no encontrado"
- **409 Conflict**: "Violación de integridad referencial"
- **500 Internal Server Error**: "Error interno del servidor"

## Mejoras de Seguridad Adicionales

### Validación de Integridad Referencial
- Verificación antes de eliminar registros que tienen dependencias
- Mensajes informativos sobre conflictos de integridad

### Manejo de Excepciones
- Captura de errores de base de datos
- Mensajes de error seguros (sin exposición de información sensible)
- Logging de errores para debugging

### Validación de Entrada
- Verificación de campos requeridos
- Validación de tipos de datos
- Prevención de ataques de inyección SQL mediante parámetros

## Recomendaciones Adicionales

Para mejorar aún más la seguridad:

1. **Implementar HTTPS** en producción
2. **Configurar timeouts de sesión**
3. **Implementar rate limiting**
4. **Agregar logging de auditoría**
5. **Implementar tokens JWT** para sesiones más seguras
6. **Hashear contraseñas** con bcrypt
7. **Validar datos de entrada** más estrictamente

## Uso del Sistema

### Para Desarrolladores Frontend:
- Verificar autenticación con `/login/verificar-sesion`
- Manejar errores 401 y 403 para redireccionar al login
- Incluir información del usuario en la interfaz

### Para Administradores:
- Crear usuarios con permisos apropiados
- Monitorear accesos y errores
- Gestionar permisos de base de datos según sea necesario

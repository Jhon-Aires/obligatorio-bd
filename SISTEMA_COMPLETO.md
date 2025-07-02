# Sistema de Autenticación y Navegación - Manual Completo

## 🚀 Funcionalidades Implementadas

### Backend (Rutas de Usuario)

#### ✅ **CRUD Completo de Usuarios** (Solo Administradores)

**1. Crear Usuario**
- **Ruta**: `POST /login/`
- **Acceso**: Solo administradores
- **Función**: Crear nuevos usuarios (admin o limitado)

**2. Listar Usuarios**
- **Ruta**: `GET /login/usuarios`
- **Acceso**: Solo administradores
- **Función**: Ver todos los usuarios del sistema

**3. Eliminar Usuario**
- **Ruta**: `DELETE /login/usuarios`
- **Acceso**: Solo administradores
- **Función**: Eliminar usuarios (no puede eliminarse a sí mismo)

**4. Modificar Usuario**
- **Ruta**: `PATCH /login/usuarios`
- **Acceso**: Solo administradores
- **Función**: Cambiar contraseña o tipo de usuario

**5. Cambiar Contraseña Propia**
- **Ruta**: `PATCH /login/cambiar-contrasena`
- **Acceso**: Cualquier usuario autenticado
- **Función**: Cambiar su propia contraseña

#### 🔐 **Rutas de Autenticación**

**6. Autenticar Usuario**
- **Ruta**: `POST /login/autenticar`
- **Acceso**: Público
- **Función**: Iniciar sesión

**7. Cerrar Sesión**
- **Ruta**: `POST /login/logout`
- **Acceso**: Público
- **Función**: Cerrar sesión actual

**8. Verificar Sesión**
- **Ruta**: `GET /login/verificar-sesion`
- **Acceso**: Público
- **Función**: Verificar si el usuario está autenticado

### Frontend (Navegación Inteligente)

#### 🎯 **Sistema de Navegación Automática**

**1. Login Inteligente**
- Al iniciar sesión correctamente, el usuario es redirigido automáticamente:
  - **Administradores** → `/inicioadm`
  - **Usuarios Limitados** → `/iniciousuario`

**2. Páginas Diferenciadas**
- **Panel de Administrador**: Acceso completo a todas las funcionalidades
- **Panel de Usuario**: Acceso limitado según permisos de base de datos

**3. Protección de Rutas**
- Componente `ProtectedRoute` para verificar autenticación
- Redirección automática según permisos

## 🔧 Cómo Usar el Sistema

### Para Iniciar el Sistema

1. **Backend**:
```bash
cd backend
python app.py
```

2. **Frontend**:
```bash
cd frontend
npm run dev
```

### Usuarios de Prueba

**Administrador**:
- Email: `admin@empresa.com`
- Contraseña: `admin123`

### Flujo de Uso

1. **Accede a** `http://localhost:5173`
2. **Serás redirigido a** `/login`
3. **Ingresa credenciales** y haz clic en "Iniciar Sesión"
4. **Serás redirigido automáticamente** según tu tipo de usuario:
   - Admin → Panel completo
   - Usuario → Panel limitado

## 🛡️ Niveles de Seguridad

### A Nivel de Base de Datos
- **admin_user**: Acceso completo
- **limited_user**: Solo insumos, clientes, mantenimientos

### A Nivel de Aplicación
- **Verificación de sesión** en cada ruta protegida
- **Validación de permisos** por tipo de usuario
- **Redirección automática** según autorización

### A Nivel de Frontend
- **Protección de rutas** con verificación en tiempo real
- **Navegación inteligente** según permisos
- **Componentes diferenciados** para cada tipo de usuario

## 📋 Funcionalidades por Tipo de Usuario

### 👑 **Administrador**
- ✅ Gestionar usuarios (crear, listar, modificar, eliminar)
- ✅ Gestionar proveedores (crear, listar)
- ✅ Gestionar máquinas (crear, editar, eliminar, listar)
- ✅ Gestionar clientes (crear, editar, eliminar, listar)
- ✅ Gestionar insumos (crear, editar, listar)
- ✅ Gestionar mantenimientos, técnicos, etc.
- ✅ Acceso completo a todas las funcionalidades

### 👤 **Usuario Limitado**
- ✅ Gestionar clientes (crear, editar, listar)
- ✅ Gestionar insumos (crear, editar, listar)
- ✅ Gestionar mantenimientos (crear, editar, listar)
- ❌ **NO puede**: eliminar clientes, gestionar máquinas, crear proveedores
- 👀 **Solo consulta**: máquinas y proveedores

## 🎨 Mejoras de UI/UX

### Login Mejorado
- ✅ Diseño moderno con gradientes
- ✅ Mensajes de error claros
- ✅ Estados de carga
- ✅ Información de usuarios de prueba
- ✅ Responsive design

### Paneles de Usuario
- ✅ Interfaces diferenciadas por tipo de usuario
- ✅ Navegación clara y organizada
- ✅ Botones de cerrar sesión
- ✅ Indicadores de permisos
- ✅ Diseño responsive

## 🚨 Próximos Pasos Recomendados

1. **Implementar componentes de gestión de usuarios** en el frontend
2. **Agregar validación de entrada** más robusta
3. **Implementar notificaciones** de éxito/error
4. **Agregar confirmaciones** para acciones destructivas
5. **Implementar paginación** en listados largos
6. **Añadir filtros y búsqueda** en las listas
7. **Implementar cambio de tema** claro/oscuro

## 🔗 Estructura de URLs

```
/login                    # Página de inicio de sesión
/inicioadm               # Panel de administrador
/iniciousuario           # Panel de usuario limitado
/cliente/alta            # Crear cliente
/cliente/listar          # Listar clientes
/insumo/alta            # Crear insumo
/insumo/listar          # Listar insumos
... (resto de rutas)
```

El sistema ahora tiene un control de acceso robusto con navegación inteligente basada en los permisos del usuario. ¡Está listo para usar!

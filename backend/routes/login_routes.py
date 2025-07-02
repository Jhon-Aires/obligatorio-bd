from flask import Blueprint, request, jsonify, session
from db import get_connection, get_admin_connection
from auth_utils import admin_required, login_required

login_bp = Blueprint('login_bp', __name__)

# Ruta para crear usuarios (admin o limitado) - Solo administradores
@login_bp.route('/', methods=['POST'])
@admin_required
def crear_login():
    datos = request.json
    
    # Validar campos requeridos
    if not all(k in datos for k in ('correo', 'contrasena', 'es_administrador')):
        return jsonify({"error": "Faltan campos requeridos: correo, contrasena, es_administrador"}), 400
    
    try:
        conn = get_connection()  # Usa el usuario según la sesión actual
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO login (correo, contrasena, es_administrador) VALUES (%s, %s, %s)",
            (datos['correo'], datos['contrasena'], datos['es_administrador'])
        )
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({"mensaje": "Usuario creado exitosamente"}), 201
    except Exception as e:
        return jsonify({"error": f"Error al crear usuario: {str(e)}"}), 500


# Ruta para autenticar login
@login_bp.route('/autenticar', methods=['POST'])
def autenticar_login():
    datos = request.json
    
    # Validar campos requeridos
    if not datos or not all(k in datos for k in ('correo', 'contrasena')):
        return jsonify({"error": "Faltan campos requeridos: correo y contrasena"}), 400
    
    correo = datos.get('correo')
    contrasena = datos.get('contrasena')

    try:
        # Conexión con usuario administrador para acceder a la tabla login
        conn = get_admin_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM login WHERE correo = %s AND contrasena = %s", (correo, contrasena))
        usuario = cursor.fetchone()
        cursor.close()
        conn.close()

        if usuario:
            # Guardar tipo de usuario en sesión
            session['user_type'] = 'admin' if usuario['es_administrador'] else 'limited'
            session['correo'] = usuario['correo']

            return jsonify({
                "mensaje": "Login exitoso",
                "es_administrador": usuario['es_administrador'],
                "correo": usuario['correo']
            }), 200
        else:
            return jsonify({"mensaje": "Credenciales incorrectas"}), 401
            
    except Exception as e:
        return jsonify({"error": f"Error en la autenticación: {str(e)}"}), 500


# Ruta para cerrar sesión
@login_bp.route('/logout', methods=['POST'])
def logout():
    session.clear()
    return jsonify({"mensaje": "Sesión cerrada"}), 200

# Ruta para verificar el estado de la sesión
@login_bp.route('/verificar-sesion', methods=['GET'])
def verificar_sesion():
    if 'user_type' in session and 'correo' in session:
        return jsonify({
            "autenticado": True,
            "correo": session['correo'],
            "es_administrador": session['user_type'] == 'admin'
        }), 200
    else:
        return jsonify({"autenticado": False}), 200

# Ruta para listar usuarios - Solo administradores
@login_bp.route('/usuarios', methods=['GET'])
@admin_required
def listar_usuarios():
    try:
        conn = get_admin_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT correo, es_administrador FROM login ORDER BY correo")
        usuarios = cursor.fetchall()
        cursor.close()
        conn.close()
        return jsonify(usuarios), 200
    except Exception as e:
        return jsonify({"error": f"Error al listar usuarios: {str(e)}"}), 500

# Ruta para eliminar usuarios - Solo administradores
@login_bp.route('/usuarios', methods=['DELETE'])
@admin_required
def eliminar_usuario():
    datos = request.json
    
    if not datos or 'correo' not in datos:
        return jsonify({"error": "Falta el parámetro correo"}), 400
    
    # Verificar que no se elimine a sí mismo
    if datos['correo'] == session.get('correo'):
        return jsonify({"error": "No puede eliminar su propia cuenta"}), 400
    
    try:
        conn = get_admin_connection()
        cursor = conn.cursor()
        
        cursor.execute("DELETE FROM login WHERE correo = %s", (datos['correo'],))
        conn.commit()
        
        if cursor.rowcount == 0:
            return jsonify({"error": "Usuario no encontrado"}), 404
        
        cursor.close()
        conn.close()
        return jsonify({"mensaje": "Usuario eliminado exitosamente"}), 200
    except Exception as e:
        return jsonify({"error": f"Error al eliminar usuario: {str(e)}"}), 500

# Ruta para modificar usuarios - Solo administradores
@login_bp.route('/usuarios', methods=['PATCH'])
@admin_required
def modificar_usuario():
    datos = request.json
    
    if not datos or 'correo' not in datos:
        return jsonify({"error": "Falta el parámetro correo"}), 400
    
    campos_actualizados = []
    values = []
    
    # Campos permitidos para actualizar
    campos_permitidos = ['contrasena', 'es_administrador']
    for campo in campos_permitidos:
        if campo in datos:
            campos_actualizados.append(f"{campo} = %s")
            values.append(datos[campo])
    
    if not campos_actualizados:
        return jsonify({"error": "No hay campos para actualizar"}), 400
    
    values.append(datos['correo'])
    
    try:
        conn = get_admin_connection()
        cursor = conn.cursor()
        
        query = f"UPDATE login SET {', '.join(campos_actualizados)} WHERE correo = %s"
        cursor.execute(query, values)
        conn.commit()
        
        if cursor.rowcount == 0:
            return jsonify({"error": "Usuario no encontrado"}), 404
        
        cursor.close()
        conn.close()
        return jsonify({"mensaje": "Usuario modificado exitosamente"}), 200
    except Exception as e:
        return jsonify({"error": f"Error al modificar usuario: {str(e)}"}), 500

# Ruta para cambiar contraseña - Usuarios autenticados
@login_bp.route('/cambiar-contrasena', methods=['PATCH'])
@login_required
def cambiar_contrasena():
    datos = request.json
    
    if not datos or not all(k in datos for k in ('contrasena_actual', 'contrasena_nueva')):
        return jsonify({"error": "Faltan campos requeridos: contrasena_actual, contrasena_nueva"}), 400
    
    correo_usuario = session.get('correo')
    
    try:
        conn = get_admin_connection()
        cursor = conn.cursor(dictionary=True)
        
        # Verificar contraseña actual
        cursor.execute("SELECT * FROM login WHERE correo = %s AND contrasena = %s", 
                      (correo_usuario, datos['contrasena_actual']))
        usuario = cursor.fetchone()
        
        if not usuario:
            return jsonify({"error": "Contraseña actual incorrecta"}), 401
        
        # Actualizar contraseña
        cursor.execute("UPDATE login SET contrasena = %s WHERE correo = %s",
                      (datos['contrasena_nueva'], correo_usuario))
        conn.commit()
        
        cursor.close()
        conn.close()
        return jsonify({"mensaje": "Contraseña cambiada exitosamente"}), 200
    except Exception as e:
        return jsonify({"error": f"Error al cambiar contraseña: {str(e)}"}), 500

from flask import Blueprint, request, jsonify, session
from db import get_connection, get_admin_connection
from auth_utils import admin_required

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

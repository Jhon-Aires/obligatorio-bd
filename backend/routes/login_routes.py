from flask import Blueprint, request, jsonify, session
from db import get_connection

login_bp = Blueprint('login_bp', __name__)

# Ruta para crear usuarios (admin o limitado)
@login_bp.route('/', methods=['POST'])
def crear_login():
    datos = request.json
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


# Ruta para autenticar login
@login_bp.route('/autenticar', methods=['POST'])
def autenticar_login():
    datos = request.json
    correo = datos.get('correo')
    contrasena = datos.get('contrasena')

    # Conexión con usuario que tiene acceso a la tabla login (por seguridad, usamos admin_user aquí)
    import mysql.connector
    conn = mysql.connector.connect(
        host="database",
        user="admin_user",
        password="adminpass",
        database="marloy"
    )
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM login WHERE correo = %s AND contrasena = %s", (correo, contrasena))
    usuario = cursor.fetchone()
    cursor.close()
    conn.close()

    if usuario:
        # Guardar tipo de usuario en sesión
        session['user_type'] = 'admin' if usuario['es_administrador'] else 'limited'
        session['correo'] = usuario['correo']  # opcional

        return jsonify({
            "mensaje": "Login exitoso",
            "es_administrador": usuario['es_administrador']
        }), 200
    else:
        return jsonify({"mensaje": "Credenciales incorrectas"}), 401


# Ruta para cerrar sesión
@login_bp.route('/logout', methods=['POST'])
def logout():
    session.clear()
    return jsonify({"mensaje": "Sesión cerrada"}), 200

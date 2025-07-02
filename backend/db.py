import mysql.connector
from flask import session

def get_connection():
    """
    Devuelve la conexión a la base de datos usando el usuario según el tipo guardado en sesión.
    Si no hay sesión activa, lanza una excepción para mayor seguridad.
    """
    user_type = session.get("user_type")
    
    # Verificar que hay una sesión válida
    if not user_type:
        raise Exception("Sesión no válida. Debe iniciar sesión primero.")

    if user_type == "admin":
        user = "admin_user"
        password = "adminpass"
    else:
        user = "limited_user"
        password = "userpass"

    try:
        return mysql.connector.connect(
            host="database",  # Docker service name
            user=user,
            password=password,
            database="marloy"
        )
    except mysql.connector.Error as err:
        raise Exception(f"Error de conexión a la base de datos: {err}")

def get_admin_connection():
    """
    Devuelve una conexión de administrador para operaciones específicas como login.
    Solo debe usarse en casos muy específicos.
    """
    try:
        return mysql.connector.connect(
            host="database",
            user="admin_user",
            password="adminpass",
            database="marloy"
        )
    except mysql.connector.Error as err:
        raise Exception(f"Error de conexión de administrador: {err}")

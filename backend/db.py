import mysql.connector
from flask import session

#user="root",
#password="rootdocker"
def get_connection():
    """
    Devuelve la conexión a la base de datos usando el usuario según el tipo guardado en sesión.
    Por defecto, usa 'limited_user'.
    """
    user_type = session.get("user_type", "limited")

    if user_type == "admin":
        user = "admin_user"
        password = "adminpass"
    else:
        user = "limited_user"
        password = "userpass"

    return mysql.connector.connect(
        host="database",  # Docker service name
        user=user,
        password=password,
        database="marloy"
    )

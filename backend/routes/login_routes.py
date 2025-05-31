from flask import Blueprint, request, jsonify
from db import get_connection

login_bp = Blueprint('login_bp', __name__)


@login_bp.route('/', methods=['POST'])
def crear_login():
    datos = request.json
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO login (correo, contrasena, es_administrador) VALUES (%s, %s, %s)",
        (datos['correo'], datos['contrasena'], datos['es_administrador'])
    )
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({"mensaje": "login exitoso"}), 201
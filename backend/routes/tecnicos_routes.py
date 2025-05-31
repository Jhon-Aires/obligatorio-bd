from flask import Blueprint, request, jsonify
from db import get_connection

tecnicos_bp = Blueprint('tecnicos_bp', __name__)

@tecnicos_bp.route('/', methods=['GET'])
def listar_tecnicos():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM tecnicos")
    resultado = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(resultado)

@tecnicos_bp.route('/', methods=['POST'])
def crear_tecnicos():
    datos = request.json
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO tecnicos  (ci, nombre, apellido, contacto) VALUES (%s, %s, %s)",
        (datos['ci'], datos['nombre'], datos['apellido'], datos['contacto'])
    )
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({"mensaje": "registro creado"}), 201
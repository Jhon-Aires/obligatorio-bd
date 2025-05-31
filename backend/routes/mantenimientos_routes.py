from flask import Blueprint, request, jsonify
from db import get_connection

mantenimientos_bp = Blueprint('mantenimeintos_bp', __name__)


# #GET y POST de mantenimientos
@mantenimientos_bp.route('/', methods=['GET'])
def listar_mantenimientos():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM mantenimientos")
    resultado = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(resultado)

@mantenimientos_bp.route('/', methods=['POST'])
def crear_mantenimiento():
    datos = request.json
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO mantenimientos (id, id_maquina_en_uso, ci_tecnico, tipo, fecha, observaciones) VALUES (%s, %s, %s)",
        (datos['id'], datos['id_maquina_en_uso'], datos['ci_tecnico'], datos['tipo'], datos['fecha'], datos['observaciones'])
    )
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({"mensaje": "Mantenimiento creado"}), 201
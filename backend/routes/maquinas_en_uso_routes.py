from flask import Blueprint, request, jsonify
from db import get_connection

maquinas_en_uso_bp = Blueprint('maquinas_en_uso_bp', __name__)



# #GET y POST de maquinas en uso
@maquinas_en_uso_bp.route('/', methods=['GET'])
def listar_maquinas_en_uso():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM maquinas_en_uso")
    resultado = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(resultado)

@maquinas_en_uso_bp.route('/', methods=['POST'])
def crear_maquina_en_uso():
    datos = request.json
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO maquinas_en_uso (modelo, id_cliente, ubicacion_cliente) VALUES (%s, %s, %s)",
        (datos['modelo'], datos['id_cliente'], datos['ubicacion_cliente'])
    )
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({"mensaje": "Maquina asignada"}), 201
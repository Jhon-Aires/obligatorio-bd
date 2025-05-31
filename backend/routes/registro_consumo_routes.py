from flask import Blueprint, request, jsonify
from db import get_connection

registro_consumo_bp = Blueprint('registro_consumo_bp', __name__)



# #GET y POST de registro_consumo
@registro_consumo_bp.route('/', methods=['GET'])
def listar_registro_consumo():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM registro_consumo")
    resultado = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(resultado)

@registro_consumo_bp.route('/', methods=['POST'])
def crear_registro_consumo():
    datos = request.json
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO registro_consumo (id, id_maquina_en_uso, id_insumo, fecha, cantidad_usada) VALUES (%s, %s, %s)",
        (datos['id'], datos['id_maquina_en_uso'], datos['id_insumo'], datos['fecha'], datos['cantidad_usada'])
    )
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({"mensaje": "registro creado"}), 201
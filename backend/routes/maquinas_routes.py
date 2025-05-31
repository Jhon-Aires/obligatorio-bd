from flask import Blueprint, request, jsonify
from db import get_connection

maquinas_bp = Blueprint('maquinas_bp', __name__)

@maquinas_bp.route('/', methods=['GET'])
def listar_maquinas():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM maquinas")
    resultado = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(resultado)

@maquinas_bp.route('/', methods=['POST'])
def crear_maquina():
    datos = request.json
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO maquinas (modelo, costo_alquiler_mensual) VALUES (%s, %s, %s)",
        (datos['modelo'], datos['costo_alquiler_mensual'])
    )
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({"mensaje": "Maquina creada"}), 201
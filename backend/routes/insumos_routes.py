from flask import Blueprint, request, jsonify
from db import get_connection

insumos_bp = Blueprint('insumos_bp', __name__)


# #GET y POST de insumos
@insumos_bp.route('/', methods=['GET'])
def listar_insumos():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM insumos")
    resultado = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(resultado)

@insumos_bp.route('/', methods=['POST'])
def crear_insumo():
    datos = request.json
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO insumos (descripcion, tipo, precio_unitario, id_proveedor) VALUES (%s, %s, %s)",
        (datos['descripcion'], datos['tipo'], datos['precio_unitario'], datos['id_proveedor'])
    )
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({"mensaje": "insumo creado"}), 201
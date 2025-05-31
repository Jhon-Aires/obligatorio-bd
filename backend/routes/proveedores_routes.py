from flask import Blueprint, request, jsonify
from db import get_connection

proveedores_bp = Blueprint('proveedores_bp', __name__)



# #GET y POST de proveedores
@proveedores_bp.route('/', methods=['GET'])
def listar_proveedores():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM proveedores")
    resultado = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(resultado)

@proveedores_bp.route('/', methods=['POST'])
def crear_proveedor():
    datos = request.json
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO proveedores (nombre, apellido, contacto) VALUES (%s, %s, %s)",
        (datos['nombre'], datos['apellido'], datos['contacto'])
    )
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({"mensaje": "Proveedor creado"}), 201
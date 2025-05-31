from flask import Blueprint, request, jsonify
from db import get_connection

clientes_bp = Blueprint('clientes_bp', __name__)

@clientes_bp.route('/', methods=['GET'])
def listar_clientes():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM clientes")
    resultado = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(resultado)

@clientes_bp.route('/', methods=['POST'])
def crear_cliente():
    datos = request.json
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO clientes (nombre, direccion, contacto, correo) VALUES (%s, %s, %s)",
        (datos['nombre'], datos['direccion'], datos['contacto'], datos['correo'])
    )
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({"mensaje": "cliente creado"}), 201


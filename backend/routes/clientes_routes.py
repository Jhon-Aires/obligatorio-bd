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
    return jsonify(resultado), 200

@clientes_bp.route('/', methods=['POST'])
def crear_cliente():
    datos = request.json
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO clientes (nombre, direccion, contacto, correo) VALUES (%s, %s, %s, %s)",
        (datos['nombre'], datos['direccion'], datos['contacto'], datos['correo'])
    )
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({"mensaje": "cliente creado"}), 201

#Version basica, el json debe darle el id coincidente y los datos nuevos que quiere editar para luego editarlos
#ventaja: se puede editar todo de una, desventaja: se debe tener todos los datos si se quiere editar una cosa sola
@clientes_bp.route('/', methods=['PATCH'])
def editar_cliente():
    datos = request.json
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(
        "UPDATE clientes SET nombre = %s, direccion = %s, contacto = %s, correo = %s WHERE id = %s",
        (datos['nombre'], datos['direccion'], datos['contacto'], datos['correo'], datos ['id'])
    )
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({"mensaje": "Cliente modificado"}), 204

#Se permite borrar solo por ID
@clientes_bp.route('/', methods=['DELETE'])
def eliminar_cliente():
    datos = request.json
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(
        "DELETE FROM clientes WHERE id= %d" %
        (datos['id'])
    )
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({"mensaje": "cliente eliminado"}), 204


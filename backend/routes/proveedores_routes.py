from flask import Blueprint, request, jsonify
from db import get_connection

proveedores_bp = Blueprint('proveedores_bp', __name__)


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

@proveedores_bp.route('/', methods=['PATCH'])
def editar_proveedor():
    datos = request.json
    conn = get_connection()
    cursor = conn.cursor()
    if 'id' not in datos:
        return jsonify({"error": "Falta el parametro id"}), 400
    
    campos_actualizados = []
    values = []

    #Se construye la query en base a los campos que le pasaste por json
    campos_permitidos = ['nombre', 'apellido', 'contacto']
    for campo in campos_permitidos:
        if campo in datos:
            campos_actualizados.append(f"{campo} = %s")
            values.append(datos[campo])

    if not campos_actualizados:
        return jsonify({"error": "No hay datos a actualizar"}), 400
    
    values.append(datos['id'])  # Como ya tenemos el id, se usa en la condición WHERE
    
    query = f"""
        UPDATE proveedores
        SET {', '.join(campos_actualizados)}
        WHERE id = %s
    """
    cursor.execute(query, values)
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({"mensaje": "Proveedor modificado"}), 204


# Se permite borrar solo por ID
@proveedores_bp.route('/', methods=['DELETE'])
def eliminar_proveedor():
    datos = request.json
    if 'id' not in datos:
        return jsonify({"error": "Falta el parámetro id"}), 400

    conn = get_connection() 
    cursor = conn.cursor()
        # Consultar si tiene máquinas en uso
    cursor.execute(
        "SELECT COUNT(*) FROM insumos WHERE id_proveedor = %s",(datos['id'],))
    cantidad_insumos = cursor.fetchone()[0]
    
    if cantidad_insumos > 0:
        return (jsonify({"error": f"Hay {cantidad_insumos} insumo(s) asignados al proveedor. Elimine dichos insumos."}),409)
    
    #Elimina proveedor si no tiene insumos asignados
    cursor.execute(
        "DELETE FROM proveedores WHERE id = %s",(datos['id'],))
    conn.commit()

    if cursor.rowcount == 0:
        return jsonify({"error": "Proveedor no encontrado"}), 404

    return jsonify({"mensaje": "Proveedor eliminado"}), 200

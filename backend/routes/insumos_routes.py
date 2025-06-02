from flask import Blueprint, request, jsonify
from db import get_connection

insumos_bp = Blueprint('insumos_bp', __name__)

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
        "INSERT INTO insumos (descripcion, tipo, precio_unitario, id_proveedor) VALUES (%s, %s, %s, %s)",
        (datos['descripcion'], datos['tipo'], datos['precio_unitario'], datos['id_proveedor'])
    )
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({"mensaje": "insumo creado"}), 201

#sin hacer
@insumos_bp.route('/', methods=['PATCH'])
def editar_insumo():
    datos = request.json
    conn = get_connection()
    cursor = conn.cursor()
    if 'id' not in datos:
        return jsonify({"error": "Falta el parametro id"}), 400
    
    campos_actualizados = []
    values = []

    #Se construye la query en base a los campos que le pasaste por json
    campos_permitidos = ['descripcion', 'tipo', 'precio_unitario', 'id_proveedor']
    for campo in campos_permitidos:
        if campo in datos:
            campos_actualizados.append(f"{campo} = %s")
            values.append(datos[campo])

    if not campos_actualizados:
        return jsonify({"error": "Sin campos para actualizar"}), 400
    
    values.append(datos['id'])  # Como ya tenemos el id, se usa en la condición WHERE
    
    query = f"""
        UPDATE insumos
        SET {', '.join(campos_actualizados)}
        WHERE id = %s
    """
    cursor.execute(query, values)
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({"mensaje": "Insumo modificado"}), 204


#Se permite borrar solo por ID, falta borrado en cascada en la base y en el backend
@insumos_bp.route('/', methods=['DELETE'])
def eliminar_insumo():
    datos = request.json
    if 'id' not in datos:
        return jsonify({"error": "Falta el parámetro id"}), 400

    conn = get_connection() 
    cursor = conn.cursor()
        # Consultar si hay registros de consumo
    cursor.execute(
        "SELECT COUNT(*) FROM registro_consumo WHERE id_insumo = %s",(datos['id'],))
    cantidad_registros = cursor.fetchone()[0]
    
    if cantidad_registros > 0:
        return (jsonify({"error": f"El insumo tiene {cantidad_registros} registro(s) guardados. Elimine dichos registros."}),409)
       
    #Elimina insumo si no tiene máquinas en uso
    cursor.execute(
        "DELETE FROM insumos WHERE id = %s",(datos['id'],))
    conn.commit()

    if cursor.rowcount == 0:
        return jsonify({"error": "insumo no encontrado"}), 404

    return jsonify({"mensaje": "insumo eliminado"}), 200

from flask import Blueprint, request, jsonify
from db import get_connection

mantenimientos_bp = Blueprint('mantenimeintos_bp', __name__)


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
        "INSERT INTO mantenimientos (id, id_maquina_en_uso, ci_tecnico, tipo, fecha, observaciones) VALUES (%s, %s, %s, %s, %s, %s)",
        (datos['id'], datos['id_maquina_en_uso'], datos['ci_tecnico'], datos['tipo'], datos['fecha'], datos['observaciones'])
    )
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({"mensaje": "Mantenimiento creado"}), 201

#Falta atajar el caso de cambiar foreign keys por otras inexistentes
@mantenimientos_bp.route('/', methods=['PATCH'])
def editar_mantenimiento():
    datos = request.json
    conn = get_connection()
    cursor = conn.cursor()
    if 'id' not in datos:
        return jsonify({"error": "Falta el parametro id"}), 400
    
    campos_actualizados = []
    values = []

    #Se construye la query en base a los campos que le pasaste por json
    campos_permitidos = ['id', 'id_maquina_en_uso', 'ci_tecnico', 'tipo', 'fecha', 'observaciones']
    for campo in campos_permitidos:
        if campo in datos:
            campos_actualizados.append(f"{campo} = %s")
            values.append(datos[campo])

    if not campos_actualizados:
        return jsonify({"error": "No hay campos a actualizar"}), 400
    
    values.append(datos['id'])  # Como ya tenemos el id, se usa en la condición WHERE
    
    query = f"""
        UPDATE mantenimientos
        SET {', '.join(campos_actualizados)}
        WHERE id = %s
    """
    cursor.execute(query, values)
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({"mensaje": "Mantenimiento modificado"}), 204
#Se permite borrar solo por ID
@mantenimientos_bp.route('/', methods=['DELETE'])
def eliminar_mantenimiento():
    datos = request.json
    if 'id' not in datos:
        return jsonify({"error": "Falta el parámetro id"}), 400

    conn = get_connection() 
    cursor = conn.cursor()
        #Se puede eliminar sin depender de ninguna otra tabla
    cursor.execute(
        "DELETE FROM mantenimientos WHERE id = %s",(datos['id'],))
    conn.commit()

    if cursor.rowcount == 0:
        return jsonify({"error": "Mantenimiento no encontrado"}), 404

    return jsonify({"mensaje": "Mantenimiento eliminado"}), 200

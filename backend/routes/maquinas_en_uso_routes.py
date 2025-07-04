from flask import Blueprint, request, jsonify
from db import get_connection
import re

maquinas_en_uso_bp = Blueprint('maquinas_en_uso_bp', __name__)

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
    campos = ['modelo', 'id_cliente', 'ubicacion_cliente']

    if not datos:
        return jsonify({"error": "Ingrese sus datos correctamente"}), 400

    for campo in campos:
        if campo not in datos:
            return jsonify({"error": f"Falta el campo requerido: {campo}"}), 400

        valor = datos[campo]

        if campo == 'modelo':
            if not isinstance(valor, str) or valor.strip() == "":
                return jsonify({"error": "El modelo debe ser un texto no vacío"}), 400

        elif campo == 'id_cliente':
            if not str(valor).isdigit() or int(valor) <= 0:
                return jsonify({"error": "El id_cliente debe ser un entero positivo"}), 400

        elif campo == 'ubicacion_cliente':
            if not isinstance(valor, str) or valor.strip() == "":
                return jsonify({"error": "La ubicación debe ser un texto no vacío"}), 400

    try:
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO maquinas_en_uso (modelo, id_cliente, ubicacion_cliente) VALUES (%s, %s, %s)",
            (datos['modelo'], datos['id_cliente'], datos['ubicacion_cliente'])
        )
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({"mensaje": "Máquina asignada"}), 201
    except Exception as e:
        return jsonify({"error": f"Error al asignar máquina: {str(e)}"}), 500



@maquinas_en_uso_bp.route('/', methods=['PATCH'])
def editar_maquina_en_uso():
    datos = request.json
    conn = get_connection()
    cursor = conn.cursor()
    if 'id' not in datos:
        return jsonify({"error": "Falta el parametro id"}), 400
    
    campos_actualizados = []
    values = []

    #Se construye la query en base a los campos que le pasaste por json
    campos_permitidos = ['modelo', 'id_cliente', 'ubicacion_cliente']
    for campo in campos_permitidos:
        if campo in datos:
            campos_actualizados.append(f"{campo} = %s")
            values.append(datos[campo])

    if not campos_actualizados:
        return jsonify({"error": "No hay campos a actualizar"}), 400
    
    values.append(datos['id'])  # Como ya tenemos el id, se usa en la condición WHERE
    
    query = f"""
        UPDATE maquinas_en_uso
        SET {', '.join(campos_actualizados)}
        WHERE id = %s
    """
    cursor.execute(query, values)
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({"mensaje": "Máquina en uso modificada"}), 204


#Se permite borrar solo por ID
@maquinas_en_uso_bp.route('/', methods=['DELETE'])
def eliminar_maquina_en_uso():
    datos = request.json
    if 'id' not in datos:
        return jsonify({"error": "Falta el parámetro id"}), 400

    conn = get_connection() 
    cursor = conn.cursor()
    # Elimina maquina en uso
    cursor.execute(
        "DELETE FROM maquinas_en_uso WHERE id = %s",(datos['id'],))
    conn.commit()

    if cursor.rowcount == 0:
        return jsonify({"error": "Máquina en uso no encontrada"}), 404

    return jsonify({"mensaje": "Máquina en uso eliminada"}), 200

from flask import Blueprint, request, jsonify
from db import get_connection
import re
from datetime import datetime

registro_consumo_bp = Blueprint('registro_consumo_bp', __name__)


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
    campos = ['id_maquina_en_uso', 'id_insumo', 'fecha', 'cantidad_usada']

    if not datos:
        return jsonify({"error": "Ingrese sus datos correctamente"}), 400

    for campo in campos:
        if campo not in datos:
            return jsonify({"error": f"Falta el campo requerido: {campo}"}), 400

        valor = datos[campo]

        if campo in ['id_maquina_en_uso', 'id_insumo']:
            if not str(valor).isdigit() or int(valor) <= 0:
                return jsonify({"error": f"El campo '{campo}' debe ser un entero positivo"}), 400

        elif campo == 'fecha':
            try:
                datetime.strptime(valor, '%Y-%m-%d')
            except:
                return jsonify({"error": "La fecha debe tener formato AAAA-MM-DD"}), 400

        elif campo == 'cantidad_usada':
            try:
                if float(valor) <= 0:
                    return jsonify({"error": "La cantidad usada debe ser positiva"}), 400
            except:
                return jsonify({"error": "El campo 'cantidad_usada' debe ser un número"}), 400

    try:
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO registro_consumo (id_maquina_en_uso, id_insumo, fecha, cantidad_usada) VALUES (%s, %s, %s, %s)",
            (
                datos['id_maquina_en_uso'],
                datos['id_insumo'],
                datos['fecha'],
                datos['cantidad_usada']
            )
        )
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({"mensaje": "Registro creado"}), 201
    except Exception as e:
        return jsonify({"error": f"Error al crear registro: {str(e)}"}), 500

@registro_consumo_bp.route('/', methods=['PATCH'])
def editar_registro_consumo():
    datos = request.json
    conn = get_connection()
    cursor = conn.cursor()
    if 'id' not in datos:
        return jsonify({"error": "Falta el parametro id"}), 400
    
    campos_actualizados = []
    values = []
    #Se construye la query en base a los campos que le pasaste por json
    campos_permitidos = ['id_maquina_en_uso', 'id_insumo', 'fecha', 'cantidad_usada']
    for campo in campos_permitidos:
        if campo in datos:
            campos_actualizados.append(f"{campo} = %s")
            values.append(datos[campo])

    if not campos_actualizados:
        return jsonify({"error": "No hay campos a actualizar"}), 400
    
    values.append(datos['id'])  # Como ya tenemos el id, se usa en la condición WHERE
    
    query = f"""
        UPDATE registro_consumo
        SET {', '.join(campos_actualizados)}
        WHERE id = %s
    """
    cursor.execute(query, values)
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({"mensaje": "Registro modificado"}), 204


#Se permite borrar solo por ID
@registro_consumo_bp.route('/', methods=['DELETE'])
def eliminar_registro():
    datos = request.json
    if 'id' not in datos:
        return jsonify({"error": "Falta el parámetro id"}), 400

    conn = get_connection() 
    cursor = conn.cursor()
        # Consultar si tiene máquinas en uso
    cursor.execute(
        "DELETE FROM registro_consumo WHERE id = %s",(datos['id'],))
    conn.commit()

    if cursor.rowcount == 0:
        return jsonify({"error": "Registro no encontrado"}), 404

    return jsonify({"mensaje": "Registro eliminado"}), 200

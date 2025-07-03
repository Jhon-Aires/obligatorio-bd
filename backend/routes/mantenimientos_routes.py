from flask import Blueprint, request, jsonify
from db import get_connection
import re
from datetime import datetime

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
    campos = ['id_maquina_en_uso', 'ci_tecnico', 'tipo', 'fecha', 'observaciones']

    if not datos:
        return jsonify({"error": "Ingrese sus datos correctamente"}), 400

    for campo in campos:
        if campo not in datos:
            return jsonify({"error": f"Falta el campo requerido: {campo}"}), 400

        valor = datos[campo]

        if campo in ['id_maquina_en_uso', 'ci_tecnico']:
            if not str(valor).isdigit() or int(valor) <= 0:
                return jsonify({"error": f"El campo '{campo}' debe ser un entero positivo"}), 400

        elif campo == 'fecha':
            try:
                datetime.strptime(valor, '%Y-%m-%d')
            except:
                return jsonify({"error": "La fecha debe tener formato AAAA-MM-DD"}), 400

        elif campo in ['tipo', 'observaciones']:
            if not isinstance(valor, str) or valor.strip() == "":
                return jsonify({"error": f"El campo '{campo}' debe ser texto no vacío"}), 400

    try:
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO mantenimientos (id_maquina_en_uso, ci_tecnico, tipo, fecha, observaciones) VALUES (%s, %s, %s, %s, %s)",
            (
                datos['id_maquina_en_uso'],
                datos['ci_tecnico'],
                datos['tipo'],
                datos['fecha'],
                datos['observaciones']
            )
        )
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({"mensaje": "Mantenimiento creado"}), 201
    except Exception as e:
        return jsonify({"error": f"Error al crear mantenimiento: {str(e)}"}), 500

@mantenimientos_bp.route('/', methods=['PATCH'])
def editar_mantenimiento():
    datos = request.json
    if not datos or 'id' not in datos:
        return jsonify({"error": "Falta el parámetro id"}), 400

    campos_actualizados = []
    values = []
    try:
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT 1 FROM mantenimientos WHERE id = %s", (datos['id'],))
       
        if not cursor.fetchone():
            return jsonify({"error": "No existe mantenimiento con ese id"}), 404

        if 'id_maquina_en_uso' in datos:
            val = datos['id_maquina_en_uso']
            if val is None:
                return jsonify({"error": "El campo 'id_maquina_en_uso' no puede ser nulo"}), 400
            if not str(val).isdigit() or int(val) <= 0:
                return jsonify({"error": "El campo 'id_maquina_en_uso' debe ser un entero positivo"}), 400

            cursor.execute("SELECT 1 FROM maquinas_en_uso WHERE id = %s", (val,))
            if not cursor.fetchone():
                return jsonify({"error": "No existe máquina en uso con ese id"}), 400

            campos_actualizados.append("id_maquina_en_uso = %s")
            values.append(val)

        if 'ci_tecnico' in datos:
            val = datos['ci_tecnico']
            if val is None:
                return jsonify({"error": "El campo 'ci_tecnico' no puede ser nulo"}), 400
            if not (str(val).isdigit() and 7 <= len(str(val)) <= 8):
                return jsonify({"error": "El campo 'ci_tecnico' debe ser una cédula válida (7 u 8 dígitos)"}), 400

            cursor.execute("SELECT 1 FROM tecnicos WHERE ci = %s", (val,))
            if not cursor.fetchone():
                return jsonify({"error": "No existe técnico con esa cédula"}), 400

            campos_actualizados.append("ci_tecnico = %s")
            values.append(val)

        if 'tipo' in datos:
            tipo = datos['tipo']
            if tipo is None or (isinstance(tipo, str) and tipo.strip() == ""):
                return jsonify({"error": "El campo 'tipo' no puede estar vacío"}), 400
            campos_actualizados.append("tipo = %s")
            values.append(tipo)

        if 'fecha' in datos:
            fecha = datos['fecha']
            if fecha is None or (isinstance(fecha, str) and fecha.strip() == ""):
                return jsonify({"error": "El campo 'fecha' no puede estar vacío"}), 400
            from datetime import datetime
            try:
                datetime.strptime(fecha, '%Y-%m-%d')
            except ValueError:
                return jsonify({"error": "El campo 'fecha' debe tener formato AAAA-MM-DD"}), 400
            campos_actualizados.append("fecha = %s")
            values.append(fecha)

        if 'observaciones' in datos:
            obs = datos['observaciones']
            if obs is None:
                obs = ""
            elif not isinstance(obs, str):
                return jsonify({"error": "El campo 'observaciones' debe ser texto"}), 400
            campos_actualizados.append("observaciones = %s")
            values.append(obs)

        if not campos_actualizados:
            return jsonify({"error": "No hay campos válidos para actualizar"}), 400

        values.append(datos['id'])

        query = f"""
            UPDATE mantenimientos
            SET {', '.join(campos_actualizados)}
            WHERE id = %s
        """

        cursor.execute(query, values)
        conn.commit()
        cursor.close()
        conn.close()

        return jsonify({"mensaje": "Mantenimiento modificado"}), 200

    except Exception as e:
        print(f"[ERROR] {str(e)}")
        return jsonify({"error": f"Error al modificar mantenimiento: {str(e)}"}), 500
    
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

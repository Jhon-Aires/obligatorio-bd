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

    campos_requeridos = ['modelo', 'id_cliente', 'ubicacion_cliente']

    if not datos:
        return jsonify({"error": "Ingrese sus datos"}), 400

    for campo in campos_requeridos:
        valor = datos.get(campo)

        if valor is None or (isinstance(valor, str) and valor.strip() == ""):
            return jsonify({"error": f"El campo '{campo}' no puede estar vacío"}), 400

        if campo == 'modelo':
            if not re.match(r"^[\w\s\-\.\#]+$", valor):
                return jsonify({"error": "El campo 'modelo' contiene caracteres no válidos"}), 400

        elif campo == 'id_cliente':
            if not str(valor).isdigit() or int(valor) <= 0:
                return jsonify({"error": "El campo 'id_cliente' debe ser un número entero positivo"}), 400

        elif campo == 'ubicacion_cliente':
            if len(valor.strip()) < 3:
                return jsonify({"error": "El campo 'ubicacion_cliente' es demasiado corto"}), 400

    # (opcional) verificar existencia del cliente
    try:
        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute("SELECT 1 FROM clientes WHERE id = %s", (datos['id_cliente'],))
        if not cursor.fetchone():
            return jsonify({"error": "El cliente especificado no existe"}), 400

        cursor.execute(
            "INSERT INTO maquinas_en_uso (modelo, id_cliente, ubicacion_cliente) VALUES (%s, %s, %s)",
            (datos['modelo'], datos['id_cliente'], datos['ubicacion_cliente'])
        )
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({"mensaje": "Máquina asignada"}), 201
    except Exception as e:
        print(f"[ERROR] {str(e)}")
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
        # Consultar si tiene registros de consumo esta maquina
    cursor.execute(
        "SELECT COUNT(*) FROM registro_consumo WHERE id_maquina_en_uso = %s",(datos['id'],))
    cantidad_registros = cursor.fetchone()[0]
    
    if cantidad_registros > 0:
        return (jsonify({"error": f"La máquina en uso tiene {cantidad_registros} registro(s) en uso. Elimine dichos registros."}),409)
    
    #Se consulta si tiene mantenimientos esta máquina
    cursor.execute(
        "SELECT COUNT(*) FROM mantenimientos WHERE id_maquina_en_uso = %s",(datos['id'],))
    cantidad_mantenimientos = cursor.fetchone()[0]
    
    if cantidad_mantenimientos > 0:
        return (jsonify({"error": f"La máquina en uso tiene {cantidad_mantenimientos} mantenimiento(s) agendados. Elimine dichos mantenimientos."}),409)
       
    #Elimina maquina en uso
    cursor.execute(
        "DELETE FROM maquinas_en_uso WHERE id = %s",(datos['id'],))
    conn.commit()

    if cursor.rowcount == 0:
        return jsonify({"error": "Máquina en uso no encontrada"}), 404

    return jsonify({"mensaje": "Máquina en uso eliminada"}), 200

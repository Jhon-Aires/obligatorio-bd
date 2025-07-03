from flask import Blueprint, request, jsonify
from db import get_connection
import re

tecnicos_bp = Blueprint('tecnicos_bp', __name__)

@tecnicos_bp.route('/', methods=['GET'])
def listar_tecnicos():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM tecnicos")
    resultado = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(resultado)

@tecnicos_bp.route('/', methods=['POST'])
def crear_tecnicos():
    datos = request.json
    conn = get_connection()
    cursor = conn.cursor()
    campos_requeridos = ['ci', 'nombre', 'apellido', 'contacto']
    #verificaciones de campo
    alfabetico = re.compile(r"^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s\-]+$")
    for campo in campos_requeridos:
        valor = datos.get(campo)

        if valor is None or str(valor).strip() == "":
            return jsonify({"error": f"El campo '{campo}' no puede estar vacío"}), 400

        if campo == 'ci':
            if not str(valor).isdigit() or not (7 <= len(str(valor)) <= 8):
                return jsonify({"error": "El campo 'ci' debe ser un número de 7 u 8 cifras"}), 400

        elif campo in ['nombre', 'apellido']:
            if not alfabetico.match(valor):
                return jsonify({"error": f"El campo '{campo}' debe contener solo letras"}), 400

        elif campo == 'contacto':
            if not re.fullmatch(r"09\d{7}", valor):
                return jsonify({"error": "El campo 'contacto' debe ser un número de celular válido (ej: 09xxxxxxx)"}), 400

    cursor.execute(
        "INSERT INTO tecnicos  (ci, nombre, apellido, contacto) VALUES (%s, %s, %s)",
        (datos['ci'], datos['nombre'], datos['apellido'], datos['contacto'])
    )
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({"mensaje": "registro creado"}), 201

@tecnicos_bp.route('/', methods=['PATCH'])
def editar_tecnico():
    datos = request.json
    conn = get_connection()
    cursor = conn.cursor()
    if 'ci' not in datos:
        return jsonify({"error": "Falta el parametro ci"}), 400
    
    campos_actualizados = []
    values = []

    #Se construye la query en base a los campos que le pasaste por json
    campos_permitidos = ['nombre', 'apellido', 'contacto']
    for campo in campos_permitidos:
        if campo in datos:
            campos_actualizados.append(f"{campo} = %s")
            values.append(datos[campo])

    if not campos_actualizados:
        return jsonify({"error": "No hay campos a actualizar"}), 400
    
    values.append(datos['ci'])  # Como ya tenemos el id, se usa en la condición WHERE
    
    query = f"""
        UPDATE tecnicos
        SET {', '.join(campos_actualizados)}
        WHERE ci = %s
    """
    cursor.execute(query, values)
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({"mensaje": "Tecnico modificado"}), 204


# #Se permite borrar solo por CI
@tecnicos_bp.route('/', methods=['DELETE'])
def eliminar_tecnico():
    datos = request.json
    if 'ci' not in datos:
        return jsonify({"error": "Falta el parámetro ci"}), 400
    conn = get_connection() 
    cursor = conn.cursor()
    cursor.execute(
        "DELETE FROM tecnicos WHERE ci = %s",(datos['ci'],))
    conn.commit()
    if cursor.rowcount == 0:
        return jsonify({"error": "tecnico no encontrado"}), 404
    return jsonify({"mensaje": "tecnico eliminado"}), 200


@tecnicos_bp.route('/mantenimientos', methods=['GET'])
def tecnicos_ordenados_por_mantenimientos():
    conn = get_connection()
    #cada fila que devuelve la consulta venga como un diccionario, no como una tupla.
    # Devuelve el resultado en formato JSON legible.
    cursor = conn.cursor(dictionary=True)

    cursor.execute("""
        SELECT 
            t.ci,
            t.nombre,
            t.apellido,
            COUNT(m.id) AS cantidad_mantenimientos
        FROM tecnicos t
        LEFT JOIN mantenimientos m ON t.ci = m.ci_tecnico
        GROUP BY t.ci, t.nombre, t.apellido
        ORDER BY cantidad_mantenimientos DESC
    """)

    resultado = cursor.fetchall()
    cursor.close()
    conn.close()

    return jsonify(resultado), 200

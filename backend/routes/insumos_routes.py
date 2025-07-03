from flask import Blueprint, request, jsonify
from db import get_connection
from auth_utils import login_required, admin_required
import re

insumos_bp = Blueprint('insumos_bp', __name__)

@insumos_bp.route('/', methods=['GET'])
@login_required
def listar_insumos():
    try:
        conn = get_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM insumos")
        resultado = cursor.fetchall()
        cursor.close()
        conn.close()
        return jsonify(resultado), 200
    except Exception as e:
        return jsonify({"error": f"Error al listar insumos: {str(e)}"}), 500

@insumos_bp.route('/', methods=['POST'])
@login_required
def crear_insumo():
    datos = request.json

    campos_requeridos = ['descripcion', 'tipo', 'precio_unitario', 'id_proveedor']
    errores = []

    # Expresiones para validar texto
    texto_valido = re.compile(r"^[\w\sáéíóúÁÉÍÓÚñÑ\-,\.]+$")

    if not datos:
        return jsonify({"error": "No se recibió un JSON válido"}), 400

    # Validar campos y construir errores
    for campo in campos_requeridos:
        valor = datos.get(campo)

        if valor is None or (isinstance(valor, str) and valor.strip() == ""):
            errores.append(f"El campo '{campo}' no puede estar vacío")
            continue

        if campo in ['descripcion', 'tipo']:
            if not texto_valido.match(str(valor)):
                errores.append(f"El campo '{campo}' contiene caracteres inválidos")

        elif campo == 'precio_unitario':
            try:
                precio = float(valor)
                if precio <= 0:
                    errores.append("El campo 'precio_unitario' debe ser un número positivo")
            except (ValueError, TypeError):
                errores.append("El campo 'precio_unitario' debe ser un número válido")

        elif campo == 'id_proveedor':
            if not str(valor).isdigit() or int(valor) <= 0:
                errores.append("El campo 'id_proveedor' debe ser un entero positivo")

    if errores:
        return jsonify({"errores": errores}), 400

    # validar que el id_proveedor exista en la base
    try:
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT 1 FROM proveedores WHERE id = %s", (datos['id_proveedor'],))
        if not cursor.fetchone():
            return jsonify({"error": "El proveedor especificado no existe"}), 400

        cursor.execute(
            "INSERT INTO insumos (descripcion, tipo, precio_unitario, id_proveedor) VALUES (%s, %s, %s, %s)",
            (datos['descripcion'], datos['tipo'], datos['precio_unitario'], datos['id_proveedor'])
        )
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({"mensaje": "Insumo creado exitosamente"}), 201

    except Exception as e:
        return jsonify({"error": f"Error al crear insumo: {str(e)}"}), 500

@insumos_bp.route('/', methods=['PATCH'])
@login_required
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

#Se permite borrar solo por ID
@insumos_bp.route('/consumo', methods=['DELETE'])
@login_required
def eliminar_insumo():
    datos = request.json
    if 'id' not in datos:
        return jsonify({"error": "Falta el parámetro id"}), 400

    conn = get_connection() 
    cursor = conn.cursor()

    #Elimina insumo y los registro consumo porque borra en cascada
    cursor.execute(
        "DELETE FROM insumos WHERE id = %s",(datos['id'],))
    conn.commit()

    if cursor.rowcount == 0:
        return jsonify({"error": "insumo no encontrado"}), 404

    return jsonify({"mensaje": "insumo eliminado"}), 200

#Insumos ordenados por mayor consumo total (en unidades) y su costo total (precio × cantidad usada).
@insumos_bp.route('/consumo', methods=['GET'])
@login_required
def insumos_mas_consumidos():
    #No pide ningún filtro asi que no se llaman parametros
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    
    cursor.execute("""
        SELECT 
            i.id,
            i.descripcion,
            SUM(rc.cantidad_usada) AS total_consumido,
            i.precio_unitario,
            SUM(rc.cantidad_usada * i.precio_unitario) AS costo_total
        FROM insumos i
        JOIN registro_consumo rc ON i.id = rc.id_insumo
        GROUP BY i.id, i.descripcion, i.precio_unitario
        ORDER BY total_consumido DESC
    """)
    
    resultado = cursor.fetchall()
    cursor.close()
    conn.close()
    
    return jsonify(resultado), 200
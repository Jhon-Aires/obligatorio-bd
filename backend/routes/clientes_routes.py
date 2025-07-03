from flask import Blueprint, request, jsonify
from db import get_connection
from auth_utils import login_required, admin_required
import re

clientes_bp = Blueprint('clientes_bp', __name__)

@clientes_bp.route('/', methods=['GET'])
@login_required
def listar_clientes():
    try:
        conn = get_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM clientes")
        resultado = cursor.fetchall()
        cursor.close()
        conn.close()
        return jsonify(resultado), 200
    except Exception as e:
        return jsonify({"error": f"Error al listar clientes: {str(e)}"}), 500

@clientes_bp.route('/', methods=['POST'])
@login_required
def crear_cliente():
    datos = request.json
    campos = ['nombre', 'direccion']
    alfabetico = re.compile(r"^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s\-]+$")

    if not datos:
        return jsonify({"error": "Ingrese sus datos correctamente"}), 400

    for campo in campos:
        if campo not in datos:
            return jsonify({"error": f"Falta el campo requerido: {campo}"}), 400

        valor = datos[campo]

        if campo == 'nombre':
            if not isinstance(valor, str) or not alfabetico.match(valor):
                return jsonify({"error": "El nombre solo puede contener letras"}), 400

        elif campo == 'direccion':
            if not isinstance(valor, str) or valor.strip() == "":
                return jsonify({"error": "La dirección debe ser un texto no vacío"}), 400

    if 'contacto' in datos:
        if not str(datos['contacto']).isdigit():
            return jsonify({"error": "El contacto debe ser un número"}), 400

    if 'correo' in datos:
        if not isinstance(datos['correo'], str) or '@' not in datos['correo']:
            return jsonify({"error": "El correo debe ser una dirección válida"}), 400

    try:
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO clientes (nombre, direccion, contacto, correo) VALUES (%s, %s, %s, %s)",
            (datos['nombre'], datos['direccion'], datos.get('contacto'), datos.get('correo'))
        )
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({"mensaje": "Cliente creado exitosamente"}), 201
    except Exception as e:
        return jsonify({"error": f"Error al crear cliente: {str(e)}"}), 500

#Version avanzada, permite editar 1, 2 o 3 atributos o editarlos todos en una misma instancia.
@clientes_bp.route('/', methods=['PATCH'])
@login_required
def editar_cliente():
    datos = request.json
    
    if not datos or 'id' not in datos:
        return jsonify({"error": "Falta el parámetro id"}), 400
    
    try:
        conn = get_connection()
        cursor = conn.cursor()
        
        campos_actualizados = []
        values = []

        #Se construye la query en base a los campos que le pasaste por json
        campos_permitidos = ['nombre', 'direccion', 'contacto', 'correo']
        for campo in campos_permitidos:
            if campo in datos:
                campos_actualizados.append(f"{campo} = %s")
                values.append(datos[campo])

        if not campos_actualizados:
            return jsonify({"error": "No hay campos para actualizar"}), 400
        
        values.append(datos['id'])  # Como ya tenemos el id, se usa en la condición WHERE
        
        query = f"""
            UPDATE clientes
            SET {', '.join(campos_actualizados)}
            WHERE id = %s
        """
        cursor.execute(query, values)
        conn.commit()
        
        if cursor.rowcount == 0:
            return jsonify({"error": "Cliente no encontrado"}), 404
            
        cursor.close()
        conn.close()
        return jsonify({"mensaje": "Cliente modificado exitosamente"}), 200
    except Exception as e:
        return jsonify({"error": f"Error al modificar cliente: {str(e)}"}), 500


#Se permite borrar solo por ID
@clientes_bp.route('/', methods=['DELETE'])
@admin_required  # Solo administradores pueden eliminar clientes
def eliminar_cliente():
    datos = request.json
    
    if not datos or 'id' not in datos:
        return jsonify({"error": "Falta el parámetro id"}), 400

    conn = get_connection() 
    cursor = conn.cursor()
        #Se elimina cliente y sus máquinas en uso porque se borran en cascada
    cursor.execute(
        "DELETE FROM clientes WHERE id = %s",(datos['id'],))
    conn.commit()

    if cursor.rowcount == 0:
            return jsonify({"error": "Cliente no encontrado"}), 404

    return jsonify({"mensaje": "Cliente eliminado"}), 200

# Total mensual a cobrar a cada cliente (suma de alquiler de máquinas más
#costo de insumos consumidos
@clientes_bp.route('/total_mensual', methods=['GET'])
@admin_required
def total_mensual_cliente():
    mes = request.args.get('mes')     # se ponen en la url por ejemplo: 
    anio = request.args.get('anio')   # GET http://localhost:5001/clientes/total-mensual?mes=6&anio=2025

    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

#SUM(DISTINCT m.costo_alquiler_mensual) puede hacer que si una máquina aparece más de una vez en la combinación, 
# su costo solo se cuente una vez.
    query = """
        SELECT 
            c.id AS id_cliente,
            c.nombre AS cliente,
            MONTH(rc.fecha) AS mes,
            YEAR(rc.fecha) AS anio,
            IFNULL(SUM(DISTINCT m.costo_alquiler_mensual), 0) AS total_alquiler, 
            IFNULL(SUM(i.precio_unitario * rc.cantidad_usada), 0) AS total_insumos,
            IFNULL(SUM(DISTINCT m.costo_alquiler_mensual), 0) + 
            IFNULL(SUM(i.precio_unitario * rc.cantidad_usada), 0) AS total_mensual
        FROM clientes c
        LEFT JOIN maquinas_en_uso me ON me.id_cliente = c.id
        LEFT JOIN maquinas m ON m.modelo = me.modelo
        LEFT JOIN registro_consumo rc ON rc.id_maquina_en_uso = me.id
        LEFT JOIN insumos i ON i.id = rc.id_insumo
    """

    filtros = []
    valores = []

    if mes:
        filtros.append("MONTH(rc.fecha) = %s")
        valores.append(mes)
    if anio:
        filtros.append("YEAR(rc.fecha) = %s")
        valores.append(anio)

    if filtros:
        query += " WHERE " + " AND ".join(filtros)

    query += """
        GROUP BY c.id, c.nombre, MONTH(rc.fecha), YEAR(rc.fecha)
        ORDER BY anio DESC, mes DESC, cliente;
    """

    cursor.execute(query, valores)
    resultado = cursor.fetchall()
    cursor.close()
    conn.close()

    return jsonify(resultado), 200

#Clientes ordenados por cant de maquinas
@clientes_bp.route('/cant_maquina', methods=['GET'])
@admin_required
def clientes_ordenados_por_maquinas():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
# las maquinas asociadas a cliente son las máquinas registradas en la tabla maquinas_en_uso
    cursor.execute("""
        SELECT 
            c.id,
            c.nombre,
            c.direccion,
            COUNT(me.id) AS cantidad_maquinas
        FROM clientes c
        LEFT JOIN maquinas_en_uso me ON me.id_cliente = c.id
        GROUP BY c.id, c.nombre, c.direccion
        ORDER BY cantidad_maquinas DESC;
    """)

    resultado = cursor.fetchall()
    cursor.close()
    conn.close()

    return jsonify(resultado), 200

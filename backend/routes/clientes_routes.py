from flask import Blueprint, request, jsonify
from db import get_connection

clientes_bp = Blueprint('clientes_bp', __name__)

@clientes_bp.route('/', methods=['GET'])
def listar_clientes():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM clientes")
    resultado = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(resultado), 200

@clientes_bp.route('/', methods=['POST'])
def crear_cliente():
    datos = request.json
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO clientes (nombre, direccion, contacto, correo) VALUES (%s, %s, %s, %s)",
        (datos['nombre'], datos['direccion'], datos['contacto'], datos['correo'])
    )
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({"mensaje": "cliente creado"}), 201

#Version avanzada, el json debe darle el id coincidente y los datos a editar. No es necesario que estén todos los atributos 
# como en la version anterior y permite editar 1, 2 o 3 atributos o editarlos todos en una misma instancia.
@clientes_bp.route('/', methods=['PATCH'])
def editar_cliente():
    datos = request.json
    conn = get_connection()
    cursor = conn.cursor()
    if 'id' not in datos:
        return jsonify({"error": "Falta el parametro id"}), 400
    
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
    cursor.close()
    conn.close()
    return jsonify({"mensaje": "Cliente modificado"}), 204


#Se permite borrar solo por ID, falta borrado en cascada en la base y en el backend
@clientes_bp.route('/', methods=['DELETE'])
def eliminar_cliente():
    datos = request.json
    if 'id' not in datos:
        return jsonify({"error": "Falta el parámetro id"}), 400

    conn = get_connection() 
    cursor = conn.cursor()
        # Consultar si tiene máquinas en uso
    cursor.execute(
        "SELECT COUNT(*) FROM maquinas_en_uso WHERE id_cliente = %s",(datos['id'],))
    cantidad_maquinas = cursor.fetchone()[0]
    
    if cantidad_maquinas > 0:
        return (jsonify({"error": f"El cliente tiene {cantidad_maquinas} máquina(s) en uso. Elimine dichas máquinas."}),409)
        #Elimina cliente si no tiene máquinas en uso
    cursor.execute(
        "DELETE FROM clientes WHERE id = %s",(datos['id'],))
    conn.commit()

    if cursor.rowcount == 0:
        return jsonify({"error": "Cliente no encontrado"}), 404

    return jsonify({"mensaje": "Cliente eliminado"}), 200

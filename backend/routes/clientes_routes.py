from flask import Blueprint, request, jsonify
from db import get_connection
from auth_utils import login_required, admin_required

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
    
    # Validar campos requeridos
    if not datos or not all(k in datos for k in ('nombre', 'direccion')):
        return jsonify({"error": "Faltan campos requeridos: nombre, direccion"}), 400
    
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


#Se permite borrar solo por ID, incluye validación de integridad referencial
@clientes_bp.route('/', methods=['DELETE'])
@admin_required  # Solo administradores pueden eliminar clientes
def eliminar_cliente():
    datos = request.json
    
    if not datos or 'id' not in datos:
        return jsonify({"error": "Falta el parámetro id"}), 400

    try:
        conn = get_connection() 
        cursor = conn.cursor()
        
        # Consultar si tiene máquinas en uso
        cursor.execute(
            "SELECT COUNT(*) FROM maquinas_en_uso WHERE id_cliente = %s", (datos['id'],)
        )
        cantidad_maquinas = cursor.fetchone()[0]
        
        if cantidad_maquinas > 0:
            return jsonify({
                "error": f"El cliente tiene {cantidad_maquinas} máquina(s) en uso. Elimine dichas máquinas primero."
            }), 409
            
        # Elimina cliente si no tiene máquinas en uso
        cursor.execute(
            "DELETE FROM clientes WHERE id = %s", (datos['id'],)
        )
        conn.commit()

        if cursor.rowcount == 0:
            return jsonify({"error": "Cliente no encontrado"}), 404

        cursor.close()
        conn.close()
        return jsonify({"mensaje": "Cliente eliminado exitosamente"}), 200
    except Exception as e:
        return jsonify({"error": f"Error al eliminar cliente: {str(e)}"}), 500

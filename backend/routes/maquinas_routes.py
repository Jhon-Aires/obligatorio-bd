from flask import Blueprint, request, jsonify
from db import get_connection
from auth_utils import login_required, admin_required

maquinas_bp = Blueprint('maquinas_bp', __name__)

@maquinas_bp.route('/', methods=['GET'])
@login_required  # Todos los usuarios autenticados pueden ver máquinas
def listar_maquinas():
    try:
        conn = get_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM maquinas")
        resultado = cursor.fetchall()
        cursor.close()
        conn.close()
        return jsonify(resultado), 200
    except Exception as e:
        return jsonify({"error": f"Error al listar máquinas: {str(e)}"}), 500

@maquinas_bp.route('/', methods=['POST'])
@admin_required  # Solo administradores pueden crear máquinas
def crear_maquina():
    datos = request.json
    
    # Validar campos requeridos
    if not datos or not all(k in datos for k in ('modelo', 'costo_alquiler_mensual')):
        return jsonify({"error": "Faltan campos requeridos: modelo, costo_alquiler_mensual"}), 400
    
    try:
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO maquinas (modelo, costo_alquiler_mensual) VALUES (%s, %s)",
            (datos['modelo'], datos['costo_alquiler_mensual'])
        )
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({"mensaje": "Máquina creada exitosamente"}), 201
    except Exception as e:
        return jsonify({"error": f"Error al crear máquina: {str(e)}"}), 500

# Editar máquina - Solo administradores
@maquinas_bp.route('/', methods=['PATCH'])
@admin_required
def editar_maquina():
    datos = request.json
    
    if not datos or 'modelo' not in datos:
        return jsonify({"error": "Falta el parámetro modelo"}), 400
    
    if 'costo_alquiler_mensual' not in datos:
        return jsonify({"error": "No hay campos a actualizar"}), 400
    
    try:
        conn = get_connection()
        cursor = conn.cursor()
        
        cursor.execute(
            "UPDATE maquinas SET costo_alquiler_mensual = %s WHERE modelo = %s",
            (datos['costo_alquiler_mensual'], datos['modelo'])
        )
        conn.commit()
        
        if cursor.rowcount == 0:
            return jsonify({"error": "Máquina no encontrada"}), 404
            
        cursor.close()
        conn.close()
        return jsonify({"mensaje": "Máquina modificada exitosamente"}), 200
    except Exception as e:
        return jsonify({"error": f"Error al modificar máquina: {str(e)}"}), 500


# Eliminar máquina - Solo administradores
@maquinas_bp.route('/', methods=['DELETE'])
@admin_required
def eliminar_maquina():
    datos = request.json
    
    if not datos or 'modelo' not in datos:
        return jsonify({"error": "Falta el parámetro modelo"}), 400

    try:
        conn = get_connection() 
        cursor = conn.cursor()
        
        # Consultar si tiene máquinas en uso
        cursor.execute(
            "SELECT COUNT(*) FROM maquinas_en_uso WHERE modelo = %s", (datos['modelo'],)
        )
        cantidad_maquinas_en_uso = cursor.fetchone()[0]
        
        if cantidad_maquinas_en_uso > 0:
            return jsonify({
                "error": f"Hay {cantidad_maquinas_en_uso} máquina(s) en uso. Elimine dichas máquinas primero."
            }), 409
        
        # Eliminar máquina si no tiene máquinas en uso
        cursor.execute(
            "DELETE FROM maquinas WHERE modelo = %s", (datos['modelo'],)
        )
        conn.commit()

        if cursor.rowcount == 0:
            return jsonify({"error": "Máquina no encontrada"}), 404

        cursor.close()
        conn.close()
        return jsonify({"mensaje": "Máquina eliminada exitosamente"}), 200
    except Exception as e:
        return jsonify({"error": f"Error al eliminar máquina: {str(e)}"}), 500

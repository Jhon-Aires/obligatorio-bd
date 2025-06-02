from flask import Blueprint, request, jsonify
from db import get_connection

maquinas_bp = Blueprint('maquinas_bp', __name__)

@maquinas_bp.route('/', methods=['GET'])
def listar_maquinas():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM maquinas")
    resultado = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(resultado)

@maquinas_bp.route('/', methods=['POST'])
def crear_maquina():
    datos = request.json
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO maquinas (modelo, costo_alquiler_mensual) VALUES (%s, %s)",
        (datos['modelo'], datos['costo_alquiler_mensual'])
    )
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({"mensaje": "Maquina creada"}), 201

#Si no encuentra el modelo tiraa 204 igual 
@maquinas_bp.route('/', methods=['PATCH'])
def editar_maquina():
    datos = request.json
    conn = get_connection()
    cursor = conn.cursor()
    #Hay solo dos posibles valores, de los cuales modelo no es modificable funciona como un ID
    
    if 'modelo' not in datos:
        return jsonify({"error": "Falta el parametro modelo"}), 400
    
    if 'costo_alquiler_mensual' not in datos:
        return jsonify ({"error":"No hay campos a actualizar"}), 400
    
    cursor.execute(
        "UPDATE maquinas SET costo_alquiler_mensual = %s WHERE modelo = %s",
        (datos['costo_alquiler_mensual'], datos['modelo'])
    )
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({"mensaje": "Maquina modificada"}), 204


#Se permite borrar solo por ID
@maquinas_bp.route('/', methods=['DELETE'])
def eliminar_maquina():
    datos = request.json
    if 'modelo' not in datos:
        return jsonify({"error": "Falta el parámetro modelo"}), 400

    conn = get_connection() 
    cursor = conn.cursor()
        # Consultar si tiene máquinas en uso
    cursor.execute(
        "SELECT COUNT(*) FROM maquinas_en_uso WHERE modelo = %s",(datos['modelo'],))
    cantidad_maquinas_en_uso = cursor.fetchone()[0]
    
    if cantidad_maquinas_en_uso > 0:
        return (jsonify({"error": f"Hay  {cantidad_maquinas_en_uso} máquina(s) en uso. Elimine dichas máquinas."}),409)
    
    #Elimina cliente si no tiene máquinas en uso
    cursor.execute(
        "DELETE FROM maquinas WHERE modelo = %s",(datos['modelo'],))
    conn.commit()

    if cursor.rowcount == 0:
        return jsonify({"error": "Máquina no encontrada"}), 404

    return jsonify({"mensaje": "Máquina eliminada"}), 200

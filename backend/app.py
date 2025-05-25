from flask import Flask, request, jsonify
from db import get_connection

app = Flask(__name__)

#GET y POST de clientes
@app.route('/clientes', methods=['GET'])
def listar_clientes():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM clientes")
    resultado = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(resultado)

@app.route('/clientes', methods=['POST'])
def crear_cliente():
    datos = request.json
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO clientes (nombre, direccion, contacto, correo) VALUES (%s, %s, %s)",
        (datos['nombre'], datos['direccion'], datos['contacto'], datos['correo'])
    )
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({"mensaje": "cliente creado"}), 201

#GET y POST de insumos
@app.route('/insumos', methods=['GET'])
def listar_insumos():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM insumos")
    resultado = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(resultado)

@app.route('/insumos', methods=['POST'])
def crear_insumo():
    datos = request.json
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO insumos (descripcion, tipo, precio_unitario, id_proveedor) VALUES (%s, %s, %s)",
        (datos['descripcion'], datos['tipo'], datos['precio_unitario'], datos['id_proveedor'])
    )
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({"mensaje": "insumo creado"}), 201

#POST de login
@app.route('/login', methods=['POST'])
def crear_login():
    datos = request.json
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO login (correo, contrasena, es_administrador) VALUES (%s, %s, %s)",
        (datos['correo'], datos['contrasena'], datos['es_administrador'])
    )
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({"mensaje": "login exitoso"}), 201

#GET y POST de mantenimientos
@app.route('/mantenimientos', methods=['GET'])
def listar_mantenimientos():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM mantenimientos")
    resultado = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(resultado)

@app.route('/mantenimientos', methods=['POST'])
def crear_mantenimiento():
    datos = request.json
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO mantenimientos (id, id_maquina_en_uso, ci_tecnico, tipo, fecha, observaciones) VALUES (%s, %s, %s)",
        (datos['id'], datos['id_maquina_en_uso'], datos['ci_tecnico'], datos['tipo'], datos['fecha'], datos['observaciones'])
    )
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({"mensaje": "Mantenimiento creado"}), 201

#GET y POST de maquinas
@app.route('/maquinas', methods=['GET'])
def listar_maquinas():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM maquinas")
    resultado = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(resultado)

@app.route('/maquinas', methods=['POST'])
def crear_maquina():
    datos = request.json
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO maquinas (modelo, costo_alquiler_mensual) VALUES (%s, %s, %s)",
        (datos['modelo'], datos['costo_alquiler_mensual'])
    )
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({"mensaje": "Maquina creada"}), 201

#GET y POST de maquinas en uso
@app.route('/maquinas_en_uso', methods=['GET'])
def listar_maquinas_en_uso():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM maquinas_en_uso")
    resultado = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(resultado)

@app.route('/maquinas_en_uso', methods=['POST'])
def crear_maquina_en_uso():
    datos = request.json
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO maquinas_en_uso (modelo, id_cliente, ubicacion_cliente) VALUES (%s, %s, %s)",
        (datos['modelo'], datos['id_cliente'], datos['ubicacion_cliente'])
    )
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({"mensaje": "Maquina asignada"}), 201

#GET y POST de proveedores
@app.route('/proveedores', methods=['GET'])
def listar_proveedores():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM proveedores")
    resultado = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(resultado)

@app.route('/proveedores', methods=['POST'])
def crear_proveedor():
    datos = request.json
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO proveedores (nombre, apellido, contacto) VALUES (%s, %s, %s)",
        (datos['nombre'], datos['apellido'], datos['contacto'])
    )
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({"mensaje": "Proveedor creado"}), 201

#GET y POST de registro_consumo
@app.route('/registro_consumo', methods=['GET'])
def listar_registro_consumo():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM registro_consumo")
    resultado = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(resultado)

@app.route('/registro_consumo', methods=['POST'])
def crear_registro_consumo():
    datos = request.json
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO registro_consumo (id, id_maquina_en_uso, id_insumo, fecha, cantidad_usada) VALUES (%s, %s, %s)",
        (datos['id'], datos['id_maquina_en_uso'], datos['id_insumo'], datos['fecha'], datos['cantidad_usada'])
    )
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({"mensaje": "registro creado"}), 201

#GET y POST de tecnicos
@app.route('/tecnicos', methods=['GET'])
def listar_tecnicos():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM tecnicos")
    resultado = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(resultado)

@app.route('/tecnicos', methods=['POST'])
def crear_tecnicos():
    datos = request.json
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO tecnicos  (ci, nombre, apellido, contacto) VALUES (%s, %s, %s)",
        (datos['ci'], datos['nombre'], datos['apellido'], datos['contacto'])
    )
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({"mensaje": "registro creado"}), 201

if __name__ == '__main__':
    app.run(debug=True)

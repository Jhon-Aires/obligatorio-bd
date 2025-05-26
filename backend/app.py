from flask import Flask, request, jsonify
from db import get_connection

app = Flask(__name__)

@app.route('/proveedores', methods=['GET'])
def listar_empleados():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM proveedores")
    resultado = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(resultado)

@app.route('/proveedores', methods=['POST'])
def crear_empleado():
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

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)

from flask import Flask, request, jsonify, session
from flask_cors import CORS
from routes.clientes_routes import clientes_bp
from routes.insumos_routes import insumos_bp
from routes.login_routes import login_bp
from routes.mantenimientos_routes import mantenimientos_bp
from routes.maquinas_routes import maquinas_bp
from routes.maquinas_en_uso_routes import maquinas_en_uso_bp
from routes.registro_consumo_routes import registro_consumo_bp
from routes.tecnicos_routes import tecnicos_bp
from routes.proveedores_routes import proveedores_bp

app = Flask(__name__)
app.secret_key = "clave-secreta-cambiar"  # Necesaria para manejar sesión

# Disable automatic slash redirects
app.url_map.strict_slashes = False

# Configure CORS
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)

# Blueprints
app.register_blueprint(clientes_bp, url_prefix="/clientes")
app.register_blueprint(insumos_bp, url_prefix="/insumos")
app.register_blueprint(login_bp, url_prefix="/login")
app.register_blueprint(mantenimientos_bp, url_prefix="/mantenimientos")
app.register_blueprint(maquinas_bp, url_prefix="/maquinas")
app.register_blueprint(maquinas_en_uso_bp, url_prefix="/maquinas_en_uso")
app.register_blueprint(proveedores_bp, url_prefix="/proveedores")
app.register_blueprint(registro_consumo_bp, url_prefix="/registro_consumo")
app.register_blueprint(tecnicos_bp, url_prefix="/tecnicos")

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
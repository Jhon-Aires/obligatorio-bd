from functools import wraps
from flask import session, jsonify

def login_required(f):
    """
    Decorador que requiere que el usuario esté autenticado
    """
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_type' not in session or 'correo' not in session:
            return jsonify({
                "error": "Acceso denegado",
                "mensaje": "Debe iniciar sesión para acceder a este recurso"
            }), 401
        return f(*args, **kwargs)
    return decorated_function

def admin_required(f):
    """
    Decorador que requiere que el usuario sea administrador
    """
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_type' not in session or 'correo' not in session:
            return jsonify({
                "error": "Acceso denegado",
                "mensaje": "Debe iniciar sesión para acceder a este recurso"
            }), 401
        
        if session.get('user_type') != 'admin':
            return jsonify({
                "error": "Acceso denegado",
                "mensaje": "Solo los administradores pueden realizar esta acción"
            }), 403
        
        return f(*args, **kwargs)
    return decorated_function

def validate_session():
    """
    Función auxiliar para validar si la sesión es válida
    """
    return 'user_type' in session and 'correo' in session

def is_admin():
    """
    Función auxiliar para verificar si el usuario actual es administrador
    """
    return session.get('user_type') == 'admin'

def get_current_user():
    """
    Función auxiliar para obtener información del usuario actual
    """
    if validate_session():
        return {
            'correo': session.get('correo'),
            'user_type': session.get('user_type'),
            'is_admin': is_admin()
        }
    return None

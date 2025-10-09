from flask import Flask, jsonify, request, render_template
import mysql.connector
from mysql.connector import pooling, Error
from flask_cors import CORS
from functools import wraps
import logging
from datetime import datetime

# Configurar logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

app = Flask(__name__)


# Configuracion CORS
CORS(app, resources={
    r"/api/*": {
        "origins": "*",  # Consider restricting this in production
        "methods": ["GET", "POST", "PUT", "DELETE"],
        "allow_headers": ["Content-Type", "Authorization"]
    }
})

# Configuracion base de datos
dbconfig = {
    "host": "localhost",
    "database": "UapaSmartphones",
    "user": "jepr18",
    "password": "123456789",  # Use environment variables in production
    "autocommit": False,
    "raise_on_warnings": True
}

# Crear connection pool
try:
    connection_pool = mysql.connector.pooling.MySQLConnectionPool(
        pool_name="GeneralPool",
        pool_size=5,
        pool_reset_session=True,
        **dbconfig
    )
    logger.info("Database connection pool created successfully")
except Error as e:
    logger.error(f"Error creating connection pool: {e}")
    raise

# Decorador para operaciones con base de datos
def handle_db_connection(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        connection = None
        cursor = None
        try:
            connection = connection_pool.get_connection()
            cursor = connection.cursor(dictionary=True)
            # Pass connection and cursor as keyword arguments
            kwargs['connection'] = connection
            kwargs['cursor'] = cursor
            return func(*args, **kwargs)
        except Error as e:
            logger.error(f"Database error in {func.__name__}: {e}")
            if connection:
                connection.rollback()
            return jsonify({
                'status': 'error',
                'message': 'Database error occurred',
                'error': str(e)
            }), 500
        except Exception as e:
            logger.error(f"Unexpected error in {func.__name__}: {e}")
            if connection:
                connection.rollback()
            return jsonify({
                'status': 'error',
                'message': 'An unexpected error occurred'
            }), 500
        finally:
            if cursor:
                cursor.close()
            if connection and connection.is_connected():
                connection.close()
    return wrapper

# Decorador para validar requests
def validate_json(*required_fields):
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            if not request.is_json:
                return jsonify({
                    'status': 'error',
                    'message': 'Content-Type must be application/json'
                }), 400

            data = request.json
            missing_fields = [field for field in required_fields if field not in data]

            if missing_fields:
                return jsonify({
                    'status': 'error',
                    'message': f'Missing required fields: {", ".join(missing_fields)}'
                }), 400

            return func(*args, **kwargs)
        return wrapper
    return decorator

@app.route('/')
def index():
    """Mostra la página principal"""
    return render_template('index.html')

@app.route('/api/buscarProductos', methods=['POST'])
@validate_json('idProducto', 'nombreModelo', 'marca')
@handle_db_connection
def get_productos(connection, cursor):
    """Buscar productos usando procedimiento almacenado."""

    data = request.json

    # Validar los datos
    id_producto = data.get('idProducto', 0)
    nombre_modelo = data.get('nombreModelo', '')
    marca = data.get('marca', '')

    args = (id_producto, nombre_modelo, marca)

    cursor.callproc('spBusquedaProductos', args)

    results = []
    for result in cursor.stored_results():
        results.extend(result.fetchall())

    logger.info(f"Búsqueda de productos completada. Se encontraron {len(results)} resultados.")

    return jsonify({
        'status': 'success',
        'data': results
    }), 200

@app.route('/api/buscarTodosLosProductos', methods=['GET'])
@handle_db_connection
def get_all_productos(connection, cursor):
    """Buscar todos los productos."""

    cursor.callproc('spBusquedaTodosLosProductos')

    results = []
    for result in cursor.stored_results():
        results.extend(result.fetchall())

    logger.info(f"Búsqueda de productos completada. Se encontraron {len(results)} resultados.")

    return jsonify({
        'status': 'success',
        'data': results
    }), 200

@app.route('/api/productos/<int:id>', methods=['GET'])
@handle_db_connection
def get_productos_by_id(id, connection, cursor):
    """Buscar producto por ID."""

    cursor.callproc('spBusquedaProductosPorId', (id,))
    results = []
    for result in cursor.stored_results():
        results.extend(result.fetchall())

    if results:
        return jsonify({
            'status': 'success',
            'data': results
        }), 200
    else:
        return jsonify({
            'status': 'error',
            'message': 'Product not found'
        }), 404

if __name__ == '__main__':
    app.run(debug=True, host='127.0.0.1', port=5000)
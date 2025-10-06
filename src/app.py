from flask import Flask, jsonify, request, render_template
import mysql.connector
from mysql.connector import pooling, Error
import os

app = Flask(__name__)

# Connection pool configuration
dbconfig = {
    "host": "localhost",
    "database": "UapaSmartphones",
    "user": "jepr18",
    "password": "123456789"
}

# Create connection pool
connection_pool = mysql.connector.pooling.MySQLConnectionPool(
    pool_name="GeneralPool",
    pool_size=5,
    **dbconfig
)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/data')
def get_data():
    try:
        connection = connection_pool.get_connection()
        cursor = connection.cursor(dictionary=True)
        cursor.execute("SELECT * FROM Productos")
        results = cursor.fetchall()
        return jsonify(results)
    except Error as e:
        return jsonify({'error': str(e)}), 500
    finally:
        if connection.is_connected():
            cursor.close()
            connection.close()

@app.route('/api/data', methods=['POST'])
def add_data():
    try:
        data = request.json
        connection = connection_pool.get_connection()
        cursor = connection.cursor()
        
        query = ""
        cursor.execute(query, (data['value1'], data['value2']))
        connection.commit()
        
        return jsonify({'message': 'Data added successfully', 'id': cursor.lastrowid})
    except Error as e:
        return jsonify({'error': str(e)}), 500
    finally:
        if connection.is_connected():
            cursor.close()
            connection.close()

if __name__ == '__main__':
    app.run(debug=True)
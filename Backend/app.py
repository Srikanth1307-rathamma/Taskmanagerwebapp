from flask import Flask, request, jsonify
from flask_cors import CORS
import psycopg2
import os

app = Flask(__name__)
CORS(app)

# Database connection settings read from environment variables
DB_HOST = os.getenv("DB_HOST", "localhost")
DB_NAME = os.getenv("DB_NAME", "tasksdb")
DB_USER = os.getenv("DB_USER", "postgres")
DB_PASSWORD = os.getenv("DB_PASSWORD", "password")

def get_db_connection():
    return psycopg2.connect(
        host=DB_HOST,
        database=DB_NAME,
        user=DB_USER,
        password=DB_PASSWORD
    )

@app.route('/tasks', methods=['GET'])
def get_tasks():
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute('SELECT id, title, completed FROM tasks ORDER BY id DESC;')
        tasks = cur.fetchall()
        cur.close()
        conn.close()
        return jsonify([{"id": t[0], "title": t[1], "completed": t[2]} for t in tasks])
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/tasks', methods=['POST'])
def add_task():
    data = request.get_json()
    title = data.get('title')
    if not title:
        return jsonify({"error": "Title is required"}), 400
        
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute('INSERT INTO tasks (title) VALUES (%s) RETURNING id;', (title,))
        conn.commit()
        cur.close()
        conn.close()
        return jsonify({"message": "Task created successfully"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)

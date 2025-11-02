from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector
import requests
import os

# ---- DATABASE CONFIG ----
DB_CONFIG = {
    'host': os.environ.get('DB_HOST', '127.0.0.1'),
    'user': os.environ.get('DB_USER', 'lockadmin'),
    'password': os.environ.get('DB_PASS', 'SMARTlock'),
    'database': os.environ.get('DB_NAME', 'smart_door_lock'),
    'port': int(os.environ.get('DB_PORT', 3306))
}

app = Flask(__name__)
CORS(app)  # Enable cross-origin requests from React frontend

def get_db():
    """Create and return a new database connection."""
    return mysql.connector.connect(**DB_CONFIG)

# ------------------- USERS -------------------
@app.route('/api/users', methods=['GET'])
def get_users():
    conn = get_db()
    cur = conn.cursor(dictionary=True)
    cur.execute("SELECT id, name, role FROM users")
    users = cur.fetchall()
    cur.close()
    conn.close()
    return jsonify(users), 200

@app.route('/api/users', methods=['POST'])
def create_user():
    data = request.get_json(silent=True) or {}
    name = data.get('name')
    role = data.get('role', 'operator')

    if not name:
        return jsonify({"error": "name is required"}), 400

    conn = get_db()
    cur = conn.cursor()
    cur.execute("INSERT INTO users (name, role) VALUES (%s, %s)", (name, role))
    conn.commit()
    cur.close()
    conn.close()
    return jsonify({"message": "User created successfully"}), 201

@app.route('/api/users/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    conn = get_db()
    cur = conn.cursor()
    cur.execute("DELETE FROM users WHERE id = %s", (user_id,))
    conn.commit()
    cur.close()
    conn.close()
    return jsonify({"message": "User deleted successfully"}), 200



# ------------------- KEYS -------------------
@app.route('/api/keys', methods=['GET'])
def get_keys():
    conn = get_db()
    cur = conn.cursor(dictionary=True)
    cur.execute("""
        SELECT ak.id, ak.key_uid, ak.label, ak.user_id, ak.status,
               u.name AS owner
        FROM access_keys ak
        LEFT JOIN users u ON ak.user_id = u.id
        ORDER BY ak.id DESC
    """)
    keys = cur.fetchall()
    cur.close()
    conn.close()
    return jsonify(keys), 200


@app.route('/api/keys', methods=['POST'])
def create_key():
    data = request.get_json(silent=True) or {}
    key_uid = data.get('key_uid')
    user_id = data.get('user_id')
    label = data.get('label', '')

    if not key_uid or not user_id:
        return jsonify({"error": "key_uid and user_id are required"}), 400

    conn = get_db()
    cur = conn.cursor()
    try:
        cur.execute("""
            INSERT INTO access_keys (key_uid, label, user_id)
            VALUES (%s, %s, %s)
        """, (key_uid, label, user_id))
        conn.commit()
    except mysql.connector.Error as e:
        return jsonify({"error": str(e)}), 400
    finally:
        cur.close()
        conn.close()

    return jsonify({"message": "Key created successfully"}), 201


@app.route('/api/keys/<int:key_id>', methods=['PUT'])
def update_key(key_id):
    data = request.get_json(silent=True) or {}
    label = data.get('label', '')
    user_id = data.get('user_id')

    conn = get_db()
    cur = conn.cursor()
    cur.execute("""
        UPDATE access_keys
        SET label=%s, user_id=%s
        WHERE id=%s
    """, (label, user_id, key_id))
    conn.commit()
    cur.close()
    conn.close()

    return jsonify({"message": "Key updated successfully"}), 200


@app.route('/api/keys/<int:key_id>', methods=['DELETE'])
def delete_key(key_id):
    conn = get_db()
    cur = conn.cursor()
    cur.execute("DELETE FROM access_keys WHERE id=%s", (key_id,))
    conn.commit()
    cur.close()
    conn.close()
    return jsonify({"message": "Key deleted successfully"}), 200

# ------------------- DOORS -------------------
@app.route('/api/doors', methods=['GET'])
def get_doors():
    conn = get_db()
    cur = conn.cursor(dictionary=True)
    cur.execute("SELECT id, name, location, device_ip, status FROM doors")
    doors = [
        {
            "id": row["id"],
            "name": row["name"],
            "location": row["location"],
            "deviceIP": row["device_ip"],
            "status": row["status"]
        }
        for row in cur.fetchall()
    ]
    cur.close()
    conn.close()
    return jsonify(doors), 200


@app.route('/api/doors', methods=['POST'])
def create_door():
    data = request.get_json(silent=True) or {}
    name = data.get('name')
    location = data.get('location')
    deviceIP = data.get('deviceIP')

    if not all([name, location, deviceIP]):
        return jsonify({"error": "name, location, and deviceIP are required"}), 400

    conn = get_db()
    cur = conn.cursor()
    cur.execute(
        "INSERT INTO doors (name, location, device_ip) VALUES (%s, %s, %s)",
        (name, location, deviceIP)
    )
    conn.commit()
    cur.close()
    conn.close()
    return jsonify({"message": "Door created successfully"}), 201


#  Update Door (PUT /api/doors/<id>)
@app.route('/api/doors/<int:id>', methods=['PUT'])
def update_door(id):
    data = request.get_json(silent=True) or {}
    name = data.get('name')
    location = data.get('location')
    deviceIP = data.get('deviceIP')

    if not any([name, location, deviceIP]):
        return jsonify({"error": "At least one of name, location, or deviceIP must be provided"}), 400

    conn = get_db()
    cur = conn.cursor()

    cur.execute(
        """
        UPDATE doors 
        SET 
            name = COALESCE(%s, name),
            location = COALESCE(%s, location),
            device_ip = COALESCE(%s, device_ip)
        WHERE id = %s
        """,
        (name, location, deviceIP, id)
    )

    conn.commit()

    if cur.rowcount == 0:
        return jsonify({"error": "Door not found"}), 404

    cur.close()
    conn.close()
    return jsonify({"message": "Door updated successfully"}), 200


#  Delete Door (DELETE /api/doors/<id>)
@app.route('/api/doors/<int:id>', methods=['DELETE'])
def delete_door(id):
    conn = get_db()
    cur = conn.cursor()
    cur.execute("DELETE FROM doors WHERE id = %s", (id,))
    conn.commit()

    if cur.rowcount == 0:
        return jsonify({"error": "Door not found"}), 404

    cur.close()
    conn.close()
    return jsonify({"message": "Door deleted successfully"}), 200




# ------------------- DEVICE COMMANDS -------------------
@app.route('/api/device/<device_ip>/command', methods=['POST'])
def send_command(device_ip):
    """
    Endpoint: /api/device/<device_ip>/command
    Body format: { "cmd": "lock" | "unlock" | "refreshPermission" }
    """

    data = request.get_json(silent=True) or {}
    command = data.get('cmd')  # frontend sends { cmd: "lock" }

    if not command:
        return jsonify({"error": "Command 'cmd' is required"}), 400

    # Check if this device exists in DB
    conn = get_db()
    cur = conn.cursor(dictionary=True)
    cur.execute("SELECT device_ip FROM doors WHERE device_ip = %s", (device_ip,))
    row = cur.fetchone()
    cur.close()
    conn.close()

    if not row:
        return jsonify({"error": f"Device with IP {device_ip} not found"}), 404

    try:
        # Send HTTP command to ESP32 -> Example: http://192.168.1.10/lock
        response = requests.post(f"http://{device_ip}/{command}", timeout=5)
        response.raise_for_status()

        return jsonify({
            "message": f"Command '{command}' sent successfully to device {device_ip}"
        }), 200

    except Exception as e:
        return jsonify({
            "error": f"Failed to send command to device",
            "details": str(e)
        }), 500
    

    # ------------------- PERMISSIONS API -------------------

#  1. Get all permissions for a key
@app.route('/api/permissions/<key_id>', methods=['GET'])
def get_permissions_by_key(key_id):
    conn = get_db()
    cur = conn.cursor(dictionary=True)

    cur.execute("""
        SELECT 
            p.door_id, 
            d.name AS doorName,
            d.location,
            p.role
        FROM permissions p
        JOIN doors d ON p.door_id = d.id
        WHERE p.key_id = %s
    """, (key_id,))

    permissions = cur.fetchall()
    cur.close()
    conn.close()

    return jsonify(permissions), 200


#  2. Update (Save) permissions for a key
@app.route('/api/permissions', methods=['POST'])
def set_permissions():
    data = request.get_json(silent=True) or {}
    key_id = data.get('keyId')
    doors = data.get('doors', [])  # Example: [1, 2, 5]
    role = data.get('role', 'operator')  # default role = operator

    if not key_id:
        return jsonify({"error": "keyId is required"}), 400

    conn = get_db()
    cur = conn.cursor()

    try:
        #  Delete old permissions for this key
        cur.execute("DELETE FROM permissions WHERE key_id = %s", (key_id,))

        #  Insert new permissions
        for door_id in doors:
            cur.execute("""
                INSERT INTO permissions (key_id, door_id, role)
                VALUES (%s, %s, %s)
            """, (key_id, door_id, role))

        conn.commit()
        return jsonify({"message": "Permissions updated successfully"}), 200

    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 500

    finally:
        cur.close()
        conn.close()



# ------------------- ACCESS LOGS -------------------
# @app.route('/api/logs', methods=['GET'])
# def get_logs():
#     conn = get_db()
#     cur = conn.cursor(dictionary=True)
#     cur.execute("""
#         SELECT a.id, e.name AS employee_name, d.name AS door_name, a.action, a.timestamp
#         FROM access_logs a
#         LEFT JOIN employees e ON a.employee_id = e.id
#         LEFT JOIN doors d ON a.door_id = d.id
#         ORDER BY a.timestamp DESC
#         LIMIT 200
#     """)
#     logs = cur.fetchall()
#     cur.close()
#     conn.close()
#     return jsonify(logs), 200


# ------------------- RUN -------------------
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 5001)), debug=True)

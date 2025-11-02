import mysql.connector
import os

# Database configuration
DB_CONFIG = {
    'host': os.environ.get('DB_HOST', '127.0.0.1'),
    'user': os.environ.get('DB_USER', 'lockadmin'),
    'password': os.environ.get('DB_PASS', 'SMARTlock'),
    'database': os.environ.get('DB_NAME', 'smart_door_lock'),
    'port': int(os.environ.get('DB_PORT', 3306))
}

# Connect to MySQL / MariaDB
conn = mysql.connector.connect(**DB_CONFIG)
cur = conn.cursor()

# ------------------- USERS -------------------
cur.execute("""
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'operator'
) ENGINE=InnoDB
""")

# ------------------- KEYS -------------------
cur.execute("""
CREATE TABLE IF NOT EXISTS access_keys (
    id INT AUTO_INCREMENT PRIMARY KEY,
    key_uid VARCHAR(100) UNIQUE NOT NULL,
    label VARCHAR(100),
    user_id INT,
    status VARCHAR(50) DEFAULT 'active',
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB
""")

# ------------------- DOORS -------------------
cur.execute("""
CREATE TABLE IF NOT EXISTS doors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    location VARCHAR(150) NOT NULL,
    device_ip VARCHAR(100) NOT NULL,
    status ENUM('locked', 'unlocked') DEFAULT 'locked'
) ENGINE=InnoDB
""")

# ------------------- PERMISSIONS -------------------
cur.execute("""
CREATE TABLE IF NOT EXISTS permissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    key_id INT NOT NULL,
    door_id INT NOT NULL,
    role VARCHAR(50) DEFAULT 'operator',
    FOREIGN KEY (key_id) REFERENCES access_keys(id) ON DELETE CASCADE,
    FOREIGN KEY (door_id) REFERENCES doors(id) ON DELETE CASCADE,
    UNIQUE (key_id, door_id)
) ENGINE=InnoDB
""")

# ------------------- ACCESS LOGS -------------------
cur.execute("""
CREATE TABLE IF NOT EXISTS access_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    door_id INT,
    action VARCHAR(50),
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (door_id) REFERENCES doors(id) ON DELETE CASCADE
) ENGINE=InnoDB
""")

# Commit and close
conn.commit()
cur.close()
conn.close()

print(" Database initialized successfully with users, keys, doors, permissions, and access_logs tables.")


# # db_init.py
# import mysql.connector
# import os

# DB_CONFIG = {
#     'host': os.environ.get('DB_HOST', '127.0.0.1'),
#     'user': os.environ.get('DB_USER', 'lockadmin'),
#     'password': os.environ.get('DB_PASS', 'SMARTlock'),
#     'database': os.environ.get('DB_NAME', 'smart_door_lock'),
#     'port': int(os.environ.get('DB_PORT', 3306))
# }

# conn = mysql.connector.connect(**DB_CONFIG)
# cur = conn.cursor()

# cur.execute("""
# CREATE TABLE IF NOT EXISTS employees (
#     id INT PRIMARY KEY AUTO_INCREMENT,
#     name VARCHAR(100),
#     position VARCHAR(50),
#     tag_uid VARCHAR(50) UNIQUE
# ) ENGINE=InnoDB
# """)

# cur.execute("""
# CREATE TABLE IF NOT EXISTS doors (
#     id INT PRIMARY KEY AUTO_INCREMENT,
#     name VARCHAR(100),
#     location VARCHAR(100),
#     device_ip VARCHAR(100)
# ) ENGINE=InnoDB
# """)

# cur.execute("""
# CREATE TABLE IF NOT EXISTS permissions (
#     id INT PRIMARY KEY AUTO_INCREMENT,
#     employee_id INT,
#     door_id INT,
#     FOREIGN KEY(employee_id) REFERENCES employees(id),
#     FOREIGN KEY(door_id) REFERENCES doors(id)
# ) ENGINE=InnoDB
# """)

# cur.execute("""
# CREATE TABLE IF NOT EXISTS access_logs (
#     id INT PRIMARY KEY AUTO_INCREMENT,
#     tag_uid VARCHAR(50),
#     employee_id INT,
#     door_id INT,
#     result VARCHAR(10),
#     timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
# ) ENGINE=InnoDB
# """)

# conn.commit()
# cur.close()
# conn.close()
# print("MariaDB database initialized with tables")
# db_init.py

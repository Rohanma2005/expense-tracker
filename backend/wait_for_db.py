import socket
import time
import os
import sys

host = os.environ.get('DB_HOST', 'db')
port = 3306
print(f"Waiting for database at {host}:{port}...")
start_time = time.time()
while True:
    try:
        conn = socket.create_connection((host, port), timeout=2)
        conn.close()
        print("Database is up!")
        sys.exit(0)
    except OSError:
        if time.time() - start_time > 60:
            print("Database connection timed out!")
            sys.exit(1)
        time.sleep(1)

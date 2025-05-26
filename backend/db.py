import mysql.connector

def get_connection():
    return mysql.connector.connect(
        host="database",  # Docker service name
        user="root",
        password="rootdocker",
        database="marloy"
    )

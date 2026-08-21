from flask import Flask, render_template, request, redirect, session
import mysql.connector

# El punto '.' le indica a Flask que busque los HTML en la MISMA carpeta donde está este app.py
# app.py
# static_folder='.' le enseña a Flask a buscar el CSS en la misma carpeta raíz
app = Flask(__name__, template_folder='.', static_folder='.')
app.secret_key = 'clave_secreta_para_sesion' # Necesario para usar 'session'

# Función para conectar a la base de datos MySQL
def get_db_connection():
    return mysql.connector.connect(
        host="localhost",
        user="root",        # Cambia esto si tu usuario de BD es diferente
        password="",        # Cambia esto por tu contraseña de BD
        database="royal_play" # Cambia esto por el nombre de tu BD
    )

@app.route('/login', methods=['POST'])
def login():
    email = request.form['email']
    password = request.form['password']
    
    db = get_db_connection()
    cursor = db.cursor(dictionary=True)
    
    # Consulta para verificar el usuario
    cursor.execute("SELECT nombre FROM usuarios WHERE email = %s AND password = %s", (email, password))
    user = cursor.fetchone()
    
    cursor.close()
    db.close()
    
    if user:
        # Si el login es correcto, guardamos el nombre en la sesión
        session['usuario_nombre'] = user['nombre']
        return redirect('/')
    
    return "Credenciales incorrectas o usuario no encontrado"

@app.route('/')
def inicio():
    nombre = session.get('usuario_nombre') # Devuelve None si no hay sesión
    return render_template('index.html', usuario=nombre)

if __name__ == '__main__':
    app.run(debug=True)
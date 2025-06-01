from datetime import timedelta
import re
from bson import ObjectId
from flask import Blueprint, jsonify, request
from flask_login import login_required, logout_user
from werkzeug.exceptions import BadRequest
from flask_jwt_extended import create_access_token, create_refresh_token, decode_token, get_jwt_identity, jwt_required
from werkzeug.security import generate_password_hash
from models import User  
from database import dbConnect

db = dbConnect()

auth = Blueprint('auth', __name__)

@auth.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        if not data or 'email' not in data or 'password' not in data:
            raise BadRequest("Faltan campos obligatorios: email, password")

        email = data['email']
        password = data['password']

        users_collection = db['users']
        user_data = users_collection.find_one({"email": email})
        if not user_data:
            return jsonify({"error": "Credenciales inválidas"}), 401

        user = User(user_data)
        if not user.verify_password(password):
            return jsonify({"error": "Credenciales inválidas"}), 401

        access_token = create_access_token(identity=user.id)
        refresh_token = create_refresh_token(identity=user.id)

        return jsonify({
            "success": True,
            "access_token": access_token,
            "refresh_token": refresh_token,
            "user": {
                "id": user.id,
                "username": user.username
            }
        }), 200
    except BadRequest as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        return jsonify({"error": "Error interno del servidor", "details": str(e)}), 500

@auth.route('/logout', methods=['POST'])
@login_required
def logout():
    logout_user()
    return jsonify({"success": True}), 200

@auth.route('/register', methods=['POST'])
def register():
    try:
        data = request.get_json()

        if not all(k in data for k in ['email', 'username', 'password']):
            return jsonify({"error": "Faltan campos obligatorios"}), 400

        email = data["email"].strip().lower()
        username = data["username"].strip()
        password = data["password"]

        email_regex = r'^[\w\.-]+@[\w\.-]+\.\w+$'
        if not re.match(email_regex, email):
            return jsonify({"error": "Formato de email no válido"}), 400

        if len(password) < 6:
            return jsonify({"error": "La contraseña debe tener al menos 6 caracteres"}), 400

        users_collection = db['users']
        if users_collection.find_one({"$or": [{"email": email}, {"username": username}]}):
            return jsonify({"error": "Usuario o email ya registrado"}), 409

        hashed_pw = generate_password_hash(password)
        user_data = {
            "username": username,
            "email": email,
            "password_hash": hashed_pw
        }

        result = users_collection.insert_one(user_data)

        access_token = create_access_token(identity=str(result.inserted_id))
        refresh_token = create_refresh_token(identity=str(result.inserted_id))

        return jsonify({
            "success": True,
            "user_id": str(result.inserted_id),
            "access_token": access_token,
            "refresh_token": refresh_token
        }), 201

    except Exception as e:
        return jsonify({"error": "Error interno del servidor", "details": str(e)}), 500
    
@auth.route('/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    current_user_id = get_jwt_identity()
    new_access_token = create_access_token(identity=current_user_id)
    return jsonify({
        "success": True,
        "access_token": new_access_token
    }), 200
    
@auth.route('/request-reset', methods=['POST'])
def request_reset():
    data = request.get_json()
    email = data.get('email')

    if not email:
        return jsonify({"error": "Email es requerido"}), 400

    user = db['users'].find_one({"email": email})
    if not user:
        return jsonify({"error": "No se encontró una cuenta con ese email"}), 404

    token = create_access_token(identity=str(user['_id']), expires_delta=timedelta(minutes=15))

    reset_link = f"http://localhost:5173/reset-password/{token}"
    print(f"Enlace para restablecer contraseña: {reset_link}")  

    return jsonify({"success": True, "message": "Enlace de restablecimiento enviado"}), 200

@auth.route('/reset-password', methods=['POST'])
def reset_password():
    data = request.get_json()
    token = data.get('token')
    new_password = data.get('password')

    try:
        user_id = get_jwt_identity() if token is None else decode_token(token)['sub']
    except Exception as e:
        return jsonify({"error": "Token inválido o expirado"}), 401

    hashed_pw = generate_password_hash(new_password)
    result = db['users'].update_one(
        {"_id": ObjectId(user_id)},
        {"$set": {"password_hash": hashed_pw}}
    )

    return jsonify({"success": True, "message": "Contraseña actualizada correctamente"}), 200
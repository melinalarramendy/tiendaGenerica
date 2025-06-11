from functools import wraps
from flask import jsonify
from flask_jwt_extended import get_jwt_identity, verify_jwt_in_request
from bson import ObjectId
import database as db

def admin_required(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        verify_jwt_in_request()
        current_user_id = get_jwt_identity()
        
        database = db.dbConnect()
        users_collection = database.users
        
        user = users_collection.find_one({"_id": ObjectId(current_user_id)})
        
        if not user or user.get("role") != "admin":
            return jsonify({
                "success": False, 
                "error": "Acceso no autorizado. Se requieren privilegios de administrador"
            }), 403
        
        return fn(*args, **kwargs)
    return wrapper
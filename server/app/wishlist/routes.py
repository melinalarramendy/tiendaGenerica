from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from bson import ObjectId
from models import User
from database import dbConnect

db = dbConnect()
wishlist = Blueprint('wishlist', __name__, url_prefix='/wishlist')


def get_current_user():
    user_data = db['users'].find_one({"_id": ObjectId(get_jwt_identity())})
    return User(user_data) if user_data else None


@wishlist.route('/', methods=['GET'])
@jwt_required()
def get_wishlist():
    user = get_current_user()
    if not user:
        return jsonify({"error": "Usuario no encontrado"}), 404
    
    wishlist_products = []
    for product_id in user.wishlist:
        product = db['products'].find_one({"_id": ObjectId(product_id)})
        if product:
            product["_id"] = str(product["_id"])
            wishlist_products.append(product)
    
    return jsonify(wishlist_products), 200


@wishlist.route('/add', methods=['POST'])
@jwt_required()
def add_to_wishlist():
    user = get_current_user()
    if not user:
        return jsonify({"error": "Usuario no encontrado"}), 404
    
    product_id = request.json.get('product_id')
    if not product_id:
        return jsonify({"error": "product_id es requerido"}), 400
    
    user.add_to_wishlist(product_id)
    
    db['users'].update_one(
        {"_id": ObjectId(user.id)},
        {"$set": {"wishlist": user.wishlist}}
    )
    
    return jsonify({"success": True}), 200

@wishlist.route('/remove/<product_id>', methods=['DELETE'])
@jwt_required()
def remove_from_wishlist(product_id):
    user = get_current_user()
    if not user:
        return jsonify({"error": "Usuario no encontrado"}), 404
    
    if product_id in user.wishlist:
        user.wishlist.remove(product_id)
    
    db['users'].update_one(
        {"_id": ObjectId(user.id)},
        {"$pull": {"wishlist": product_id}}
    )
    
    return jsonify({"success": True}), 200

@wishlist.route('/check/<product_id>', methods=['GET'])
@jwt_required()
def check_in_wishlist(product_id):
    user = get_current_user()
    if not user:
        return jsonify({"error": "Usuario no encontrado"}), 404
    
    return jsonify({"isInWishlist": product_id in user.wishlist}), 200
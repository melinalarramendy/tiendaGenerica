from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from bson import ObjectId
from models import User
from database import dbConnect

db = dbConnect()

cart = Blueprint('cart', __name__)

def get_current_user():
    user_data = db['users'].find_one({"_id": ObjectId(get_jwt_identity())})
    return User(user_data) if user_data else None


@cart.route('/', methods=['GET'])
@jwt_required()
def get_cart():
    user = get_current_user()
    items = []

    for item in user.cart:
        product = db['products'].find_one({"_id": ObjectId(item["product_id"])})
        if product:
            product["_id"] = str(product["_id"])
            items.append({
                "product": product,
                "quantity": item["quantity"]
            })

    return jsonify(items), 200


@cart.route('/add', methods=['POST'])
@jwt_required()
def add_to_cart():
    data = request.get_json()
    product_id = data.get("product_id")
    quantity = data.get("quantity", 1)

    user = get_current_user()
    user.add_to_cart(product_id, quantity)

    db['users'].update_one(
        {"_id": ObjectId(user.id)},
        {"$set": {"cart": user.cart}}
    )

    return jsonify({"message": "Producto agregado al carrito"}), 200

@cart.route('/update', methods=['PUT'])
@jwt_required()
def update_cart_item():
    data = request.get_json()
    product_id = data.get("product_id")
    quantity_change = data.get("quantity", 0) 

    user = get_current_user()
    
    item_index = next((i for i, item in enumerate(user.cart) 
                      if item["product_id"] == product_id), None)
    
    if item_index is not None:
        new_quantity = user.cart[item_index]["quantity"] + quantity_change
        
        if new_quantity <= 0:
            user.cart.pop(item_index)
        else:
            user.cart[item_index]["quantity"] = new_quantity
        
        db['users'].update_one(
            {"_id": ObjectId(user.id)},
            {"$set": {"cart": user.cart}}
        )
        
        return jsonify({"message": "Carrito actualizado"}), 200
    
    return jsonify({"message": "Producto no encontrado en el carrito"}), 404


@cart.route('/remove/<product_id>', methods=['DELETE'])
@jwt_required()
def remove_from_cart(product_id):
    user = get_current_user()
    user.remove_from_cart(product_id)

    db['users'].update_one(
        {"_id": ObjectId(user.id)},
        {"$set": {"cart": user.cart}}
    )

    return jsonify({"message": "Producto eliminado del carrito"}), 200
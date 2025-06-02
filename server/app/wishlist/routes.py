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
    products = []

    for pid in user.wishlist:
        product = db['products'].find_one({"_id": ObjectId(pid)})
        if product:
            product["_id"] = str(product["_id"])
            products.append(product)

    return jsonify(products), 200


@wishlist.route('/add', methods=['POST'])
@jwt_required()
def add_to_wishlist():
    data = request.get_json()
    product_id = data.get("product_id")

    user = get_current_user()
    user.add_to_wishlist(product_id)

    db['users'].update_one(
        {"_id": ObjectId(user.id)},
        {"$set": {"wishlist": user.wishlist}}
    )

    return jsonify({"message": "Producto agregado a la wishlist"}), 200
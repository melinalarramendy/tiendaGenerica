from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from bson import ObjectId
from datetime import datetime
import database as db

orders= Blueprint('orders', __name__)

@orders.route('/<order_id>', methods=['GET'])
@jwt_required()
def get_order(order_id):
    try:
        current_user_id = get_jwt_identity()
        database = db.dbConnect()
        orders_collection = database.orders
        
        order = orders_collection.find_one({
            "_id": ObjectId(order_id),
            "user_id": ObjectId(current_user_id)
        })
        
        if not order:
            return jsonify({"success": False, "error": "Orden no encontrada"}), 404
            
        order['_id'] = str(order['_id'])
        order['user_id'] = str(order['user_id'])
        order['created_at'] = order['created_at'].isoformat()
        order['updated_at'] = order['updated_at'].isoformat()
        
        for item in order['items']:
            item['product_id'] = str(item['product_id'])
        
        return jsonify({"success": True, "order": order}), 200
        
    except Exception as e:
        return jsonify({
            "success": False,
            "error": "Error al obtener la orden",
            "details": str(e)
        }), 500

@orders.route('/checkout', methods=['POST'])
@jwt_required()
def checkout():
    try:
        current_user_id = get_jwt_identity()
        data = request.get_json()
        
        if not data or 'items' not in data or not data['items']:
            return jsonify({"success": False, "error": "Datos inválidos - items requeridos"}), 400
        
        database = db.dbConnect()
        orders_collection = database.orders
        
        order_data = {
            "user_id": ObjectId(current_user_id),
            "items": [{
                "product_id": ObjectId(item.get('product_id')),
                "quantity": item.get('quantity', 1),
                "price": item.get('price'),
                "name": item.get('name', '')
            } for item in data['items']],
            "shipping_address": data.get('shipping_address', {}),
            "payment_method": data.get('payment_method', 'credit_card'),
            "shipping_method": data.get('shipping_method', 'standard'),
            "subtotal": data.get('subtotal'),
            "shipping_cost": data.get('shipping_cost', 0),
            "discount": data.get('discount', 0),
            "total": data.get('total'),
            "status": "pending",
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        
        # Insert order
        result = orders_collection.insert_one(order_data)
        
        return jsonify({
            "success": True,
            "order_id": str(result.inserted_id),
            "message": "Orden creada exitosamente"
        }), 201
        
    except Exception as e:
        return jsonify({
            "success": False,
            "error": "Error al procesar la orden",
            "details": str(e)
        }), 500
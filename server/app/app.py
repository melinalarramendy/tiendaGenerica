from datetime import datetime
import os
from bson import ObjectId, json_util
from dotenv import load_dotenv
from flask import Flask, json, jsonify, request
from flask_cors import CORS
from werkzeug.exceptions import BadRequest, NotFound
from flask_jwt_extended import JWTManager, create_access_token, get_jwt_identity, jwt_required
from werkzeug.security import generate_password_hash
from werkzeug.security import check_password_hash
import database as db
from auth.routes import auth
from cart.routes import cart
from wishlist.routes import wishlist
from orders.routes import orders
from decorators import admin_required


load_dotenv()
db = db.dbConnect()

app = Flask(__name__)
app.secret_key = os.getenv('SECRET_KEY', 'super-secret-key')
app.register_blueprint(auth, url_prefix='/auth')
app.register_blueprint(cart, url_prefix='/cart')
app.register_blueprint(wishlist , url_prefix='/wishlist')
app.register_blueprint(orders, url_prefix='/orders')

CORS(app)

jwt_manager = JWTManager(app)

@app.route('/dashboard')
@jwt_required()
def dashboard():
    try:
        current_user_id = get_jwt_identity()
        
        if not ObjectId.is_valid(current_user_id):
            return jsonify({"success": False, "error": "ID de usuario no válido"}), 400
        
        user_data = db['users'].find_one(
            {"_id": ObjectId(current_user_id)},
            {"password_hash": 0}  
        )
        
        if not user_data:
            return jsonify({"success": False, "error": "Usuario no encontrado"}), 404
        
        return jsonify({
            "success": True,
            "user": {
                "id": str(user_data["_id"]),
                "username": user_data["username"],
                "email": user_data["email"],
                "role" : user_data["role"]
            }
        }), 200
        
    except Exception as e:
        return jsonify({
            "success": False,
            "error": "Error interno del servidor",
            "details": str(e)
        }), 500

@app.route('/admin/users', methods=['GET'])
@admin_required 
def get_users():
    try:
        '''current_user_id = get_jwt_identity()'''
        users = db['users']


        users_list = list(users.find(
            {}, 
            {'password_hash': 0} 
        ))

        for user in users_list:
            user['_id'] = str(user['_id'])

        response = {
            'success': True,
            'users': json.loads(json_util.dumps(users_list)),

        }
        return jsonify(response), 200
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500
    


@app.route('/admin/user/<user_id>', methods=['GET'])
@admin_required 
def get_user(user_id):
    collection = db['users']
    try:
        if not ObjectId.is_valid(user_id):
            raise BadRequest("ID de usuario no válido")
        
        user = db['users'].find_one(
            {"_id": ObjectId(user_id)},
            {"password_hash": 0} 
        )

        if not user:
            raise NotFound("Usuario no encontrado")
        
        user['_id'] = str(user['_id'])

        
        response = {
            'success': True,
            'user': json.loads(json_util.dumps(user)),
            'links': {
                'self': f"/users/{user_id}",
            }
        }

        return jsonify(response), 200
    except BadRequest as e:
        return jsonify({
            'success': False,
            'error': str(e),
            'code': 400
        }), 400
        
    except NotFound as e:
        return jsonify({
            'success': False,
            'error': str(e),
            'code': 404
        }), 404
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': "Error interno del servidor",
            'details': str(e),
            'code': 500
        }), 500

        


@app.route('/admin/user/<user_id>', methods=['PUT'])
@admin_required 
def update_user(user_id):
    try:
        if not request.is_json:
            raise BadRequest("El request debe ser JSON (Content-Type: application/json)")

        if not ObjectId.is_valid(user_id):
            raise BadRequest("ID de usuario no válido")

        data = request.get_json()
        
        allowed_fields = ['username', 'email', 'password_hash', 'favorites', 'shopping_lists']
        update_data = {k: v for k, v in data.items() if k in allowed_fields}

        if not update_data:
            raise BadRequest("No se proporcionaron campos válidos para actualizar")

        result = db['users'].update_one(
            {'_id': ObjectId(user_id)},
            {'$set': update_data}
        )

        if result.matched_count == 0:
            raise NotFound("Usuario no encontrado")

        return jsonify({
            'success': True,
            'message': 'Usuario actualizado exitosamente',
            'modified_count': result.modified_count
        }), 200
    except BadRequest as e:
        return jsonify({
            'success': False,
            'error': str(e),
            'code': 400
        }), 400
    except NotFound as e:
        return jsonify({
            'success': False,
            'error': str(e),
            'code': 404
        }), 404
    except Exception as e:
        return jsonify({
            'success': False,
            'error': "Error interno del servidor",
            'details': str(e),
            'code': 500
        }), 500

@app.route('/admin/user/<user_id>', methods=['DELETE'])
@admin_required 
def delete_user(user_id):
    try:
        if not ObjectId.is_valid(user_id):
            raise BadRequest("ID de usuario no válido")

        result = db['users'].delete_one({'_id': ObjectId(user_id)})

        if result.deleted_count == 0:
            raise NotFound("Usuario no encontrado")

        return jsonify({
            'success': True,
            'message': 'Usuario eliminado exitosamente',
            'deleted_count': result.deleted_count
        }), 200
    except BadRequest as e:
        return jsonify({
            'success': False,
            'error': str(e),
            'code': 400
        }), 400
    except NotFound as e:
        return jsonify({
            'success': False,
            'error': str(e),
            'code': 404
        }), 404
    except Exception as e:
        return jsonify({
            'success': False,
            'error': "Error interno del servidor",
            'details': str(e),
            'code': 500
        }), 500

@app.route('/products', methods=['GET'])
def get_products():
    result = []
    for prod in db['products'].find({"is_active": True}):
        prod["_id"] = str(prod["_id"])
        result.append(prod)
    return jsonify(result), 200

@app.route('/admin/products', methods=['GET'])
@admin_required
def get_admin_products():
    try:
        products = list(db['products'].find())
        for prod in products:
            prod['_id'] = str(prod['_id'])
        return jsonify(products), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/products/<product_id>', methods=['GET'])
def get_product(product_id):
    product = db['products'].find_one({"_id": ObjectId(product_id), "is_active": True})
    if not product:
        return jsonify({"error": "Producto no encontrado"}), 404

    product["_id"] = str(product["_id"])
    return jsonify(product), 200

@app.route('/products/category/<category_name>', methods=['GET'])
def get_products_by_category(category_name):
    try:
        category_title = category_name.replace('-', ' ').title()
        
        products = list(db['products'].find({
            "category": {"$regex": f"^{category_title}$", "$options": "i"},
            "is_active": True
        }).limit(50))  
        
        for prod in products:
            prod["_id"] = str(prod["_id"])
            
        return jsonify({
            "category": category_title,
            "products": products,
            "count": len(products)
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route('/products/search', methods=['GET'])
def search_products():
    query = request.args.get('q', '').strip()
    if not query:
        return jsonify([]), 200

    try:
        regex_query = {'$regex': f'.*{query}.*', '$options': 'i'}
        
        products = list(db['products'].find({
            '$and': [
                {'is_active': True},
                {'$or': [
                    {'title': regex_query},
                    {'description': regex_query},
                    {'category': regex_query}
                ]}
            ]
        }).limit(10))  

        for prod in products:
            prod["_id"] = str(prod["_id"])
            
        return jsonify(products), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route('/admin/products', methods=['POST'])
@admin_required
def create_product():
    try:
        if not request.is_json:
            return jsonify({"success": False, "error": "Request debe ser JSON"}), 400

        data = request.get_json()
        
        # Validación básica de campos requeridos
        required_fields = ['title', 'price', 'category']
        for field in required_fields:
            if field not in data:
                return jsonify({"success": False, "error": f"Campo requerido faltante: {field}"}), 400

        # Establecer valores por defecto
        product_data = {
            "title": data['title'],
            "description": data.get('description', ''),
            "price": float(data['price']),
            "original_price": float(data.get('original_price', data['price'])),
            "category": data['category'],
            "subcategories": data.get('subcategories', []),
            "image_urls": data.get('image_urls', []),
            "main_image": data.get('main_image', data.get('image_urls', [])[0] if data.get('image_urls') else ''),
            "stock": int(data.get('stock', 0)),
            "sku": data.get('sku', ''),
            "brand": data.get('brand', ''),
            "attributes": data.get('attributes', {}),
            "is_featured": bool(data.get('is_featured', False)),
            "is_active": bool(data.get('is_active', True)),
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }

        # Insertar en la base de datos
        result = db['products'].insert_one(product_data)
        
        return jsonify({
            "success": True,
            "message": "Producto creado exitosamente",
            "product_id": str(result.inserted_id)
        }), 201

    except ValueError as e:
        return jsonify({"success": False, "error": "Datos numéricos inválidos"}), 400
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@app.route('/admin/products/<product_id>', methods=['PUT'])
@admin_required
def update_product(product_id):
    try:
        if not request.is_json:
            return jsonify({"success": False, "error": "Request debe ser JSON"}), 400

        if not ObjectId.is_valid(product_id):
            return jsonify({"success": False, "error": "ID de producto inválido"}), 400

        data = request.get_json()
        
        # Campos permitidos para actualización
        allowed_fields = {
            'title': str,
            'description': str,
            'price': float,
            'original_price': float,
            'category': str,
            'subcategories': list,
            'image_urls': list,
            'main_image': str,
            'stock': int,
            'sku': str,
            'brand': str,
            'attributes': dict,
            'is_featured': bool,
            'is_active': bool
        }

        update_data = {}
        for field, field_type in allowed_fields.items():
            if field in data:
                try:
                    update_data[field] = field_type(data[field])
                except (ValueError, TypeError):
                    return jsonify({"success": False, "error": f"Tipo inválido para el campo {field}"}), 400

        if not update_data:
            return jsonify({"success": False, "error": "No se proporcionaron datos válidos para actualizar"}), 400

        update_data['updated_at'] = datetime.utcnow()

        result = db['products'].update_one(
            {"_id": ObjectId(product_id)},
            {"$set": update_data}
        )

        if result.matched_count == 0:
            return jsonify({"success": False, "error": "Producto no encontrado"}), 404

        return jsonify({
            "success": True,
            "message": "Producto actualizado exitosamente",
            "modified_count": result.modified_count
        }), 200

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@app.route('/admin/products/<product_id>', methods=['DELETE'])
@admin_required
def delete_product(product_id):
    try:
        if not ObjectId.is_valid(product_id):
            return jsonify({"success": False, "error": "ID de producto inválido"}), 400

        result = db['products'].update_one(
            {"_id": ObjectId(product_id)},
            {"$set": {"is_active": False, "updated_at": datetime.utcnow()}}
        )

        if result.matched_count == 0:
            return jsonify({"success": False, "error": "Producto no encontrado"}), 404

        return jsonify({
            "success": True,
            "message": "Producto desactivado exitosamente",
            "modified_count": result.modified_count
        }), 200

        # borrado físico en lugar de soft delete
        """
        result = db['products'].delete_one({"_id": ObjectId(product_id)})
        if result.deleted_count == 0:
            return jsonify({"success": False, "error": "Producto no encontrado"}), 404
            
        return jsonify({
            "success": True,
            "message": "Producto eliminado permanentemente",
            "deleted_count": result.deleted_count
        }), 200
        """

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5005)
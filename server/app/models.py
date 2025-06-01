from werkzeug.security import generate_password_hash, check_password_hash
from bson import ObjectId 
from flask_login import UserMixin
from datetime import datetime

class User(UserMixin):
    def __init__(self, user_data):
        self.id = str(user_data["_id"])
        self.username = user_data["username"]
        self.email = user_data["email"]
        self.password_hash = user_data["password_hash"]
        self.address = user_data.get("address", {})  
        self.cart = user_data.get("cart", [])       
        self.wishlist = user_data.get("wishlist", [])  
        self.purchase_history = user_data.get("purchase_history", []) 
        self.created_at = user_data.get("created_at", datetime.utcnow())  
        
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)
        
    def verify_password(self, password):
        return check_password_hash(self.password_hash, password)

    def add_to_cart(self, product_id, quantity=1):
        existing = next((item for item in self.cart if item["product_id"] == product_id), None)
        if existing:
            existing["quantity"] += quantity
        else:
            self.cart.append({"product_id": product_id, "quantity": quantity})

    def remove_from_cart(self, product_id):
        self.cart = [item for item in self.cart if item["product_id"] != product_id]

    def add_to_wishlist(self, product_id):
        if product_id not in self.wishlist:
            self.wishlist.append(product_id)

    def toDBCollection(self):
        return {
            "_id": ObjectId(self.id) if self.id else ObjectId(),
            "username": self.username,
            "email": self.email,
            "password_hash": self.password_hash,
            "address": self.address,
            "cart": self.cart,
            "wishlist": self.wishlist,
            "purchase_history": self.purchase_history,
            "created_at": self.created_at
        }


class Product:
    def __init__(self, product_data):
        self.id = str(product_data["_id"])
        self.title = product_data["title"]                 
        self.description = product_data.get("description", "")
        self.price = product_data["price"]
        self.category = product_data.get("category", "general")
        self.image_url = product_data.get("image_url", "")
        self.stock = product_data.get("stock", 0)
        self.metadata = product_data.get("metadata", {})  

    def toDBCollection(self):
        return {
            "_id": ObjectId(self.id) if self.id else ObjectId(),
            "title": self.title,
            "description": self.description,
            "price": self.price,
            "category": self.category,
            "image_url": self.image_url,
            "stock": self.stock,
            "metadata": self.metadata
        }

class Order:
    def __init__(self, order_data):
        self.id = str(order_data["_id"])
        self.user_id = order_data["user_id"]
        self.items = order_data["items"] 
        self.total = order_data["total"]
        self.shipping_address = order_data["shipping_address"]
        self.payment_method = order_data["payment_method"]
        self.status = order_data.get("status", "pending")
        self.created_at = order_data.get("created_at", datetime.utcnow())

    def toDBCollection(self):
        return {
            "_id": ObjectId(self.id) if self.id else ObjectId(),
            "user_id": self.user_id,
            "items": self.items,
            "total": self.total,
            "shipping_address": self.shipping_address,
            "payment_method": self.payment_method,
            "status": self.status,
            "created_at": self.created_at
        }
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

    def add_to_cart(self, book_id, quantity=1):
        """Añade un libro al carrito"""
        existing = next((item for item in self.cart if item["book_id"] == book_id), None)
        if existing:
            existing["quantity"] += quantity
        else:
            self.cart.append({"book_id": book_id, "quantity": quantity})

    def remove_from_cart(self, book_id):
        """Elimina un libro del carrito"""
        self.cart = [item for item in self.cart if item["book_id"] != book_id]

    def add_to_wishlist(self, book_id):
        """Añade a lista de deseos"""
        if book_id not in self.wishlist:
            self.wishlist.append(book_id)

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
        
class Book:
    def __init__(self, book_data):
        self.id = str(book_data["_id"])
        self.title = book_data["title"]
        self.author = book_data["author"]
        self.isbn = book_data["isbn"]
        self.price = book_data["price"]
        self.genre = book_data.get("genre", [])
        self.cover_url = book_data.get("cover_url", "")
        self.description = book_data.get("description", "")
        self.stock = book_data.get("stock", 0)
        
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
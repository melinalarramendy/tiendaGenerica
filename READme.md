# 🛍️ Tienda Genérica - Ecommerce Template

![React](https://img.shields.io/badge/React-19.1.0-blue)
![Flask](https://img.shields.io/badge/Flask-3.1.0-green)
![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3.6-purple)

Plantilla genérica para ecommerce con backend en Flask y frontend en React, diseñada para ser adaptable a diferentes tipos de tiendas (ropa, electrónica, comida, etc.).

## ✨ Características principales

- **Arquitectura modular**: Diseñada para ser reutilizable como base para otros ecommerce
- **Autenticación JWT**: Sistema completo de registro y login
- **Diseño responsive**: Adaptable a cualquier dispositivo
- **Carrito de compras**: Funcionalidad completa
- **Panel de administración**: Para gestión de productos y usuarios

## 🛠️ Tecnologías utilizadas

### Frontend (React)
- **React 19** + React Router DOM
- **React-Bootstrap** + Bootstrap 5 para estilos
- **Axios** para comunicación con el backend
- **SweetAlert2** para notificaciones
- **React Multi Carousel** para sliders de productos

### Backend (Flask)
- **Flask** como framework principal
- **Flask-JWT-Extended** para autenticación
- **Flask-SQLAlchemy** para ORM con base de datos
- **Flask-CORS** para manejo de CORS
- **PyMongo** (opcional para MongoDB)

## 📦 Dependencias principales

### Frontend
"react": "^19.1.0",
"react-bootstrap": "^2.10.10",
"axios": "^1.9.0",
"react-router-dom": "^7.6.1"

### Backend
Flask==3.1.0
Flask-JWT-Extended==4.7.1
Flask-SQLAlchemy==3.1.1
Flask-CORS==5.0.1
PyMongo==4.6.2 (opcional)

## 📌 Notas del proyecto

Este proyecto fue creado como plantilla base para:

- Agilizar el desarrollo de futuros ecommerce específicos
- Probar arquitecturas y tecnologías antes de implementarlas en proyectos más grandes
- Servir como referencia para integración Flask+React
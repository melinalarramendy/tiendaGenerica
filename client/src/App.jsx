import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import "bootstrap-icons/font/bootstrap-icons.css";
import './App.css';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import ResetPassword from './components/auth/ResetPassword';
import PrivateRoute from './components/PrivateRoute';
import ForgotPassword from './components/auth/ForgotPassword';
import Dashboard from './components/Dashboard';
import HomePage from './components/HomePage';
import ProductDetail from './components/ProductDetail';
import CategoryPage from './components/CategoryPage';
import ComoComprar from './components/ComoComprar';
import Devoluciones from './components/Devoluciones';
import Contacto from './components/Contacto';
import Checkout from './components/Checkout';
import OrderDetail from './components/OrderDetail';
import AdminRoute from './components/AdminRoute';
import AdminPanel from './components/admin/AdminPanel';
import ProductForm from './components/admin/ProductForm';
import AdminUsersList from './components/admin/AdminUsersList';
import AdminUserDetail from './components/admin/AdminUserDetail';
import AdminOrderDetail from './components/admin/AdminOrderDetail';
import AdminUserCreate from './components/admin/AdminUserCreate';


function App() {

  return (
    <Router>
      <Routes>
        {/* RUTAS PUBLICAS */}
        <Route path="/" element={<HomePage />} />
        <Route path="/product/:productId" element={<ProductDetail />} />
        <Route path="/category/:categoryName" element={<CategoryPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/comocomprar" element={<ComoComprar />} />
        <Route path="/devoluciones" element={<Devoluciones />} />
        <Route path="/contacto" element={<Contacto />} />

        {/* RUTAS PRIVADAS */}
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/orders/:orderId" element={<OrderDetail />} />
        </Route>

        {/* RUTAS ADMIN */}

        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/admin/products/new" element={<ProductForm />} />
          <Route path="/admin/products/edit/:id" element={<ProductForm />} />
          <Route path="/admin/users" element={<AdminUsersList />} />
          <Route path="/admin/users/:id" element={<AdminUserDetail />} />
          <Route path="/admin/orders/:id" element={<AdminOrderDetail />} />
          <Route path="/admin/users/new" element={<AdminUserCreate />} />

        </Route>

      </Routes>
    </Router>
  )
}

export default App

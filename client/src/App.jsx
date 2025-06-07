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


function App() {

  return (
    <Router>
      <Routes>
        {/* RUTAS PUBLICAS */}
        <Route path="/" element={<HomePage />} />
        <Route path="/product/:productId" element={<ProductDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* RUTAS PRIVADAS */}
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>


      </Routes>
    </Router>
  )
}

export default App

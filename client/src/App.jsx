import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import ResetPassword from './components/auth/ResetPassword';
import PrivateRoute from './components/PrivateRoute';
import ForgotPassword from './components/auth/ForgotPassword';

function App() {

  return (
    <Router>
      <Routes>
        {/* RUTAS PUBLICAS */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />



        {/* RUTAS PRIVADAS */}

      </Routes>
    </Router>
  )
}

export default App

import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from './components/auth/Login';

function App() {

  return (
    <Router>
      <Routes>
        {/* RUTAS PUBLICAS */}
        <Route path="/" element={<Login />} />


        {/* RUTAS PRIVADAS */}

      </Routes>
    </Router>
  )
}

export default App

import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

function isTokenValid(token) {
    if (!token) return false;
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (!payload.exp) return false;
        const now = Math.floor(Date.now() / 1000);
        return payload.exp > now;
    } catch (e) {
        return false;
    }
}

const PrivateRoute = () => {
    const token = localStorage.getItem('token');
    const valid = isTokenValid(token);
    return valid ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import axios from 'axios';

const AdminRoute = () => {
    const [isAdmin, setIsAdmin] = useState(null);

    useEffect(() => {
        const checkAdmin = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setIsAdmin(false);
                return;
            }
            try {
                const res = await axios.get('/api/dashboard', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                console.log('Respuesta backend /api/dashboard:', res.data);
                if (res.data.success && res.data.user?.role === 'admin') {
                    setIsAdmin(true);
                } else {
                    setIsAdmin(false);
                }
            } catch (err) {
                console.error('Error en AdminRoute:', err);
                setIsAdmin(false);
            }
        };
        checkAdmin();
    }, []);


    if (isAdmin === null) {
        return null;
    }

    return isAdmin ? <Outlet /> : <Navigate to="/" replace />;

};

export default AdminRoute;
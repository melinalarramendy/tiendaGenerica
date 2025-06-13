import React, { useState } from 'react';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import { FaUserPlus } from 'react-icons/fa';

const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
    }
});

const AdminUserCreate = () => {
    const [form, setForm] = useState({
        username: '',
        email: '',
        password: '',
        role: 'user'
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value.trim() });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem('token');
            await axios.post('/api/admin/user', form, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            Toast.fire({
                icon: 'success',
                title: 'Usuario creado exitosamente'
            });
            console.log("Datos enviados:", editForm);
            navigate('/admin/users');
        } catch (err) {
            setError(err.response?.data?.message || 'Error al crear usuario');
        }
    };

    return (
        <Container className="my-5">
            <Card className="shadow-sm">
                <Card.Header className="bg-success text-white">
                    <h4 className="mb-0">
                        <FaUserPlus className="me-2" />
                        Crear Nuevo Usuario
                    </h4>
                </Card.Header>

                <Card.Body>
                    {error && <Alert variant="danger">{error}</Alert>}

                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Nombre de usuario</Form.Label>
                            <Form.Control
                                type="text"
                                name="username"
                                required
                                value={form.username}
                                onChange={handleChange}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Correo electrónico</Form.Label>
                            <Form.Control
                                type="email"
                                name="email"
                                required
                                value={form.email}
                                onChange={handleChange}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Contraseña</Form.Label>
                            <Form.Control
                                type="password"
                                name="password"
                                required
                                value={form.password}
                                onChange={handleChange}
                            />
                        </Form.Group>

                        <Form.Group className="mb-4">
                            <Form.Label>Rol</Form.Label>
                            <Form.Select
                                name="role"
                                value={form.role}
                                onChange={handleChange}
                            >
                                <option value="user">Usuario</option>
                                <option value="admin">Administrador</option>
                            </Form.Select>
                        </Form.Group>

                        <div className="d-flex justify-content-end">
                            <Button variant="secondary" className="me-2" onClick={() => navigate('/admin/users')}>
                                Cancelar
                            </Button>
                            <Button type="submit" variant="success" onClick={() => navigate('/admin/users')}>
                                Crear Usuario
                            </Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default AdminUserCreate;
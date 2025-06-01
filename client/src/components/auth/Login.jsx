import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Form, Button, Card, Alert, Spinner } from 'react-bootstrap';
import Swal from 'sweetalert2';

const toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
    didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
    },
});

const Login = () => {
    const [email, setEmail] = useState(localStorage.getItem('rememberedEmail') || '');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(!!localStorage.getItem('rememberedEmail'));
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await fetch('http://localhost:5005/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) throw new Error('Credenciales inválidas');

            const data = await response.json();
            localStorage.setItem('token', data.access_token);

            if (rememberMe) {
                localStorage.setItem('rememberedEmail', email);
            } else {
                localStorage.removeItem('rememberedEmail');
            }

            toast.fire({
                icon: 'success',
                title: '¡Inicio de sesión exitoso!',
            });

            setTimeout(() => {
                navigate('/dashboard');
            }, 1000);
        } catch (err) {
            toast.fire({
                icon: 'error',
                title: err.message,
            });
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
            <Container className="d-flex justify-content-center align-items-center min-vh-100">
                <Card className="vintage-card mx-auto">
                    <Card.Header className="vintage-card-header text-center">
                        <h3 className="vintage-title">Ingreso a la Biblioteca</h3>
                    </Card.Header>

                    <Card.Body>
                        {error && <Alert variant="danger">{error}</Alert>}

                        <Form onSubmit={handleLogin}>
                            <Form.Group className="mb-3">
                                <Form.Label className="vintage-label">Correo Electrónico</Form.Label>
                                <Form.Control
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="vintage-input"
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label className="vintage-label">Contraseña</Form.Label>
                                <Form.Control
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="vintage-input"
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Check
                                    type="checkbox"
                                    label="Recordarme"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                    className="vintage-checkbox"
                                />
                            </Form.Group>

                            <Button
                                variant="primary"
                                type="submit"
                                className="w-100 vintage-button"
                                disabled={loading}
                            >
                                {loading ? (
                                    <Spinner animation="border" size="sm" role="status" />
                                ) : (
                                    'Ingresar'
                                )}
                            </Button>
                        </Form>

                        <div className="text-center mt-4">
                            <a href="/forgot-password" className="vintage-link">¿Olvidaste tu contraseña?</a>
                            <div style={{ fontWeight: 'bold', margin: '10px 0' }}>o</div>
                            <span>
                                ¿No tienes cuenta? <a href="/register" className="vintage-link">Regístrate</a>
                            </span>
                        </div>
                    </Card.Body>

                    <Card.Footer className="vintage-card-footer text-center">
                        <a href="/" className="vintage-link">Volver al Inicio</a>
                    </Card.Footer>
                </Card>
            </Container>
    );
};

export default Login;

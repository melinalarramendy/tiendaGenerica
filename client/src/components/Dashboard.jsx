import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Spinner, Button } from 'react-bootstrap';
import NavbarTienda from './NavbarTienda'; 

const Dashboard = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('/api/dashboard', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                if (data.success) {
                    setUser(data.user);
                }
            } catch (err) {
                console.error('Error fetching user:', err);
                setUser(null);
                if (err.message.includes('401')) {
                    localStorage.removeItem('token');
                    window.location.href = '/login';
                }
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, []);

    if (loading) return (
        <Container className="text-center mt-5">
            <Spinner animation="border" variant="primary" />
            <div>Cargando...</div>
        </Container>
    );

    if (!user) return (
        <Container className="text-center mt-5 text-danger">
            No se pudo cargar el usuario.
        </Container>
    );

    return (
        <>
            <NavbarTienda />
            <div className="login-container">
                <Container className="mt-5">
                    <Row className="justify-content-center">
                        <Col md={8} lg={6}>
                            <Card className="shadow-lg">
                                <Card.Body>
                                    <Card.Title className="mb-4 text-center" style={{ fontSize: '2rem', fontWeight: 'bold' }}>
                                        ¡Bienvenido al Dashboard!
                                    </Card.Title>
                                    <Row className="mb-3">
                                        <Col xs={6}>
                                            <Card className="bg-light">
                                                <Card.Body>
                                                    <Card.Subtitle className="mb-2 text-muted">Usuario</Card.Subtitle>
                                                    <Card.Text style={{ fontSize: '1.2rem' }}>{user.username}</Card.Text>
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                        <Col xs={6}>
                                            <Card className="bg-light">
                                                <Card.Body>
                                                    <Card.Subtitle className="mb-2 text-muted">Email</Card.Subtitle>
                                                    <Card.Text style={{ fontSize: '1.2rem' }}>{user.email}</Card.Text>
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            <Card className="bg-light">
                                                <Card.Body>
                                                    <Card.Subtitle className="mb-2">ID de usuario</Card.Subtitle>
                                                    <Card.Text style={{ fontSize: '1rem' }}>{user.id}</Card.Text>
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            <Card className="bg-light">
                                                <Card.Body>
                                                    <Card.Subtitle className="mb-2">Rol</Card.Subtitle>
                                                    <Card.Text style={{ fontSize: '1rem' }}>{user.role}</Card.Text>
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                    </Row>
                                    <div className="text-center mt-4">
                                        <Button variant="outline-primary" onClick={() => {
                                            localStorage.removeItem('token');
                                            window.location.href = '/login';
                                        }}>
                                            Cerrar sesión
                                        </Button>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
        </>

    );
};

export default Dashboard;
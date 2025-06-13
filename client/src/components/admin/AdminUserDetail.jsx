import React, { useEffect, useState } from 'react';
import {
    useParams,
    useNavigate
} from 'react-router-dom';
import {
    Container,
    Card,
    Table,
    Spinner,
    Alert,
    Badge,
    Button,
    ListGroup,
    Tab,
    Row,
    Col,
    Modal,
    Form,
    Tabs
} from 'react-bootstrap';
import axios from 'axios';
import Swal from 'sweetalert2';
import {
    FaUser,
    FaShoppingBag,
    FaHistory,
    FaEnvelope,
    FaHome,
    FaPhone,
    FaEdit,
    FaArrowLeft
} from 'react-icons/fa';

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

const AdminUserDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('profile');
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [editForm, setEditForm] = useState({ username: '', email: '', role: '' });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const [userRes, ordersRes] = await Promise.all([
                    axios.get(`/api/admin/user/${id}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    }),
                    axios.get(`/api/admin/user/${id}/orders`, {
                        headers: { Authorization: `Bearer ${token}` }
                    })
                ]);

                setUser(userRes.data.user);
                setOrders(ordersRes.data.orders);
            } catch (err) {
                setError('Error al cargar datos del usuario');
                Toast.fire({
                    icon: 'error',
                    title: 'Error al cargar datos',
                    text: err.response?.data?.message || 'Intente nuevamente'
                });
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusBadge = (status) => {
        const statusMap = {
            'pending': 'warning',
            'processing': 'info',
            'shipped': 'primary',
            'delivered': 'success',
            'cancelled': 'danger'
        };
        return <Badge bg={statusMap[status] || 'secondary'}>{status}</Badge>;
    };

    const handleEditClick = (user) => {
        setSelectedUser(user);
        setEditForm({
            username: user.username,
            email: user.email,
            role: user.role
        });
        setShowEditModal(true);
    };

    const handleEditChange = (e) => {
        const value = e.target.value.trim();
        setEditForm({ ...editForm, [e.target.name]: value });
    };

    const handleEditSave = async () => {
        setSaving(true);
        try {
            const token = localStorage.getItem('token');
            const res = await axios.put(`/api/admin/user/${selectedUser._id}`, editForm, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setUser(res.data.user);
            setShowEditModal(false);
            Toast.fire({
                icon: 'success',
                title: 'Usuario actualizado correctamente'
            });
        } catch (err) {
            alert('Error al actualizar usuario');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
                <Spinner animation="border" variant="primary" />
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="mt-5">
                <Alert variant="danger">{error}</Alert>
                <Button variant="secondary" onClick={() => navigate(-1)}>
                    Volver
                </Button>
            </Container>
        );
    }

    if (!user) return null;

    return (
        <Container className="my-5">
            <Button
                variant="outline-secondary"
                onClick={() => navigate('/admin/users')}
                className="mb-3"
            >
                <FaArrowLeft className="me-2" />
                Volver a la lista
            </Button>

            <Card className="shadow-sm mb-4">
                <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
                    <h4 className="mb-0">
                        <FaUser className="me-2" />
                        Detalle del Usuario
                    </h4>
                    <Button
                        variant="light"
                        size="sm"
                        onClick={() => handleEditClick(user)}
                    >
                        <FaEdit className="me-2" />
                        Editar
                    </Button>
                </Card.Header>

                <Card.Body>
                    <Tabs
                        activeKey={activeTab}
                        onSelect={(k) => setActiveTab(k)}
                        className="mb-4"
                    >
                        <Tab eventKey="profile" title="Perfil">
                            <Row className="mt-3">
                                <Col md={6}>
                                    <ListGroup variant="flush">
                                        <ListGroup.Item className="d-flex justify-content-between align-items-center">
                                            <span className="fw-bold">ID:</span>
                                            <span>{user._id}</span>
                                        </ListGroup.Item>
                                        <ListGroup.Item className="d-flex justify-content-between align-items-center">
                                            <span className="fw-bold">Nombre de usuario:</span>
                                            <span>{user.username}</span>
                                        </ListGroup.Item>
                                        <ListGroup.Item className="d-flex justify-content-between align-items-center">
                                            <span className="fw-bold">Email:</span>
                                            <span>{user.email}</span>
                                        </ListGroup.Item>
                                        <ListGroup.Item className="d-flex justify-content-between align-items-center">
                                            <span className="fw-bold">Rol:</span>
                                            <Badge bg={user.role === 'admin' ? 'primary' : 'secondary'}>
                                                {user.role}
                                            </Badge>
                                        </ListGroup.Item>
                                        <ListGroup.Item className="d-flex justify-content-between align-items-center">
                                            <span className="fw-bold">Fecha de registro:</span>
                                            <span>{formatDate(user.created_at)}</span>
                                        </ListGroup.Item>
                                    </ListGroup>
                                </Col>

                                <Col md={6}>
                                    <Card>
                                        <Card.Header>
                                            <FaHome className="me-2" />
                                            Dirección de envío
                                        </Card.Header>
                                        <Card.Body>
                                            {user.address ? (
                                                <>
                                                    <p><strong>Nombre:</strong> {user.address.name}</p>
                                                    <p><strong>Dirección:</strong> {user.address.street}</p>
                                                    <p><strong>Ciudad:</strong> {user.address.city}, {user.address.state}</p>
                                                    <p><strong>Código postal:</strong> {user.address.postal_code}</p>
                                                    <p><strong>Teléfono:</strong> {user.address.phone}</p>
                                                </>
                                            ) : (
                                                <p className="text-muted">No hay dirección registrada</p>
                                            )}
                                        </Card.Body>
                                    </Card>
                                </Col>
                            </Row>
                        </Tab>

                        <Tab eventKey="orders" title={`Órdenes (${orders.length})`}>
                            <div className="mt-3">
                                {orders.length > 0 ? (
                                    <div className="table-responsive">
                                        <Table striped hover>
                                            <thead className="table-dark">
                                                <tr>
                                                    <th>ID Orden</th>
                                                    <th>Fecha</th>
                                                    <th>Productos</th>
                                                    <th>Total</th>
                                                    <th>Estado</th>
                                                    <th>Acciones</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {orders.map(order => (
                                                    <tr key={order._id}>
                                                        <td>{order._id}</td>
                                                        <td>{formatDate(order.created_at)}</td>
                                                        <td>{order.items.length} productos</td>
                                                        <td>${order.total?.toFixed(2)}</td>
                                                        <td>{getStatusBadge(order.status)}</td>
                                                        <td>
                                                            <Button
                                                                size="sm"
                                                                variant="outline-primary"
                                                                onClick={() => navigate(`/admin/orders/${order._id}`)}
                                                            >
                                                                Ver detalle
                                                            </Button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </Table>
                                    </div>
                                ) : (
                                    <Alert variant="info" className="text-center">
                                        <FaShoppingBag className="me-2" />
                                        Este usuario no ha realizado ninguna orden
                                    </Alert>
                                )}
                            </div>
                        </Tab>

                        <Tab eventKey="activity" title="Actividad">
                            <div className="mt-3">
                                <Alert variant="info" className="text-center">
                                    <FaHistory className="me-2" />
                                    Historial de actividad del usuario
                                </Alert>
                            </div>
                        </Tab>
                    </Tabs>
                </Card.Body>
            </Card>

            <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Editar Usuario</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Usuario</Form.Label>
                            <Form.Control
                                type="text"
                                name="username"
                                value={editForm.username}
                                onChange={handleEditChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                name="email"
                                value={editForm.email}
                                onChange={handleEditChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Rol</Form.Label>
                            <Form.Select
                                name="role"
                                value={editForm.role}
                                onChange={handleEditChange}
                            >
                                <option value="user">Usuario</option>
                                <option value="admin">Administrador</option>
                            </Form.Select>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowEditModal(false)}>
                        Cancelar
                    </Button>
                    <Button variant="primary" onClick={() => { navigate('/admin/users'); handleEditSave(); }} disabled={saving}>
                        {saving ? 'Guardando...' : 'Guardar'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default AdminUserDetail;
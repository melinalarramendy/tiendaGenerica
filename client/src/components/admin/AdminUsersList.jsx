import React, { useEffect, useState } from 'react';
import {
    Container,
    Card,
    Table,
    Button,
    Spinner,
    Alert,
    Badge,
    InputGroup,
    FormControl,
    Pagination
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import { FaSearch, FaEye, FaEdit, FaTrash, FaUserShield } from 'react-icons/fa';

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

const AdminUsersList = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [usersPerPage] = useState(10);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('/api/admin/users', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUsers(res.data.users);
            } catch (err) {
                setError('Error al cargar usuarios');
                Toast.fire({
                    icon: 'error',
                    title: 'Error al cargar usuarios',
                    text: err.response?.data?.message || 'Intente nuevamente'
                });
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    const handleDelete = async (userId) => {
        try {
            const result = await Swal.fire({
                title: '¿Estás seguro?',
                text: "No podrás revertir esta acción!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Sí, eliminar!',
                cancelButtonText: 'Cancelar'
            });

            if (result.isConfirmed) {
                const token = localStorage.getItem('token');
                await axios.delete(`/api/admin/user/${userId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                setUsers(users.filter(user => user._id !== userId));

                Toast.fire({
                    icon: 'success',
                    title: 'Usuario eliminado',
                    text: 'El usuario ha sido eliminado correctamente'
                });
            }
        } catch (err) {
            Toast.fire({
                icon: 'error',
                title: 'Error al eliminar usuario',
                text: err.response?.data?.message || 'Intente nuevamente'
            });
        }
    };

    const filteredUsers = users.filter(user =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
    const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

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
            </Container>
        );
    }

    return (
        <Container className="my-5">
            <Card className="shadow-sm">
                <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
                    <h4 className="mb-0">
                        <FaUserShield className="me-2" />
                        Administración de Usuarios
                    </h4>
                    <Button variant="light" size="sm" onClick={() => navigate('/admin/users/new')}>
                        Nuevo Usuario
                    </Button>
                </Card.Header>

                <Card.Body>
                    <InputGroup className="mb-4">
                        <InputGroup.Text>
                            <FaSearch />
                        </InputGroup.Text>
                        <FormControl
                            placeholder="Buscar usuarios..."
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </InputGroup>

                    <div className="table-responsive">
                        <Table striped hover className="mb-0">
                            <thead className="table-dark">
                                <tr>
                                    <th>Usuario</th>
                                    <th>Email</th>
                                    <th>Rol</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentUsers.length > 0 ? (
                                    currentUsers.map(user => (
                                        <tr key={user._id}>
                                            <td>
                                                <div className="d-flex align-items-center">
                                                    <div className="ms-2">
                                                        <div className="fw-bold">{user.username}</div>
                                                        <small className="text-muted">ID: {user._id}</small>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>{user.email}</td>
                                            <td>
                                                <Badge bg={user.role === 'admin' ? 'primary' : 'secondary'}>
                                                    {user.role}
                                                </Badge>
                                            </td>
                                            <td>
                                                <Button
                                                    variant="outline-primary"
                                                    size="sm"
                                                    className="me-2"
                                                    onClick={() => navigate(`/admin/users/${user._id}`)}
                                                >
                                                    <FaEye />
                                                </Button>
                                                <Button
                                                    variant="outline-success"
                                                    size="sm"
                                                    className="me-2"
                                                    onClick={() => navigate(`/admin/users/edit/${user._id}`)}
                                                >
                                                    <FaEdit />
                                                </Button>
                                                <Button
                                                    variant="outline-danger"
                                                    size="sm"
                                                    onClick={() => handleDelete(user._id)}
                                                >
                                                    <FaTrash />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="text-center py-4">
                                            {searchTerm ? 'No se encontraron usuarios' : 'No hay usuarios registrados'}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>
                    </div>

                    {filteredUsers.length > usersPerPage && (
                        <div className="d-flex justify-content-center mt-4">
                            <Pagination>
                                <Pagination.Prev
                                    disabled={currentPage === 1}
                                    onClick={() => setCurrentPage(prev => prev - 1)}
                                />
                                {[...Array(totalPages)].map((_, index) => (
                                    <Pagination.Item
                                        key={index + 1}
                                        active={index + 1 === currentPage}
                                        onClick={() => setCurrentPage(index + 1)}
                                    >
                                        {index + 1}
                                    </Pagination.Item>
                                ))}
                                <Pagination.Next
                                    disabled={currentPage === totalPages}
                                    onClick={() => setCurrentPage(prev => prev + 1)}
                                />
                            </Pagination>
                        </div>
                    )}
                </Card.Body>
            </Card>
        </Container>
    );
};

export default AdminUsersList;
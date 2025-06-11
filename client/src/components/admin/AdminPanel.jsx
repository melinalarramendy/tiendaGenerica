import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Table, Button, Spinner, Alert } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import NavbarTienda from '../NavbarTienda';
import Footer from '../Footer';

const AdminPanel = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('/api/admin/products', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setProducts(response.data);
            } catch (err) {
                if (err.response?.status === 403) {
                    navigate('/');
                    Swal.fire('Error', 'No tienes permisos de administrador', 'error');
                } else {
                    setError('Error al cargar productos');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [navigate]);

    const handleDelete = async (productId) => {
        try {
            const result = await Swal.fire({
                title: '¿Estás seguro?',
                text: "No podrás revertir esto!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Sí, borrar!'
            });

            if (result.isConfirmed) {
                const token = localStorage.getItem('token');
                await axios.delete(`/api/admin/products/${productId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setProducts(products.filter(p => p._id !== productId));
                Swal.fire('Borrado!', 'El producto ha sido eliminado.', 'success');
            }
        } catch (err) {
            Swal.fire('Error', 'No se pudo eliminar el producto', 'error');
        }
    };

    if (loading) return <Spinner animation="border" />;
    if (error) return <Alert variant="danger">{error}</Alert>;

    return (
        <>
        <NavbarTienda />
            <Container className="mt-5">
                <h1>Panel de Administración</h1>
                <Button variant="primary" onClick={() => navigate('/admin/products/new')} className="mb-3">
                    Añadir Nuevo Producto
                </Button>

                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Precio</th>
                            <th>Stock</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(product => (
                            <tr key={product._id}>
                                <td>{product._id}</td>
                                <td>{product.title}</td>
                                <td>${product.price}</td>
                                <td>{product.stock}</td>
                                <td>
                                    <Button variant="info" size="sm" onClick={() => navigate(`/admin/products/edit/${product._id}`)}>
                                        Editar
                                    </Button>{' '}
                                    <Button variant="danger" size="sm" onClick={() => handleDelete(product._id)}>
                                        Eliminar
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Container>
            <Footer />
        </>
    );
};



export default AdminPanel;
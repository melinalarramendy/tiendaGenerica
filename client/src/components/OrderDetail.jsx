import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import NavbarTienda from './NavbarTienda';
import Footer from './Footer';
import Swal from 'sweetalert2';
import {
    Container,
    Spinner,
    Alert,
    Row,
    Col,
    Image,
    Button,
    Badge,
    Card,
    ListGroup,
    Table
} from 'react-bootstrap';
import axios from 'axios';
import { FaFilePdf, FaPrint, FaHome, FaShoppingBag } from 'react-icons/fa';
import { useReactToPrint } from 'react-to-print';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
});

const OrderDetail = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const orderRef = React.useRef();

    useEffect(() => {
        const fetchOrder = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login', { state: { from: `/orders/${orderId}` } });
                return;
            }

            try {
                const response = await axios.get(`/api/orders/${orderId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (response.data.success) {
                    setOrder(response.data.order);
                } else {
                    setError(response.data.error || "Error al cargar la orden");
                }
            } catch (err) {
                console.error('Error fetching order:', err);
                if (err.response) {
                    if (err.response.status === 404) {
                        setError("Orden no encontrada");
                    } else if (err.response.status === 401) {
                        setError("No autorizado - por favor inicia sesión");
                        navigate('/login');
                    } else {
                        setError(`Error del servidor: ${err.response.status}`);
                    }
                } else if (err.request) {
                    setError("No se pudo conectar al servidor");
                } else {
                    setError("Error al configurar la solicitud");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [orderId, navigate]);

    const handlePrint = useReactToPrint({
        content: () => orderRef.current,
        pageStyle: `
            @page {
                size: A4;
                margin: 10mm;
            }
            @media print {
                body {
                    padding: 20px;
                }
                .no-print {
                    display: none !important;
                }
                .print-only {
                    display: block !important;
                }
            }
        `,
        documentTitle: `Orden_${orderId}`,
        onAfterPrint: () => {
            Toast.fire({
                icon: 'success',
                title: 'Comprobante listo para imprimir'
            });
        }
    });

    const handleExportPDF = () => {
        Toast.fire({
            icon: 'info',
            title: 'Generando PDF...',
            timer: 2000
        });

        const input = orderRef.current;
        html2canvas(input, {
            scale: 2,
            logging: true,
            useCORS: true,
            allowTaint: true
        }).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const imgWidth = 190;
            const pageHeight = 277;
            const imgHeight = canvas.height * imgWidth / canvas.width;
            let heightLeft = imgHeight;
            let position = 10;

            pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;

            while (heightLeft >= 0) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
            }

            pdf.save(`Orden_${orderId}.pdf`);

            Toast.fire({
                icon: 'success',
                title: 'PDF generado con éxito'
            });
        }).catch((err) => {
            console.error('Error al generar PDF:', err);
            Toast.fire({
                icon: 'error',
                title: 'Error al generar PDF'
            });
        });
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString('es-ES', options);
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'pending':
                return <Badge bg="warning" className="ms-2">Pendiente</Badge>;
            case 'processing':
                return <Badge bg="info" className="ms-2">Procesando</Badge>;
            case 'shipped':
                return <Badge bg="primary" className="ms-2">Enviado</Badge>;
            case 'delivered':
                return <Badge bg="success" className="ms-2">Entregado</Badge>;
            case 'cancelled':
                return <Badge bg="danger" className="ms-2">Cancelado</Badge>;
            default:
                return <Badge bg="secondary" className="ms-2">{status}</Badge>;
        }
    };

    if (loading) return (
        <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
            <Spinner animation="border" variant="primary" />
        </div>
    );

    if (error) return (
        <Container className="mt-5">
            <Alert variant="danger" className="text-center">
                {error}
                <div className="mt-3">
                    <Button variant="primary" onClick={() => navigate('/')}>
                        <FaHome className="me-2" /> Volver a la tienda
                    </Button>
                </div>
            </Alert>
        </Container>
    );

    return (
        <>
            <NavbarTienda />
            <Container className="my-5 order-detail-container">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h1 className="mb-0">
                        <FaShoppingBag className="me-2" /> Detalle de la Orden
                    </h1>
                    <div className="no-print">
                        <Button variant="outline-primary" className="me-2" onClick={handlePrint}>
                            <FaPrint className="me-2" /> Imprimir
                        </Button>
                        <Button variant="danger" onClick={handleExportPDF}>
                            <FaFilePdf className="me-2" /> Exportar PDF
                        </Button>
                    </div>
                </div>

                <div ref={orderRef} className="order-detail-content p-4 bg-white rounded shadow-sm">
                    <Row className="mb-4">
                        <Col md={6}>
                            <h4>Información de la Orden</h4>
                            <ListGroup variant="flush">
                                <ListGroup.Item>
                                    <strong>Número de orden:</strong> {order._id}
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <strong>Fecha:</strong> {formatDate(order.created_at)}
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <strong>Estado:</strong> {getStatusBadge(order.status)}
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <strong>Método de pago:</strong> {order.payment_method === 'credit_card' ? 'Tarjeta de crédito' : order.payment_method}
                                </ListGroup.Item>
                            </ListGroup>
                        </Col>
                        <Col md={6}>
                            <h4>Dirección de envío</h4>
                            <ListGroup variant="flush">
                                <ListGroup.Item>
                                    <strong>Nombre:</strong> {order.shipping_address?.name || 'No especificado'}
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <strong>Dirección:</strong> {order.shipping_address?.address || 'No especificado'}
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <strong>Ciudad:</strong> {order.shipping_address?.city || 'No especificado'}
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <strong>Código postal:</strong> {order.shipping_address?.postal_code || 'No especificado'}
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <strong>Teléfono:</strong> {order.shipping_address?.phone || 'No especificado'}
                                </ListGroup.Item>
                            </ListGroup>
                        </Col>
                    </Row>

                    <h4 className="mt-4 mb-3">Productos</h4>
                    <Table striped bordered hover responsive className="mb-4">
                        <thead>
                            <tr>
                                <th>Producto</th>
                                <th>Precio unitario</th>
                                <th>Cantidad</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {order.items.map((item, index) => (
                                <tr key={index}>
                                    <td>
                                        <div className="d-flex align-items-center">
                                            <img
                                                src={item.main_image}
                                                alt={item.name}
                                                className="rounded me-3"
                                                style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                                            />
                                            {item.name}
                                        </div>
                                    </td>
                                    <td>${item.price?.toLocaleString() || '0'}</td>
                                    <td>{item.quantity}</td>
                                    <td>${(item.price * item.quantity)?.toLocaleString() || '0'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>

                    <Row className="justify-content-end">
                        <Col md={4}>
                            <ListGroup variant="flush">
                                <ListGroup.Item className="d-flex justify-content-between">
                                    <strong>Subtotal:</strong>
                                    <span>${order.subtotal?.toLocaleString() || '0'}</span>
                                </ListGroup.Item>
                                <ListGroup.Item className="d-flex justify-content-between">
                                    <strong>Envío:</strong>
                                    <span>${order.shipping_cost?.toLocaleString() || '0'}</span>
                                </ListGroup.Item>
                                {order.discount > 0 && (
                                    <ListGroup.Item className="d-flex justify-content-between">
                                        <strong>Descuento:</strong>
                                        <span>-${order.discount?.toLocaleString() || '0'}</span>
                                    </ListGroup.Item>
                                )}
                                <ListGroup.Item className="d-flex justify-content-between fs-5 fw-bold">
                                    <strong>Total:</strong>
                                    <span>${order.total?.toLocaleString() || '0'}</span>
                                </ListGroup.Item>
                            </ListGroup>
                        </Col>
                    </Row>

                    <div className="print-only text-center mt-4" style={{ display: 'none' }}>
                        <p>Gracias por tu compra!</p>
                        <p>Orden #{order._id} - Fecha: {formatDate(order.created_at)}</p>
                    </div>
                </div>

                <div className="text-center mt-4 no-print">
                    <Button variant="primary" onClick={() => navigate('/')}>
                        <FaHome className="me-2" /> Volver a la tienda
                    </Button>
                </div>
            </Container>
            <Footer />
        </>
    );
};

export default OrderDetail;
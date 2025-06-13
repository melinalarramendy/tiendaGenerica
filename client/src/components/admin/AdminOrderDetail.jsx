import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
    Container,
    Card, 
    Table, 
    Spinner, 
    Alert, 
    Button,
    Badge,
    ListGroup,
    Row,
    Col
} from 'react-bootstrap';
import axios from 'axios';
import Swal from 'sweetalert2';
import { 
    FaPrint, 
    FaArrowLeft, 
    FaBox, 
    FaMoneyBillWave, 
    FaTruck, 
    FaMapMarkerAlt,
    FaFilePdf,
    FaShoppingBag
} from 'react-icons/fa';
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
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
    }
});

const AdminOrderDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const printRef = useRef();

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get(`/api/admin/orders/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setOrder(res.data.order);
            } catch (err) {
                setError('Error al cargar la orden');
                Toast.fire({
                    icon: 'error',
                    title: 'Error al cargar la orden',
                    text: err.response?.data?.message || 'Intente nuevamente'
                });
            } finally {
                setLoading(false);
            }
        };
        fetchOrder();
    }, [id]);

    const handlePrint = useReactToPrint({
        content: () => printRef.current,
        pageStyle: `
            @page { size: auto; margin: 10mm; }
            @media print {
                body { padding: 20px; }
                .no-print { display: none !important; }
                .print-only { display: block !important; }
            }
        `,
        documentTitle: `Orden_${id}`,
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

        const input = printRef.current;
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

            pdf.save(`Orden_${id}.pdf`);
            
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

    const calculateSubtotal = () => {
        if (!order?.items) return 0;
        return order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
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

    if (!order) return null;

    return (
        <Container className="my-5">
            <Button 
                variant="outline-secondary" 
                onClick={() => navigate('/admin/users/{order.user_id}')}
                className="mb-3 no-print"
            >
                <FaArrowLeft className="me-2" />
                Volver a órdenes
            </Button>

            <div className="d-flex justify-content-between align-items-center mb-4 no-print">
                <h3 className="mb-0">
                    <FaShoppingBag className="me-2" />
                    Detalle de Orden #{order._id}
                </h3>
                <div>
                    <Button variant="outline-primary" className="me-2" onClick={handlePrint}>
                        <FaPrint className="me-2" />
                        Imprimir
                    </Button>
                    <Button variant="danger" onClick={handleExportPDF}>
                        <FaFilePdf className="me-2" />
                        Exportar PDF
                    </Button>
                </div>
            </div>

            <div ref={printRef}>
                <Card className="shadow-sm mb-4">
                    <Card.Header className="bg-primary text-white">
                        <h5 className="mb-0">Información de la Orden</h5>
                    </Card.Header>
                    <Card.Body>
                        <Row>
                            <Col md={6}>
                                <ListGroup variant="flush">
                                    <ListGroup.Item className="d-flex justify-content-between">
                                        <span className="fw-bold">Número de orden:</span>
                                        <span>{order._id}</span>
                                    </ListGroup.Item>
                                    <ListGroup.Item className="d-flex justify-content-between">
                                        <span className="fw-bold">Fecha:</span>
                                        <span>{formatDate(order.created_at)}</span>
                                    </ListGroup.Item>
                                    <ListGroup.Item className="d-flex justify-content-between">
                                        <span className="fw-bold">Estado:</span>
                                        <span>{getStatusBadge(order.status)}</span>
                                    </ListGroup.Item>
                                    <ListGroup.Item className="d-flex justify-content-between">
                                        <span className="fw-bold">Método de pago:</span>
                                        <span>{order.payment_method || '-'}</span>
                                    </ListGroup.Item>
                                </ListGroup>
                            </Col>
                            <Col md={6}>
                                <ListGroup variant="flush">
                                    <ListGroup.Item className="d-flex justify-content-between">
                                        <span className="fw-bold">Subtotal:</span>
                                        <span>${order.subtotal?.toFixed(2) || calculateSubtotal().toFixed(2)}</span>
                                    </ListGroup.Item>
                                    <ListGroup.Item className="d-flex justify-content-between">
                                        <span className="fw-bold">Envío:</span>
                                        <span>${order.shipping_cost?.toFixed(2) || '0.00'}</span>
                                    </ListGroup.Item>
                                    {order.discount > 0 && (
                                        <ListGroup.Item className="d-flex justify-content-between">
                                            <span className="fw-bold">Descuento:</span>
                                            <span>-${order.discount?.toFixed(2)}</span>
                                        </ListGroup.Item>
                                    )}
                                    <ListGroup.Item className="d-flex justify-content-between fw-bold fs-5">
                                        <span>Total:</span>
                                        <span>${order.total?.toFixed(2)}</span>
                                    </ListGroup.Item>
                                </ListGroup>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>

                <Row className="mb-4">
                    <Col md={6}>
                        <Card className="shadow-sm h-100">
                            <Card.Header className="bg-primary text-white">
                                <h5 className="mb-0"><FaMapMarkerAlt className="me-2" />Dirección de envío</h5>
                            </Card.Header>
                            <Card.Body>
                                {order.shipping_address ? (
                                    <>
                                        <p><strong>Nombre:</strong> {order.shipping_address.name}</p>
                                        <p><strong>Dirección:</strong> {order.shipping_address.address}</p>
                                        <p><strong>Ciudad:</strong> {order.shipping_address.city}, {order.shipping_address.state}</p>
                                        <p><strong>Código postal:</strong> {order.shipping_address.postal_code}</p>
                                        <p><strong>Teléfono:</strong> {order.shipping_address.phone}</p>
                                        {order.shipping_address.notes && (
                                            <p className="text-muted"><strong>Notas:</strong> {order.shipping_address.notes}</p>
                                        )}
                                    </>
                                ) : (
                                    <p className="text-muted">No hay dirección de envío registrada</p>
                                )}
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={6}>
                        <Card className="shadow-sm h-100">
                            <Card.Header className="bg-primary text-white">
                                <h5 className="mb-0"><FaTruck className="me-2" />Información de envío</h5>
                            </Card.Header>
                            <Card.Body>
                                <p><strong>Método de envío:</strong> {order.shipping_method || 'Estándar'}</p>
                                <p><strong>Costo de envío:</strong> ${order.shipping_cost?.toFixed(2) || '0.00'}</p>
                                {order.tracking_number && (
                                    <p><strong>Número de seguimiento:</strong> {order.tracking_number}</p>
                                )}
                                {order.shipped_at && (
                                    <p><strong>Fecha de envío:</strong> {formatDate(order.shipped_at)}</p>
                                )}
                                {order.delivered_at && (
                                    <p><strong>Fecha de entrega:</strong> {formatDate(order.delivered_at)}</p>
                                )}
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                <Card className="shadow-sm">
                    <Card.Header className="bg-primary text-white">
                        <h5 className="mb-0"><FaBox className="me-2" />Productos</h5>
                    </Card.Header>
                    <Card.Body>
                        <div className="table-responsive">
                            <Table striped bordered hover>
                                <thead className="table-dark">
                                    <tr>
                                        <th>Producto</th>
                                        <th>Precio unitario</th>
                                        <th>Cantidad</th>
                                        <th>Subtotal</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {order.items?.map((item, index) => (
                                        <tr key={index}>
                                            <td>
                                                <div className="d-flex align-items-center">
                                                    {item.image && (
                                                        <img 
                                                            src={item.image} 
                                                            alt={item.name}
                                                            style={{ width: '50px', height: '50px', objectFit: 'cover', marginRight: '10px' }}
                                                        />
                                                    )}
                                                    <div>
                                                        <div className="fw-bold">{item.name}</div>
                                                        {item.sku && <small className="text-muted">SKU: {item.sku}</small>}
                                                    </div>
                                                </div>
                                            </td>
                                            <td>${item.price?.toFixed(2)}</td>
                                            <td>{item.quantity}</td>
                                            <td>${(item.price * item.quantity).toFixed(2)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <td colSpan="3" className="text-end fw-bold">Subtotal:</td>
                                        <td className="fw-bold">${order.subtotal?.toFixed(2) || calculateSubtotal().toFixed(2)}</td>
                                    </tr>
                                    <tr>
                                        <td colSpan="3" className="text-end fw-bold">Envío:</td>
                                        <td className="fw-bold">${order.shipping_cost?.toFixed(2) || '0.00'}</td>
                                    </tr>
                                    {order.discount > 0 && (
                                        <tr>
                                            <td colSpan="3" className="text-end fw-bold">Descuento:</td>
                                            <td className="fw-bold">-${order.discount?.toFixed(2)}</td>
                                        </tr>
                                    )}
                                    <tr>
                                        <td colSpan="3" className="text-end fw-bold fs-5">Total:</td>
                                        <td className="fw-bold fs-5">${order.total?.toFixed(2)}</td>
                                    </tr>
                                </tfoot>
                            </Table>
                        </div>
                    </Card.Body>
                </Card>

                <div className="print-only text-center mt-4" style={{ display: 'none' }}>
                    <p>Gracias por su compra!</p>
                    <p>Orden #{order._id} - Fecha: {formatDate(order.created_at)}</p>
                </div>
            </div>
        </Container>
    );
};

export default AdminOrderDetail;
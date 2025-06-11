import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner, Badge } from 'react-bootstrap';
import { FaShoppingCart, FaMapMarkerAlt, FaCreditCard, FaCheck } from 'react-icons/fa';
import visa from "../assets/payments/visa.png";
import mastercard from "../assets/payments/mastercard.png";
import amex from "../assets/payments/amex.png";
import paypal from "../assets/payments/paypal.png";
import securepayment from "../assets/payments/securepayment.png";
import sslsecure from "../assets/payments/seguridadssl.png";
import axios from 'axios';
import Swal from 'sweetalert2';
import Footer from './Footer';
import NavbarTienda from './NavbarTienda';

const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 1800,
    timerProgressBar: true
});

const Checkout = () => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [orderId, setOrderId] = useState(null);
    const [shippingMethod, setShippingMethod] = useState('standard');
    const [paymentMethod, setPaymentMethod] = useState('credit_card');
    const [shippingAddress, setShippingAddress] = useState({
        street: '',
        city: '',
        state: '',
        zip: '',
        country: 'Argentina'
    });
    const [coupon, setCoupon] = useState('');
    const [couponApplied, setCouponApplied] = useState(false);
    const [discount, setDiscount] = useState(0);
    const [error, setError] = useState('');

    const navigate = useNavigate();

    const fetchCart = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        try {
            const res = await axios.get('/api/cart/', {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            setCartItems(res.data);
        } catch (err) {
            console.error("Error al obtener el carrito:", err);
            if (err.response && err.response.status === 401) {
                localStorage.removeItem('token');
                Toast.fire({
                    icon: 'error',
                    title: 'Sesión expirada',
                    text: 'Por favor inicia sesión nuevamente',
                });
                navigate('/login');
            }
        }
    };

    useEffect(() => {
        fetchCart();
    }, []);

    const subtotal = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    const shippingCost = shippingMethod === 'express' ? 1500 : 800;
    const total = subtotal + shippingCost - discount;
    const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    const handleApplyCoupon = () => {
        if (!coupon) return;

        setLoading(true);
        setTimeout(() => {
            if (coupon.toUpperCase() === 'DESCUENTO10') {
                setDiscount(subtotal * 0.1);
                setCouponApplied(true);
                setError('');
            } else {
                setError('Cupón no válido o expirado');
            }
            setLoading(false);
        }, 1000);
    };

    const handleSubmitOrder = async () => {
        setLoading(true);
        setError('');

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            const orderData = {
                items: cartItems.map(item => ({
                    product_id: item.product._id,
                    quantity: item.quantity,
                    price: item.product.price,
                    name: item.product.title
                })),
                shipping_address: shippingAddress,
                payment_method: paymentMethod,
                shipping_method: shippingMethod,
                subtotal: subtotal,
                shipping_cost: shippingCost,
                discount: discount,
                total: total
            };

            const response = await axios.post('/api/orders/checkout', orderData, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.data.success) {
                setOrderId(response.data.order_id);
                window.dispatchEvent(new CustomEvent('cartUpdated'));
            } else {
                throw new Error(response.data.message || 'Error al procesar la orden');
            }

        } catch (err) {
            setError(err.response?.data?.error || err.message || 'Error al procesar la orden');
            console.error('Error en checkout:', err);
        } finally {
            setLoading(false);
        }
    };

    if (cartCount === 0 && !orderId) {
        return (
            <Container className="my-5 text-center">
                <Card className="p-5">
                    <h2>Tu carrito está vacío</h2>
                    <p>No hay productos para procesar el pago</p>
                    <Button variant="primary" onClick={() => navigate('/')}>
                        Volver a la tienda
                    </Button>
                </Card>
            </Container>
        );
    }

    if (orderId) {
        return (
            <Container className="my-5">
                <Row className="justify-content-center">
                    <Col md={8}>
                        <Card className="p-4 text-center border-success">
                            <div className="checkout-success-icon mb-4">
                                <FaCheck />
                            </div>
                            <h2 className="text-success">¡Compra realizada con éxito!</h2>
                            <p className="lead">Tu pedido ha sido confirmado</p>
                            <p>Número de orden: <strong>{orderId}</strong></p>
                            <p>Recibirás un correo electrónico con los detalles de tu compra.</p>

                            <div className="d-flex justify-content-center gap-3 mt-4">
                                <Button variant="outline-primary" onClick={() => navigate('/')}>
                                    Seguir comprando
                                </Button>
                                <Button variant="primary" onClick={() => navigate(`/orders/${orderId}`)}>
                                    Ver detalle de mi pedido
                                </Button>
                            </div>
                        </Card>
                    </Col>
                </Row>
            </Container>
        );
    }

    return (
        <>
            <NavbarTienda />
            <Container className="my-5 checkout-container">
                <Row>
                    <Col lg={8}>
                        <Card className="mb-4">
                            <Card.Header className="bg-light">
                                <h5 className="mb-0">Resumen del carrito</h5>
                            </Card.Header>
                            <Card.Body>
                                <div className="checkout-products-list">
                                    {cartItems.map((item, index) => (
                                        <div key={index} className="checkout-product-item d-flex mb-3 pb-3 border-bottom">
                                            <div className="checkout-product-image me-3">
                                                <img src={item.product.main_image || '/placeholder-product.jpg'} alt={item.product.title} />
                                            </div>
                                            <div className="flex-grow-1">
                                                <h6 className="mb-1">{item.product.title}</h6>
                                                <div className="d-flex justify-content-between">
                                                    <small className="text-muted">Cantidad: {item.quantity}</small>
                                                    <strong>${(item.product.price * item.quantity).toLocaleString('es-AR')}</strong>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <Form.Group className="mb-3">
                                    <Form.Label className="fw-bold">Cupón de descuento</Form.Label>
                                    <div className="d-flex">
                                        <Form.Control
                                            type="text"
                                            placeholder="Ingresa tu cupón"
                                            value={coupon}
                                            onChange={(e) => setCoupon(e.target.value)}
                                            disabled={couponApplied}
                                        />
                                        <Button
                                            variant={couponApplied ? 'success' : 'outline-secondary'}
                                            className="ms-2"
                                            onClick={handleApplyCoupon}
                                            disabled={couponApplied || !coupon || loading}
                                        >
                                            {couponApplied ? 'Aplicado' : 'Aplicar'}
                                        </Button>
                                    </div>
                                    {error && <Form.Text className="text-danger">{error}</Form.Text>}
                                    {couponApplied && (
                                        <Form.Text className="text-success">
                                            Cupón aplicado: -${discount.toLocaleString('es-AR')}
                                        </Form.Text>
                                    )}
                                </Form.Group>
                            </Card.Body>
                        </Card>

                        <Card className="mb-4">
                            <Card.Header className="bg-light">
                                <h5 className="mb-0">Dirección de envío</h5>
                            </Card.Header>
                            <Card.Body>
                                <Form>
                                    <Row>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Calle y número</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    value={shippingAddress.street}
                                                    onChange={(e) => setShippingAddress({ ...shippingAddress, street: e.target.value })}
                                                    required
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Ciudad</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    value={shippingAddress.city}
                                                    onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                                                    required
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>

                                    <Row>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Provincia</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    value={shippingAddress.state}
                                                    onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
                                                    required
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Código Postal</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    value={shippingAddress.zip}
                                                    onChange={(e) => setShippingAddress({ ...shippingAddress, zip: e.target.value })}
                                                    required
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>

                                    <Form.Group className="mb-3">
                                        <Form.Label>País</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={shippingAddress.country}
                                            onChange={(e) => setShippingAddress({ ...shippingAddress, country: e.target.value })}
                                            required
                                        />
                                    </Form.Group>
                                </Form>
                            </Card.Body>
                        </Card>

                        <Card className="mb-4">
                            <Card.Header className="bg-light">
                                <h5 className="mb-0">Método de pago</h5>
                            </Card.Header>
                            <Card.Body>
                                <Form>
                                    <Form.Group className="mb-4">
                                        <Form.Label className="fw-bold">Selecciona método de pago</Form.Label>
                                        <div className="payment-methods">
                                            <Form.Check
                                                type="radio"
                                                id="credit-card"
                                                name="paymentMethod"
                                                label="Tarjeta de crédito/débito"
                                                value="credit_card"
                                                checked={paymentMethod === 'credit_card'}
                                                onChange={(e) => setPaymentMethod(e.target.value)}
                                                className="py-2 border-bottom"
                                            />

                                            <Form.Check
                                                type="radio"
                                                id="paypal"
                                                name="paymentMethod"
                                                label="PayPal"
                                                value="paypal"
                                                checked={paymentMethod === 'paypal'}
                                                onChange={(e) => setPaymentMethod(e.target.value)}
                                                className="py-2 border-bottom"
                                            />

                                            <Form.Check
                                                type="radio"
                                                id="bank-transfer"
                                                name="paymentMethod"
                                                label="Transferencia bancaria"
                                                value="bank_transfer"
                                                checked={paymentMethod === 'bank_transfer'}
                                                onChange={(e) => setPaymentMethod(e.target.value)}
                                                className="py-2"
                                            />
                                        </div>
                                    </Form.Group>

                                    {/* Formulario para Tarjeta de Crédito/Débito */}
                                    {paymentMethod === 'credit_card' && (
                                        <div className="credit-card-form mt-3 p-3 border rounded">
                                            <Row>
                                                <Col md={12}>
                                                    <Form.Group className="mb-3">
                                                        <Form.Label>Número de tarjeta</Form.Label>
                                                        <Form.Control
                                                            type="text"
                                                            placeholder="1234 5678 9012 3456"
                                                            required
                                                        />
                                                    </Form.Group>
                                                </Col>
                                            </Row>

                                            <Row>
                                                <Col md={8}>
                                                    <Form.Group className="mb-3">
                                                        <Form.Label>Nombre del titular</Form.Label>
                                                        <Form.Control
                                                            type="text"
                                                            placeholder="Como aparece en la tarjeta"
                                                            required
                                                        />
                                                    </Form.Group>
                                                </Col>
                                                <Col md={2}>
                                                    <Form.Group className="mb-3">
                                                        <Form.Label>Expira</Form.Label>
                                                        <Form.Control
                                                            type="text"
                                                            placeholder="MM/AA"
                                                            required
                                                        />
                                                    </Form.Group>
                                                </Col>
                                                <Col md={2}>
                                                    <Form.Group className="mb-3">
                                                        <Form.Label>CVV</Form.Label>
                                                        <Form.Control
                                                            type="text"
                                                            placeholder="123"
                                                            required
                                                        />
                                                    </Form.Group>
                                                </Col>
                                            </Row>

                                            <div className="d-flex gap-2 accepted-cards">
                                                <img src={visa} alt="Visa" width="40" />
                                                <img src={mastercard} alt="Mastercard" width="40" />
                                                <img src={amex} alt="American Express" width="40" />
                                            </div>
                                        </div>
                                    )}

                                    {/* Formulario para PayPal */}
                                    {paymentMethod === 'paypal' && (
                                        <div className="paypal-form mt-3 p-3 border rounded">
                                            <div className="text-center mb-3">
                                                <img src={paypal} alt="PayPal" width="120" className="mb-2" />
                                                <p className="text-muted">Serás redirigido a PayPal para completar tu pago de manera segura</p>
                                            </div>

                                            <Form.Group className="mb-3">
                                                <Form.Label>Correo electrónico de PayPal</Form.Label>
                                                <Form.Control
                                                    type="email"
                                                    placeholder="tucuenta@paypal.com"
                                                    required
                                                />
                                            </Form.Group>

                                            <div className="alert alert-info">
                                                <small>
                                                    <i className="bi bi-info-circle me-2"></i>
                                                    Al hacer clic en "Finalizar compra", serás redirigido al sitio seguro de PayPal para completar tu pago.
                                                </small>
                                            </div>
                                        </div>
                                    )}

                                    {/* Formulario para Transferencia Bancaria */}
                                    {paymentMethod === 'bank_transfer' && (
                                        <div className="bank-transfer-form mt-3 p-3 border rounded">
                                            <h6 className="mb-3">Datos para transferencia bancaria</h6>

                                            <div className="mb-4">
                                                <div className="d-flex justify-content-between mb-2">
                                                    <span>Banco:</span>
                                                    <strong>Tu Banco S.A.</strong>
                                                </div>
                                                <div className="d-flex justify-content-between mb-2">
                                                    <span>Tipo de cuenta:</span>
                                                    <strong>Cuenta Corriente</strong>
                                                </div>
                                                <div className="d-flex justify-content-between mb-2">
                                                    <span>Número de cuenta:</span>
                                                    <strong>123-456789-012</strong>
                                                </div>
                                                <div className="d-flex justify-content-between mb-2">
                                                    <span>CBU:</span>
                                                    <strong>0123456789012345678901</strong>
                                                </div>
                                                <div className="d-flex justify-content-between">
                                                    <span>Titular:</span>
                                                    <strong>TU EMPRESA S.R.L.</strong>
                                                </div>
                                            </div>

                                            <Form.Group className="mb-3">
                                                <Form.Label>Número de comprobante de transferencia</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Ingresa el número de operación"
                                                    required
                                                />
                                                <Form.Text className="text-muted">
                                                    Por favor ingresa el número de transacción que recibiste al realizar la transferencia.
                                                </Form.Text>
                                            </Form.Group>

                                            <Form.Group className="mb-3">
                                                <Form.Label>Adjuntar comprobante (opcional)</Form.Label>
                                                <Form.Control
                                                    type="file"
                                                    accept="image/*,.pdf"
                                                />
                                                <Form.Text className="text-muted">
                                                    Puedes subir una imagen o PDF del comprobante de transferencia.
                                                </Form.Text>
                                            </Form.Group>

                                            <div className="alert alert-warning">
                                                <small>
                                                    <i className="bi bi-exclamation-triangle me-2"></i>
                                                    Tu pedido será procesado una vez confirmemos el pago. Esto puede tardar hasta 24 horas hábiles.
                                                </small>
                                            </div>
                                        </div>
                                    )}
                                </Form>
                            </Card.Body>
                        </Card>

                        <Button
                            variant="primary"
                            onClick={handleSubmitOrder}
                            disabled={loading || !shippingAddress.street}
                            className="w-100 py-3 mb-5"
                        >
                            {loading ? (
                                <>
                                    <Spinner as="span" animation="border" size="sm" /> Procesando...
                                </>
                            ) : (
                                'Finalizar compra'
                            )}
                        </Button>
                    </Col>

                    <Col lg={4}>
                        <Card className="sticky-top checkout-summary">
                            <Card.Header className="bg-light">
                                <h5 className="mb-0">Resumen de tu compra</h5>
                            </Card.Header>
                            <Card.Body>
                                <div className="mb-3">
                                    <div className="d-flex justify-content-between mb-2">
                                        <span>Subtotal ({cartCount} {cartCount === 1 ? 'producto' : 'productos'})</span>
                                        <span>${subtotal.toLocaleString('es-AR')}</span>
                                    </div>
                                    <div className="d-flex justify-content-between mb-2">
                                        <span>Envío</span>
                                        <span>${shippingCost.toLocaleString('es-AR')}</span>
                                    </div>
                                    {discount > 0 && (
                                        <div className="d-flex justify-content-between mb-2 text-success">
                                            <span>Descuento</span>
                                            <span>-${discount.toLocaleString('es-AR')}</span>
                                        </div>
                                    )}
                                    <hr />
                                    <div className="d-flex justify-content-between fw-bold fs-5">
                                        <span>Total</span>
                                        <span>${total.toLocaleString('es-AR')}</span>
                                    </div>
                                </div>

                                <div className="promo-code mb-3">
                                    <Form.Text className="text-muted">
                                        ¿Tienes un cupón de descuento? Aplícalo arriba.
                                    </Form.Text>
                                </div>

                                <div className="secure-payment">
                                    <small className="text-muted d-block mb-1">
                                        <i className="bi bi-lock-fill me-1"></i>
                                        Compra protegida
                                    </small>
                                    <div className="d-flex gap-2">
                                        <img src={sslsecure} alt="SSL Secure" height="25" />
                                        <img src={securepayment} alt="Secure Payment" height="25" />
                                    </div>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                {error && (
                    <Alert variant="danger" className="mt-3" dismissible onClose={() => setError('')}>
                        {error}
                    </Alert>
                )}
            </Container>
            <Footer />
        </>

    );
};

export default Checkout;
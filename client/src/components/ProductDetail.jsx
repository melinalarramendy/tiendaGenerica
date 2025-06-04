import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import NavbarTienda from './NavbarTienda';
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
    Breadcrumb
} from 'react-bootstrap';
import axios from 'axios';
import { FaShoppingCart, FaHeart, FaStar, FaRegStar } from 'react-icons/fa';

const ProductDetail = () => {
    const { productId } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [mainImage, setMainImage] = useState('');

    const isAuthenticated = localStorage.getItem('token') !== null;

    useEffect(() => {
        axios.get(`/api/products/${productId}`)
            .then((res) => {
                setProduct(res.data);
                setMainImage(res.data.main_image);
                setLoading(false);
            })
            .catch(() => {
                setError("Producto no encontrado.");
                setLoading(false);
            });
    }, [productId]);

    const handleAddToCart = () => {
        console.log('Producto agregado al carrito:', product);
    };

    const handleBuyNow = () => {
        if (isAuthenticated) {
            navigate('/checkout');
        } else {
            navigate('/login', { state: { from: `/product/${productId}` } });
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
                    <Button variant="primary" onClick={() => navigate('/')}>Volver a la tienda</Button>
                </div>
            </Alert>
        </Container>
    );

    const renderRatingStars = (rating) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                i <= rating ?
                    <FaStar key={i} className="text-warning" /> :
                    <FaRegStar key={i} className="text-secondary" />
            );
        }
        return stars;
    };

    return (

        <>
            <NavbarTienda />
            <Container className="my-5">
                <Breadcrumb className="mb-4">
                    <Breadcrumb.Item href="/">Inicio</Breadcrumb.Item>
                    <Breadcrumb.Item href={`/category/${product.category}`}>
                        {product.category}
                    </Breadcrumb.Item>
                    <Breadcrumb.Item active>{product.title}</Breadcrumb.Item>
                </Breadcrumb>

                <Row className="g-4">
                    {/* Galería de imágenes */}
                    <Col lg={6}>
                        <div className="mb-3 border rounded p-2">
                            <Image
                                src={mainImage}
                                fluid
                                className="main-product-image w-100"
                                style={{ maxHeight: '500px', objectFit: 'contain' }}
                            />
                        </div>
                        <div className="d-flex flex-wrap gap-2">
                            {product.images?.map((img, index) => (
                                <Image
                                    key={index}
                                    src={img}
                                    thumbnail
                                    className="thumbnail-image"
                                    style={{ width: '80px', height: '80px', cursor: 'pointer' }}
                                    onClick={() => setMainImage(img)}
                                />
                            ))}
                        </div>
                    </Col>

                    {/* Detalles del producto */}
                    <Col lg={6}>
                        <Card className="h-100 border-0 shadow-sm">
                            <Card.Body>
                                <div className="d-flex justify-content-between align-items-start mb-3">
                                    <div>
                                        <h2 className="mb-1">{product.title}</h2>
                                        <p className="text-muted mb-2">{product.brand}</p>
                                    </div>
                                    <Button variant="outline-danger" size="sm">
                                        <FaHeart />
                                    </Button>
                                </div>

                                <div className="mb-3">
                                    <div className="d-flex align-items-center mb-2">
                                        {renderRatingStars(product.rating || 4)}
                                        <span className="ms-2 text-muted">({product.reviews || 0} reseñas)</span>
                                    </div>
                                    {product.stock > 0 ? (
                                        <Badge bg="success" className="mb-3">En stock</Badge>
                                    ) : (
                                        <Badge bg="danger" className="mb-3">Agotado</Badge>
                                    )}
                                </div>

                                <div className="mb-4">
                                    <h3 className="text-primary mb-0">
                                        ${product.price.toLocaleString()}
                                    </h3>
                                    {product.oldPrice && (
                                        <small className="text-muted text-decoration-line-through ms-2">
                                            ${product.oldPrice.toLocaleString()}
                                        </small>
                                    )}
                                </div>

                                <p className="mb-4">{product.description}</p>

                                <ListGroup variant="flush" className="mb-4">
                                    <ListGroup.Item>
                                        <strong>Categoría:</strong> {product.category}
                                    </ListGroup.Item>
                                    <ListGroup.Item>
                                        <strong>SKU:</strong> {product.sku || 'N/A'}
                                    </ListGroup.Item>
                                    <ListGroup.Item>
                                        <strong>Disponibilidad:</strong> {product.stock} unidades
                                    </ListGroup.Item>
                                </ListGroup>

                                <div className="d-flex gap-3">
                                    <Button
                                        variant="primary"
                                        size="lg"
                                        className="flex-grow-1"
                                        onClick={handleBuyNow}
                                    >
                                        Comprar ahora
                                    </Button>
                                    <Button
                                        variant="outline-primary"
                                        size="lg"
                                        className="flex-grow-1"
                                        onClick={handleAddToCart}
                                    >
                                        <FaShoppingCart className="me-2" />
                                        Añadir al carrito
                                    </Button>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                <Row className="mt-5">
                    <Col>
                        <Card>
                            <Card.Header as="h5">Características del producto</Card.Header>
                            <Card.Body>
                                <ul>
                                    {product.features?.map((feature, index) => (
                                        <li key={index}>{feature}</li>
                                    )) || <li>No hay características adicionales disponibles</li>}
                                </ul>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </>

    );
};

export default ProductDetail;
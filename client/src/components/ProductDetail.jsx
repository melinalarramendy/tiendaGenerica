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
    Form,
    InputGroup,
    ToggleButton,
    Breadcrumb,
    ListGroup,
    ToggleButtonGroup
} from 'react-bootstrap';
import axios from 'axios';
import { FaShoppingCart, FaHeart, FaStar, FaRegStar, FaRegHeart, FaShareAlt } from 'react-icons/fa';


const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 1800,
    timerProgressBar: true
});


const ProductDetail = () => {
    const { productId } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [mainImage, setMainImage] = useState('');
    const [addedToCart, setAddedToCart] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [isInWishlist, setIsInWishlist] = useState(false);
    const [wishlistLoading, setWishlistLoading] = useState(false);

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

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token && product) {
            axios.get(`/api/wishlist/check/${product._id}`, {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then(res => setIsInWishlist(res.data.isInWishlist))
                .catch(err => console.error('Error checking wishlist:', err));
        }
    }, [product]);

    const handleAddToCart = () => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login', { state: { from: `/product/${productId}` } });
            return;
        }

        axios.post('/api/cart/add', {
            product_id: product._id,
            quantity: quantity
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(() => {
                setAddedToCart(true);
                Toast.fire({
                    icon: 'success',
                    title: 'Producto agregado al carrito'
                });

                window.dispatchEvent(new CustomEvent('cartUpdated'));

                setTimeout(() => setAddedToCart(false), 3000);
            })
            .catch((err) => {
                console.error('Error al agregar al carrito:', err);
                Toast.fire({
                    icon: 'error',
                    title: 'Hubo un problema al agregar al carrito',
                });
            });
    };

    const handleWishlistToggle = async () => {
        const token = localStorage.getItem('token');

        if (!token) {
            navigate('/login', { state: { from: `/product/${productId}` } });
            return;
        }

        setWishlistLoading(true);

        try {
            if (isInWishlist) {
                await axios.delete(`/api/wishlist/remove/${product._id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                Toast.fire({
                    icon: 'success',
                    title: 'Eliminado de tu lista de deseos'
                });
            } else {
                await axios.post('/api/wishlist/add',
                    { product_id: product._id },
                    {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                Toast.fire({
                    icon: 'success',
                    title: 'Agregado a tu lista de deseos'
                });
            }
            setIsInWishlist(!isInWishlist);
            window.dispatchEvent(new CustomEvent('wishlistUpdated'));
        } catch (err) {
            console.error('Error al actualizar wishlist:', err);
            Toast.fire({
                icon: 'error',
                title: 'Error al actualizar lista de deseos'
            });
        } finally {
            setWishlistLoading(false);
        }

    };

    const handleBuyNow = () => {
        if (isAuthenticated) {
            navigate('/checkout');
        } else {
            navigate('/login', { state: { from: `/product/${productId}` } });
        }
    };

    const increaseQuantity = () => setQuantity(prev => prev + 1);
    const decreaseQuantity = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

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
            <Container className="my-5 product-detail-container">
                <Breadcrumb className="mb-4">
                    <Breadcrumb.Item href="/">Inicio</Breadcrumb.Item>
                    <Breadcrumb.Item href={`/category/${product.category.toLowerCase().replace(/\s+/g, '-')}`}>
                        {product.category}
                    </Breadcrumb.Item>
                    <Breadcrumb.Item active>{product.title}</Breadcrumb.Item>
                </Breadcrumb>
                <Row>
                    <Col md={6} className="position-relative">
                        <div className="product-gallery-container mb-4">
                            <div className="main-image-container text-center p-3 mb-3 bg-light rounded">
                                <Image
                                    src={mainImage}
                                    fluid
                                    className="main-product-image"
                                    style={{ maxHeight: '400px', objectFit: 'contain' }}
                                />
                            </div>
                            <div className="thumbnail-container d-flex flex-wrap gap-2">
                                {product.images?.map((img, index) => (
                                    <div
                                        key={index}
                                        className={`thumbnail-item ${mainImage === img ? 'active' : ''}`}
                                        onClick={() => setMainImage(img)}
                                    >
                                        <Image
                                            src={img}
                                            thumbnail
                                            className="thumbnail-image"
                                            style={{ width: '80px', height: '80px', cursor: 'pointer' }}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Col>

                    <Col md={6} className="mt-4 mt-md-0">
                        <Card className="border-0 shadow-sm product-detail-card">
                            <Card.Body>
                                <div className="d-flex justify-content-between align-items-start mb-3">
                                    <div>
                                        <h1 className="product-title mb-2">{product.title}</h1>
                                        <p className="product-brand text-muted mb-2">{product.brand}</p>
                                    </div>
                                    <Button
                                        variant={isInWishlist ? "danger" : "outline-danger"}
                                        size="sm"
                                        className="favorite-btn"
                                        onClick={handleWishlistToggle}
                                        disabled={wishlistLoading}
                                    >
                                        {isInWishlist ? <FaHeart /> : <FaRegHeart />}
                                    </Button>
                                </div>

                                <div className="rating-container mb-3">
                                    <div className="d-flex align-items-center mb-2">
                                        {renderRatingStars(product.rating || 4)}
                                        <span className="ms-2 text-muted">
                                            ({product.reviews || 0} reseñas) •
                                            {product.stock > 0 ? (
                                                <Badge bg="success" className="ms-2">En stock</Badge>
                                            ) : (
                                                <Badge bg="danger" className="ms-2">Agotado</Badge>
                                            )}
                                        </span>
                                    </div>
                                </div>

                                <div className="price-container mb-4">
                                    <h3 className="current-price mb-0">
                                        ${product.price.toLocaleString()}
                                    </h3>
                                    {product.oldPrice && (
                                        <small className="old-price text-muted text-decoration-line-through ms-2">
                                            ${product.oldPrice.toLocaleString()}
                                        </small>
                                    )}
                                </div>

                                <p className="product-description mb-4">{product.description}</p>

                                {/* Selectores de variantes */}
                                <Form className="mb-4">
                                    {product.colors?.length > 0 && (
                                        <div className="mb-3">
                                            <h5 className="variant-title mb-2">
                                                Color: <span className="text-muted">{selectedColor}</span>
                                            </h5>
                                            <ToggleButtonGroup
                                                type="radio"
                                                name="colors"
                                                value={selectedColor}
                                                onChange={setSelectedColor}
                                                className="color-selector"
                                            >
                                                {product.colors.map((color, index) => (
                                                    <ToggleButton
                                                        key={index}
                                                        id={`color-${index}`}
                                                        value={color}
                                                        variant="outline-secondary"
                                                        className="color-option rounded-pill me-2"
                                                    >
                                                        {color}
                                                    </ToggleButton>
                                                ))}
                                            </ToggleButtonGroup>
                                        </div>
                                    )}

                                    {product.sizes?.length > 0 && (
                                        <div className="mb-3">
                                            <h5 className="variant-title mb-2">Tamaño</h5>
                                            <ToggleButtonGroup
                                                type="radio"
                                                name="sizes"
                                                value={selectedSize}
                                                onChange={setSelectedSize}
                                                className="size-selector"
                                            >
                                                {product.sizes.map((size, index) => (
                                                    <ToggleButton
                                                        key={index}
                                                        id={`size-${index}`}
                                                        value={size}
                                                        variant="outline-secondary"
                                                        className="size-option"
                                                    >
                                                        {size}
                                                    </ToggleButton>
                                                ))}
                                            </ToggleButtonGroup>
                                        </div>
                                    )}

                                    <div className="mb-4">
                                        <h5 className="variant-title mb-2">Cantidad</h5>
                                        <InputGroup className="quantity-selector" style={{ width: '150px' }}>
                                            <Button
                                                variant="outline-secondary"
                                                onClick={decreaseQuantity}
                                                className="quantity-btn"
                                            >
                                                -
                                            </Button>
                                            <Form.Control
                                                type="number"
                                                value={quantity}
                                                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                                                min="1"
                                                className="text-center quantity-input"
                                            />
                                            <Button
                                                variant="outline-secondary"
                                                onClick={increaseQuantity}
                                                className="quantity-btn"
                                            >
                                                +
                                            </Button>
                                        </InputGroup>
                                    </div>
                                </Form>

                                <div className="action-buttons mb-4">
                                    <Button
                                        size="lg"
                                        className="buy-now-btn me-2"
                                        onClick={handleBuyNow}
                                    >
                                        Comprar ahora
                                    </Button>
                                    <Button
                                        variant={addedToCart ? "success" : "outline-primary"}
                                        size="lg"
                                        className="add-to-cart-btn"
                                        onClick={handleAddToCart}
                                        disabled={addedToCart}
                                    >
                                        <FaShoppingCart className="me-2" />
                                        {addedToCart ? "Agregado" : "Añadir al carrito"}
                                    </Button>
                                </div>

                                <Button variant="link" className="share-btn text-decoration-none">
                                    <FaShareAlt className="me-2" /> Compartir
                                </Button>

                                <div className="product-meta mt-4">
                                    <ul className="list-unstyled">
                                        <li><strong>Categoría:</strong> {product.category}</li>
                                        <li><strong>SKU:</strong> {product.sku || 'N/A'}</li>
                                        <li><strong>Disponibilidad:</strong> {product.stock} unidades</li>
                                    </ul>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                {product.features?.length > 0 && (
                    <Row className="mt-5">
                        <Col>
                            <Card className="features-card">
                                <Card.Header as="h5" className="features-header">Características</Card.Header>
                                <Card.Body>
                                    <ul className="features-list">
                                        {product.features.map((feature, index) => (
                                            <li key={index}>{feature}</li>
                                        ))}
                                    </ul>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                )}
            </Container>
            <Footer />
        </>

    );
};

export default ProductDetail;
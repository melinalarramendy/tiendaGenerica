import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import NavbarTienda from './NavbarTienda';
import Footer from './Footer';
import {
    Container,
    Row,
    Col,
    Card,
    Spinner,
    Alert,
    Breadcrumb,
    Button,
    Image,
    Badge,
    Form,
    Dropdown,
    InputGroup,
    FormControl
} from 'react-bootstrap';
import axios from 'axios';
import { FaShoppingCart, FaHeart, FaStar, FaRegStar, FaFilter, FaSortAmountDown } from 'react-icons/fa';

const CategoryPage = () => {
    const { categoryName } = useParams();
    const navigate = useNavigate();
    const [category, setCategory] = useState(null);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sortOption, setSortOption] = useState('default');
    const [priceRange, setPriceRange] = useState([0, 10000000]);
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        const formattedCategory = categoryName.replace(/-/g, ' ');
        
        axios.get(`/api/products/category/${categoryName}`)
            .then((res) => {
                setCategory(res.data.category);
                setProducts(res.data.products);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.response?.data?.error || "Error al cargar la categoría");
                setLoading(false);
            });
    }, [categoryName]);

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

    const handleSortChange = (option) => {
        setSortOption(option);
        let sortedProducts = [...products];
        
        switch(option) {
            case 'price-asc':
                sortedProducts.sort((a, b) => a.price - b.price);
                break;
            case 'price-desc':
                sortedProducts.sort((a, b) => b.price - a.price);
                break;
            case 'rating-desc':
                sortedProducts.sort((a, b) => (b.rating || 0) - (a.rating || 0));
                break;
            case 'newest':
                sortedProducts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                break;
            default:
                break;
        }
        
        setProducts(sortedProducts);
    };

    const filteredProducts = products.filter(product => 
        product.price >= priceRange[0] && product.price <= priceRange[1]
    );

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

    return (
        <>
            <NavbarTienda />
            <Container className="my-5 category-page">
                <Breadcrumb className="mb-4">
                    <Breadcrumb.Item href="/">Inicio</Breadcrumb.Item>
                    <Breadcrumb.Item active>{category}</Breadcrumb.Item>
                </Breadcrumb>

                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2 className="mb-0 category-title">{category}</h2>
                    <div className="d-flex">
                        <Button 
                            variant="outline-secondary" 
                            className="me-2 filter-toggle-btn"
                            onClick={() => setShowFilters(!showFilters)}
                        >
                            <FaFilter className="me-1" /> Filtros
                        </Button>
                        <Dropdown>
                            <Dropdown.Toggle variant="outline-secondary" id="dropdown-sort">
                                <FaSortAmountDown className="me-1" /> Ordenar por
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Dropdown.Item active={sortOption === 'default'} onClick={() => handleSortChange('default')}>
                                    Recomendados
                                </Dropdown.Item>
                                <Dropdown.Item active={sortOption === 'price-asc'} onClick={() => handleSortChange('price-asc')}>
                                    Precio: menor a mayor
                                </Dropdown.Item>
                                <Dropdown.Item active={sortOption === 'price-desc'} onClick={() => handleSortChange('price-desc')}>
                                    Precio: mayor a menor
                                </Dropdown.Item>
                                <Dropdown.Item active={sortOption === 'rating-desc'} onClick={() => handleSortChange('rating-desc')}>
                                    Mejor valorados
                                </Dropdown.Item>
                                <Dropdown.Item active={sortOption === 'newest'} onClick={() => handleSortChange('newest')}>
                                    Más nuevos
                                </Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>
                </div>

                {showFilters && (
                    <Card className="mb-4 filter-card">
                        <Card.Body>
                            <h5 className="mb-3">Filtrar por</h5>
                            <Form>
                                <Form.Group className="mb-3">
                                    <Form.Label>Rango de precio</Form.Label>
                                    <div className="d-flex align-items-center">
                                        <Form.Control
                                            type="number"
                                            placeholder="Mínimo"
                                            value={priceRange[0]}
                                            onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
                                            className="me-2"
                                        />
                                        <span className="mx-2">-</span>
                                        <Form.Control
                                            type="number"
                                            placeholder="Máximo"
                                            value={priceRange[1]}
                                            onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 100000000])}
                                            className="ms-2"
                                        />
                                    </div>
                                </Form.Group>
                            </Form>
                        </Card.Body>
                    </Card>
                )}

                {filteredProducts.length === 0 ? (
                    <Alert variant="info">
                        No hay productos disponibles con los filtros seleccionados.
                    </Alert>
                ) : (
                    <Row>
                        {filteredProducts.map(product => (
                            <Col key={product._id} xs={12} sm={6} md={4} lg={3} className="mb-4">
                                <Card className="h-100 product-card shadow-sm">
                                    <Link to={`/product/${product._id}`} className="text-decoration-none text-dark">
                                        <div className="product-image-container">
                                            <Card.Img 
                                                variant="top" 
                                                src={product.main_image} 
                                                className="product-image"
                                            />
                                            {product.discount && (
                                                <Badge bg="danger" className="discount-badge">
                                                    -{product.discount}%
                                                </Badge>
                                            )}
                                        </div>
                                        <Card.Body className="d-flex flex-column">
                                            <Card.Title className="product-title">{product.title}</Card.Title>
                                            <Card.Subtitle className="mb-2 text-muted product-brand">{product.brand}</Card.Subtitle>
                                            <div className="d-flex align-items-center mb-2 product-rating">
                                                {renderRatingStars(product.rating || 4)}
                                                <span className="ms-2 text-muted">({product.reviews || 0})</span>
                                            </div>
                                            <div className="mt-auto">
                                                <div className="d-flex justify-content-between align-items-center">
                                                    <h5 className="mb-0 text-primary product-price">${product.price.toLocaleString()}</h5>
                                                    {product.oldPrice && (
                                                        <small className="text-muted text-decoration-line-through old-price">
                                                            ${product.oldPrice.toLocaleString()}
                                                        </small>
                                                    )}
                                                </div>
                                            </div>
                                        </Card.Body>
                                    </Link>
                                    <Card.Footer className="bg-white border-top-0">
                                        <Button 
                                            variant="primary" 
                                            size="sm" 
                                            className="w-100 add-to-cart-btn"
                                            onClick={() => navigate(`/product/${product._id}`)}
                                        >
                                            <FaShoppingCart className="me-2" /> Ver detalles
                                        </Button>
                                    </Card.Footer>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                )}
            </Container>
            <Footer />
        </>
    );
};

export default CategoryPage;
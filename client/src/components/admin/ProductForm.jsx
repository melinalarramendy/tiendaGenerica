import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    Container,
    Form,
    Button,
    Row,
    Col,
    Card,
    Spinner,
    Alert,
    InputGroup,
    FormControl,
    FormSelect,
    FormCheck,
    FloatingLabel,
    Image,
    Modal
} from 'react-bootstrap';
import axios from 'axios';
import Swal from 'sweetalert2';
import { FaUpload, FaTrash, FaPlus, FaMinus } from 'react-icons/fa';

const ProductForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [showBrandModal, setShowBrandModal] = useState(false);
    const [newCategory, setNewCategory] = useState('');
    const [newBrand, setNewBrand] = useState('');


    const [product, setProduct] = useState({
        title: '',
        description: '',
        price: 0,
        original_price: 0,
        category: '',
        subcategories: [],
        image_urls: [],
        main_image: '',
        stock: 0,
        sku: '',
        brand: '',
        attributes: {
            colors: [],
            sizes: [],
            features: []
        },
        is_featured: false,
        is_active: true
    });


    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                if (id) {
                    const productRes = await axios.get(`/api/products/${id}`);
                    setProduct({
                        ...productRes.data,
                        original_price: productRes.data.original_price || productRes.data.price
                    });
                }

                const allProductsRes = await axios.get('/api/products');
                const allProducts = allProductsRes.data;

                const uniqueCategories = Array.from(
                    new Set(
                        allProducts
                            .map(p => p.category)
                            .filter(Boolean)
                            .map(cat => cat.charAt(0).toUpperCase() + cat.slice(1).toLowerCase())
                    )
                );
                setCategories(uniqueCategories);

                const uniqueBrands = Array.from(
                    new Set(
                        allProducts
                            .map(p => p.brand)
                            .filter(Boolean)
                            .map(brand => brand.charAt(0).toUpperCase() + brand.slice(1).toLowerCase())
                    )
                );
                setBrands(uniqueBrands);

                setLoading(false);
            } catch (err) {
                console.error('Error loading data:', err);
                setError('Error al cargar los datos iniciales');
                setLoading(false);
            }
        };

        fetchInitialData();
    }, [id]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setProduct(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleAttributeChange = (attr, value) => {
        setProduct(prev => ({
            ...prev,
            attributes: {
                ...prev.attributes,
                [attr]: value
            }
        }));
    };


    const handleImageUpload = async (e) => {
        const files = e.target.files;
        if (!files.length) return;

        try {
            const newImages = Array.from(files).map(file => ({
                url: URL.createObjectURL(file),
                file
            }));

            setProduct(prev => ({
                ...prev,
                image_urls: [...prev.image_urls, ...newImages.map(img => img.url)]
            }));
        } catch (err) {
            console.error('Error uploading images:', err);
            Swal.fire('Error', 'No se pudieron subir las imágenes', 'error');
        }
    };

    const removeImage = (index) => {
        setProduct(prev => ({
            ...prev,
            image_urls: prev.image_urls.filter((_, i) => i !== index),
            main_image: prev.main_image === prev.image_urls[index] ? '' : prev.main_image
        }));
    };

    const setMainImage = (url) => {
        setProduct(prev => ({
            ...prev,
            main_image: url
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const token = localStorage.getItem('token');
            const formData = new FormData();

            Object.keys(product).forEach(key => {
                if (key === 'attributes') {
                    formData.append(key, JSON.stringify(product[key]));
                } else if (key !== 'image_urls') {
                    formData.append(key, product[key]);
                }
            });

            product.image_urls.forEach((url, index) => {
                if (url instanceof File) {
                    formData.append(`images`, url);
                }
            });

            let response;
            if (id) {
                response = await axios.put(`/api/admin/products/${id}`, formData, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                });
            } else {
                response = await axios.post('/api/admin/products', formData, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                });
            }

            Swal.fire({
                title: '¡Éxito!',
                text: id ? 'Producto actualizado correctamente' : 'Producto creado correctamente',
                icon: 'success'
            }).then(() => {
                navigate('/admin/products');
            });
        } catch (err) {
            console.error('Error saving product:', err);
            Swal.fire('Error', err.response?.data?.message || 'Error al guardar el producto', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <Container className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
                <Spinner animation="border" variant="primary" />
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="mt-5">
                <Alert variant="danger">{error}</Alert>
                <Button variant="secondary" onClick={() => navigate(-1)}>Volver</Button>
            </Container>
        );
    }

    return (
        <Container className="my-5">
            <Card className="shadow-sm">
                <Card.Header className="bg-primary text-white">
                    <h3 className="mb-0">
                        {id ? 'Editar Producto' : 'Crear Nuevo Producto'}
                    </h3>
                </Card.Header>
                <Card.Body>
                    <Form onSubmit={handleSubmit}>
                        <Row>
                            {/* Columna izquierda - Información básica */}
                            <Col md={8}>
                                <Form.Group className="mb-3">
                                    <FloatingLabel label="Nombre del producto">
                                        <Form.Control
                                            type="text"
                                            name="title"
                                            value={product.title}
                                            onChange={handleChange}
                                            placeholder="Nombre del producto"
                                            required
                                        />
                                    </FloatingLabel>
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <FloatingLabel label="Descripción">
                                        <Form.Control
                                            as="textarea"
                                            name="description"
                                            value={product.description}
                                            onChange={handleChange}
                                            placeholder="Descripción detallada del producto"
                                            style={{ height: '150px' }}
                                            required
                                        />
                                    </FloatingLabel>
                                </Form.Group>

                                <Row className="mb-3">
                                    <Col md={6}>
                                        <Form.Group>
                                            <FloatingLabel label="Precio actual">
                                                <Form.Control
                                                    type="number"
                                                    name="price"
                                                    value={product.price}
                                                    onChange={handleChange}
                                                    placeholder="Precio actual"
                                                    min="0"
                                                    step="0.01"
                                                    required
                                                />
                                            </FloatingLabel>
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group>
                                            <FloatingLabel label="Precio original (opcional)">
                                                <Form.Control
                                                    type="number"
                                                    name="original_price"
                                                    value={product.original_price}
                                                    onChange={handleChange}
                                                    placeholder="Precio original"
                                                    min="0"
                                                    step="0.01"
                                                />
                                            </FloatingLabel>
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Row className="mb-3">
                                    <Col md={6}>
                                        <Form.Group>
                                            <FloatingLabel label="Categoría">
                                                <Form.Select
                                                    name="category"
                                                    value={product.category}
                                                    onChange={e => {
                                                        if (e.target.value === '__add__') {
                                                            setShowCategoryModal(true);
                                                        } else {
                                                            handleChange(e);
                                                        }
                                                    }}
                                                    required
                                                >
                                                    <option value="">Selecciona una categoría</option>
                                                    {categories.map((cat, idx) => (
                                                        <option key={idx} value={cat}>{cat}</option>
                                                    ))}
                                                    <option value="__add__">Agregar nueva categoría...</option>
                                                </Form.Select>
                                            </FloatingLabel>
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group>
                                            <FloatingLabel label="Marca">
                                                <Form.Select
                                                    name="brand"
                                                    value={product.brand}
                                                    onChange={e => {
                                                        if (e.target.value === '__add__') {
                                                            setShowBrandModal(true);
                                                        } else {
                                                            handleChange(e);
                                                        }
                                                    }}
                                                >
                                                    <option value="">Selecciona una marca</option>
                                                    {brands.map((brand, idx) => (
                                                        <option key={idx} value={brand}>{brand}</option>
                                                    ))}
                                                    <option value="__add__">Agregar nueva marca...</option>
                                                </Form.Select>
                                            </FloatingLabel>
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Row className="mb-3">
                                    <Col md={6}>
                                        <Form.Group>
                                            <FloatingLabel label="SKU (Código de producto)">
                                                <Form.Control
                                                    type="text"
                                                    name="sku"
                                                    value={product.sku}
                                                    onChange={handleChange}
                                                    placeholder="SKU"
                                                />
                                            </FloatingLabel>
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group>
                                            <FloatingLabel label="Stock disponible">
                                                <Form.Control
                                                    type="number"
                                                    name="stock"
                                                    value={product.stock}
                                                    onChange={handleChange}
                                                    placeholder="Stock"
                                                    min="0"
                                                    required
                                                />
                                            </FloatingLabel>
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Row className="mb-3">
                                    <Col>
                                        <Form.Check
                                            type="checkbox"
                                            label="Producto destacado"
                                            name="is_featured"
                                            checked={product.is_featured}
                                            onChange={handleChange}
                                        />
                                    </Col>
                                    <Col>
                                        <Form.Check
                                            type="checkbox"
                                            label="Producto activo"
                                            name="is_active"
                                            checked={product.is_active}
                                            onChange={handleChange}
                                        />
                                    </Col>
                                </Row>
                            </Col>

                            {/* Columna derecha - Imágenes y atributos */}
                            <Col md={4}>
                                <Card className="mb-4">
                                    <Card.Header>Imágenes del producto</Card.Header>
                                    <Card.Body>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Subir imágenes</Form.Label>
                                            <InputGroup>
                                                <Form.Control
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleImageUpload}
                                                    multiple
                                                />
                                                <Button variant="outline-secondary">
                                                    <FaUpload className="me-2" />
                                                    Subir
                                                </Button>
                                            </InputGroup>
                                            <Form.Text className="text-muted">
                                                Seleccione una o más imágenes (máx. 5MB cada una)
                                            </Form.Text>
                                        </Form.Group>

                                        <div className="d-flex flex-wrap gap-2 mb-3">
                                            {product.image_urls.map((url, index) => (
                                                <div key={index} className="position-relative">
                                                    <Image
                                                        src={url}
                                                        thumbnail
                                                        style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                                                        className={product.main_image === url ? 'border border-primary' : ''}
                                                        onClick={() => setMainImage(url)}
                                                    />
                                                    <Button
                                                        variant="danger"
                                                        size="sm"
                                                        className="position-absolute top-0 end-0 p-0"
                                                        style={{ width: '20px', height: '20px' }}
                                                        onClick={() => removeImage(index)}
                                                    >
                                                        <FaTrash size={10} />
                                                    </Button>
                                                    {product.main_image === url && (
                                                        <div className="position-absolute bottom-0 start-0 w-100 bg-primary text-white text-center">
                                                            Principal
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </Card.Body>
                                </Card>

                                <Card className="mb-4">
                                    <Card.Header>Atributos</Card.Header>
                                    <Card.Body>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Colores disponibles</Form.Label>
                                            <InputGroup>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Agregar color"
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter' && e.target.value) {
                                                            handleAttributeChange('colors', [...product.attributes.colors, e.target.value]);
                                                            e.target.value = '';
                                                        }
                                                    }}
                                                />
                                                <Button
                                                    variant="outline-secondary"
                                                    onClick={(e) => {
                                                        const input = e.target.closest('.input-group').querySelector('input');
                                                        if (input.value) {
                                                            handleAttributeChange('colors', [...product.attributes.colors, input.value]);
                                                            input.value = '';
                                                        }
                                                    }}
                                                >
                                                    <FaPlus />
                                                </Button>
                                            </InputGroup>
                                            <div className="d-flex flex-wrap gap-2 mt-2">
                                                {product.attributes.colors.map((color, index) => (
                                                    <Badge key={index} bg="light" text="dark" className="d-flex align-items-center">
                                                        {color}
                                                        <FaMinus
                                                            className="ms-2 cursor-pointer"
                                                            onClick={() => handleAttributeChange('colors', product.attributes.colors.filter((_, i) => i !== index))}
                                                        />
                                                    </Badge>
                                                ))}
                                            </div>
                                        </Form.Group>

                                        <Form.Group className="mb-3">
                                            <Form.Label>Tallas disponibles</Form.Label>
                                            <InputGroup>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Agregar talla"
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter' && e.target.value) {
                                                            handleAttributeChange('sizes', [...product.attributes.sizes, e.target.value]);
                                                            e.target.value = '';
                                                        }
                                                    }}
                                                />
                                                <Button
                                                    variant="outline-secondary"
                                                    onClick={(e) => {
                                                        const input = e.target.closest('.input-group').querySelector('input');
                                                        if (input.value) {
                                                            handleAttributeChange('sizes', [...product.attributes.sizes, input.value]);
                                                            input.value = '';
                                                        }
                                                    }}
                                                >
                                                    <FaPlus />
                                                </Button>
                                            </InputGroup>
                                            <div className="d-flex flex-wrap gap-2 mt-2">
                                                {product.attributes.sizes.map((size, index) => (
                                                    <Badge key={index} bg="light" text="dark" className="d-flex align-items-center">
                                                        {size}
                                                        <FaMinus
                                                            className="ms-2 cursor-pointer"
                                                            onClick={() => handleAttributeChange('sizes', product.attributes.sizes.filter((_, i) => i !== index))}
                                                        />
                                                    </Badge>
                                                ))}
                                            </div>
                                        </Form.Group>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>

                        <div className="d-flex justify-content-end gap-2 mt-4">
                            <Button
                                variant="secondary"
                                onClick={() => navigate('/admin/')}
                                disabled={isSubmitting}
                            >
                                Cancelar
                            </Button>
                            <Button
                                variant="primary"
                                type="submit"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <>
                                        <Spinner animation="border" size="sm" className="me-2" />
                                        {id ? 'Actualizando...' : 'Creando...'}
                                    </>
                                ) : (
                                    id ? 'Actualizar Producto' : 'Crear Producto'
                                )}
                            </Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>

            <Modal show={showCategoryModal} onHide={() => setShowCategoryModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Agregar nueva categoría</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Control
                        type="text"
                        placeholder="Nueva categoría"
                        value={newCategory}
                        onChange={e => setNewCategory(e.target.value)}
                    />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowCategoryModal(false)}>
                        Cancelar
                    </Button>
                    <Button
                        variant="primary"
                        onClick={() => {
                            if (newCategory && !categories.includes(newCategory)) {
                                setCategories([...categories, newCategory]);
                                setProduct(prev => ({ ...prev, category: newCategory }));
                            }
                            setNewCategory('');
                            setShowCategoryModal(false);
                        }}
                    >
                        Agregar
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showBrandModal} onHide={() => setShowBrandModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Agregar nueva marca</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Control
                        type="text"
                        placeholder="Nueva marca"
                        value={newBrand}
                        onChange={e => setNewBrand(e.target.value)}
                    />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowBrandModal(false)}>
                        Cancelar
                    </Button>
                    <Button
                        variant="primary"
                        onClick={() => {
                            if (newBrand && !brands.includes(newBrand)) {
                                setBrands([...brands, newBrand]);
                                setProduct(prev => ({ ...prev, brand: newBrand }));
                            }
                            setNewBrand('');
                            setShowBrandModal(false);
                        }}
                    >
                        Agregar
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default ProductForm;
import { Container, Navbar as BootstrapNavbar, Dropdown, Nav, FormControl, Button, InputGroup, Badge, Offcanvas } from 'react-bootstrap';
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 1800,
  timerProgressBar: true
});

const NavbarTienda = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [cartItems, setCartItems] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [showWishlist, setShowWishlist] = useState(false);

  const fetchCart = async (token) => {
    try {
      const res = await axios.get('/api/cart/', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      setCartItems(res.data);
      const totalItems = res.data.reduce((acc, item) => acc + item.quantity, 0);
      setCartCount(totalItems);
    } catch (err) {
      console.error("Error al obtener el carrito:", err);
      if (err.response && err.response.status === 401) {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        Toast.fire({
          icon: 'error',
          title: 'Sesión expirada',
          text: 'Por favor inicia sesión nuevamente',
        });
      }
    }
  };

  const fetchWishlist = async (token) => {
    try {
      const res = await axios.get('/api/wishlist/', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setWishlistItems(res.data);
    } catch (err) {
      console.error("Error al obtener la wishlist:", err);
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
      }
    }
  };

  const handleRemoveFromWishlist = async (productId) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      await axios.delete(`/api/wishlist/remove/${productId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      Toast.fire({
        icon: 'success',
        title: 'Eliminado de tu lista de deseos'
      });
      window.dispatchEvent(new CustomEvent('wishlistUpdated'));
    } catch (err) {
      console.error("Error al eliminar de wishlist:", err);
      Toast.fire({
        icon: 'error',
        title: 'Error al eliminar de lista de deseos'
      });
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    const loggedIn = !!token;
    setIsLoggedIn(loggedIn);

    if (loggedIn) {
      fetchCart(token);
      fetchWishlist(token);
    } else {
      setCartCount(0);
      setCartItems([]);
      setWishlistItems([]);
    }
  }, [location]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const loggedIn = !!token;
    setIsLoggedIn(loggedIn);

    const handleCartUpdate = () => loggedIn && fetchCart(token);
    const handleWishlistUpdate = () => loggedIn && fetchWishlist(token);

    window.addEventListener('cartUpdated', handleCartUpdate);
    window.addEventListener('wishlistUpdated', handleWishlistUpdate);

    if (loggedIn) {
      fetchCart(token);
      fetchWishlist(token);
    }

    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
      window.removeEventListener('wishlistUpdated', handleWishlistUpdate);
    };
  }, [location]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const loggedIn = !!token;
    setIsLoggedIn(loggedIn);

    if (loggedIn) {
      fetchCart(token);
    } else {
      setCartCount(0);
      setCartItems([]);
    }
  }, [location]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const loggedIn = !!token;
    setIsLoggedIn(loggedIn);

    const handleCartUpdate = () => {
      if (loggedIn) {
        fetchCart(token);
      }
    };

    window.addEventListener('cartUpdated', handleCartUpdate);

    if (loggedIn) {
      fetchCart(token);
    } else {
      setCartCount(0);
    }

    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    window.location.href = '/login';
  };

  const handleCartClick = (e) => {
    e.preventDefault();
    setShowCart(!showCart);
  };

  const handleCloseCart = () => setShowCart(false);

  const handleRemoveItem = async (productId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      Toast.fire({
        icon: 'error',
        title: 'Debes iniciar sesión'
      });
      return;
    }

    try {

      const itemIndex = cartItems.findIndex(item => item.product._id === productId);

      if (itemIndex === -1) return;

      const currentItem = cartItems[itemIndex];

      if (currentItem.quantity > 1) {

        const updatedItems = [...cartItems];
        updatedItems[itemIndex] = {
          ...updatedItems[itemIndex],
          quantity: updatedItems[itemIndex].quantity - 1
        };

        setCartItems(updatedItems);
        setCartCount(prev => prev - 1);

        await axios.put('/api/cart/update', {
          product_id: productId,
          quantity: -1
        }, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        Toast.fire({
          icon: 'success',
          title: 'Se removió una unidad'
        });
      } else {
        await axios.delete(`/api/cart/remove/${productId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const updatedItems = cartItems.filter(item => item.product._id !== productId);
        setCartItems(updatedItems);
        setCartCount(prev => prev - 1);

        Toast.fire({
          icon: 'success',
          title: 'Producto eliminado'
        });
      }

      window.dispatchEvent(new CustomEvent('cartUpdated'));

    } catch (err) {
      console.error("Error al actualizar carrito:", err);
      Toast.fire({
        icon: 'error',
        title: 'Error al actualizar carrito'
      });
      fetchCart(token);
    }
  };

  return (
    <BootstrapNavbar bg="white" expand="lg" className="shadow-sm py-3">
      <Container fluid className="px-4">
        <BootstrapNavbar.Brand href="/" className="fw-bold fs-4 text-dark">
          Logo
        </BootstrapNavbar.Brand>

        <div className="d-none d-lg-flex flex-grow-1 mx-4 justify-content-center">
          <InputGroup style={{ maxWidth: '600px', width: '100%' }}>
            <FormControl placeholder="Buscar productos" className="border-end-0" />
            <Button variant="secondary" className="px-3">
              <i className="bi bi-search"></i>
            </Button>
          </InputGroup>
        </div>

        <Nav className="ms-auto align-items-center">
          <Dropdown align="end">
            <Dropdown.Toggle
              variant="light"
              className="d-flex align-items-center border-0 bg-transparent"
              style={{ boxShadow: 'none' }}
              id="dropdown-basic"
            >
              <i className="bi bi-person fs-5 me-2"></i> Mi cuenta
            </Dropdown.Toggle>

            <Dropdown.Menu>
              {!isLoggedIn ? (
                <Dropdown.Item onClick={() => navigate("/login")}>Iniciar sesión</Dropdown.Item>
              ) : (
                <>
                  <Dropdown.Item onClick={() => navigate("/profile")}>Mi perfil</Dropdown.Item>
                  <Dropdown.Item onClick={() => navigate("/orders")}>Mis pedidos</Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item onClick={handleLogout}>Cerrar sesión</Dropdown.Item>
                </>
              )}
            </Dropdown.Menu>
          </Dropdown>

          <Nav.Link
            href="#"
            className="text-dark ms-2 position-relative"
            onClick={(e) => { e.preventDefault(); setShowWishlist(true); }}
          >
            <i className="bi bi-heart fs-5"></i>
            {wishlistItems.length > 0 && (
              <Badge bg="danger" pill className="position-absolute top-0 start-100 translate-middle">
                {wishlistItems.length}
              </Badge>
            )}
          </Nav.Link>

          <Nav.Link
            href="/cart"
            className="text-dark ms-2 position-relative"
            onClick={handleCartClick}
          ></Nav.Link>

          <Nav.Link
            href="/cart"
            className="text-dark ms-2 position-relative"
            onClick={handleCartClick}
          >
            <i className="bi bi-cart fs-5"></i>
            {cartCount > 0 && (
              <Badge bg="danger" pill className="position-absolute top-0 start-100 translate-middle">
                {cartCount}
              </Badge>
            )}
          </Nav.Link>
        </Nav>

        {/* Offcanvas para el carrito */}
        <Offcanvas
          show={showCart}
          onHide={handleCloseCart}
          placement="end"
          style={{ width: '350px' }}
        >
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>
              <i className="bi bi-cart me-2"></i>
              Mi Carrito ({cartCount})
            </Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            {cartItems.length === 0 ? (
              <div className="text-center py-4">
                <i className="bi bi-cart-x fs-1 text-muted"></i>
                <p className="mt-3">Tu carrito está vacío</p>
                <Button
                  variant="primary"
                  onClick={() => {
                    handleCloseCart();
                    navigate('/');
                  }}
                >
                  Ir a comprar
                </Button>
              </div>
            ) : (
              <div className="d-flex flex-column h-100">
                <div className="flex-grow-1 overflow-auto">
                  {cartItems.map((item, index) => (
                    <div key={index} className="d-flex mb-3 border-bottom pb-3 position-relative">
                      <img
                        src={item.product.main_image}
                        alt={item.product.name}
                        className="rounded me-3"
                        style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                      />
                      <div className="flex-grow-1">
                        <h6 className="mb-1">{item.product.name}</h6>
                        <div className="d-flex flex-column">
                          <div className="d-flex align-items-center mb-1">
                            <span className="text-muted me-2">Cantidad: {item.quantity}</span>
                            {item.quantity > 1 && (
                              <Button
                                variant="outline-danger"
                                size="sm"
                                className="py-0 px-1"
                                onClick={() => handleRemoveItem(item.product._id)}
                                title="Quitar una unidad"
                              >
                                <i className="bi bi-dash"></i>
                              </Button>
                            )}
                          </div>
                          <strong>${(item.product.price * item.quantity).toFixed(2)}</strong>
                        </div>
                      </div>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        className="position-absolute top-0 end-0 mt-1 me-1"
                        onClick={() => handleRemoveItem(item.product._id, true)}
                        title="Eliminar todo"
                      >
                        <i className="bi bi-trash"></i>
                      </Button>
                    </div>
                  ))}
                </div>
                <div className="border-top pt-3">
                  <div className="d-flex justify-content-between mb-3">
                    <strong>Total:</strong>
                    <strong>
                      ${cartItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0).toFixed(2)}
                    </strong>
                  </div>

                  <div className="d-grid gap-2">
                    <Button
                      variant="outline-primary"
                      className="w-100"
                      onClick={() => {
                        handleCloseCart();
                        navigate('/cart');
                      }}
                    >
                      Ver carrito completo
                    </Button>

                    <Button
                      variant="primary"
                      className="w-100"
                      onClick={() => {
                        handleCloseCart();
                        navigate('/checkout');
                      }}
                      disabled={cartItems.length === 0}
                    >
                      Comprar ahora
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </Offcanvas.Body>
        </Offcanvas>

        <Offcanvas
          show={showWishlist}
          onHide={() => setShowWishlist(false)}
          placement="end"
          style={{ width: '350px' }}
        >
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>
              <i className="bi bi-heart me-2"></i>
              Mi Lista de Deseos ({wishlistItems.length})
            </Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            {wishlistItems.length === 0 ? (
              <div className="text-center py-4">
                <i className="bi bi-heart fs-1 text-muted"></i>
                <p className="mt-3">Tu lista de deseos está vacía</p>
                <Button
                  variant="primary"
                  onClick={() => {
                    setShowWishlist(false);
                    navigate('/');
                  }}
                >
                  Explorar productos
                </Button>
              </div>
            ) : (
              <div className="d-flex flex-column h-100">
                <div className="flex-grow-1 overflow-auto">
                  {wishlistItems.map((item, index) => (
                    <div key={index} className="d-flex mb-3 border-bottom pb-3 position-relative">
                      <img
                        src={item.main_image}
                        alt={item.name}
                        className="rounded me-3"
                        style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                        onClick={() => {
                          setShowWishlist(false);
                          navigate(`/product/${item._id}`);
                        }}
                      />
                      <div className="flex-grow-1">
                        <h6
                          className="mb-1"
                          onClick={() => {
                            setShowWishlist(false);
                            navigate(`/product/${item._id}`);
                          }}
                          style={{ cursor: 'pointer' }}
                        >
                          {item.name}
                        </h6>
                        <strong>${item.price.toFixed(2)}</strong>
                      </div>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        className="position-absolute top-0 end-0 mt-1 me-1"
                        onClick={() => handleRemoveFromWishlist(item._id)}
                        title="Eliminar de lista de deseos"
                      >
                        <i className="bi bi-trash"></i>
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Offcanvas.Body>
        </Offcanvas>
      </Container>
    </BootstrapNavbar>
  );
};

export default NavbarTienda;
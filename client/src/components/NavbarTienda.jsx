import { Container, Navbar as BootstrapNavbar, Dropdown, Nav, Form, FormControl, Button, InputGroup, } from 'react-bootstrap';
import React, { useState, useEffect } from 'react';

const NavbarTienda = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

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
                  <Dropdown.Item onClick={
                    () => {
                      localStorage.removeItem('token');
                      setIsLoggedIn(false);
                      window.location.href = '/login';
                    }
                  }>Cerrar sesión</Dropdown.Item>
                </>
              )}
            </Dropdown.Menu>
          </Dropdown>

          <Nav.Link href="/cart" className="text-dark ms-2">
            <i className="bi bi-cart fs-5"></i>
          </Nav.Link>
        </Nav>
      </Container>
    </BootstrapNavbar>
  );
};

export default NavbarTienda;
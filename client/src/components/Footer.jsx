import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";
import visa from "../assets/payments/visa.png";
import mastercard from "../assets/payments/mastercard.png";
import amex from "../assets/payments/amex.png";
import paypal from "../assets/payments/paypal.png";

const Footer = () => {
    return (
        <footer className="bg-dark text-white mt-5">
            <Container className="py-5">
                <Row>
                    <Col md={3}>
                        <div className="mb-3">
                            <img 
                                alt="Logo de la tienda" 
                                className="img-fluid" 
                                style={{ maxHeight: '50px' }}
                            />
                        </div>
                        <p className="text-muted">Tienda online líder en productos de calidad</p>
                    </Col>
                    
                    <Col md={3}>
                        <h5>Contactanos</h5>
                        <ul className="list-unstyled">
                            <li><a className="text-white text-decoration-none">DIRECCIÓN</a></li>
                            <li><a className="text-white text-decoration-none">CELULAR</a></li>
                            <li><a className="text-white text-decoration-none">MAIL</a></li>
                        </ul>
                    </Col>

                    <Col md={3}>
                        <h5>Enlaces rápidos</h5>
                        <ul className="list-unstyled">
                            <li><a href="/comocomprar" className="text-white text-decoration-none">Como comprar</a></li>
                            <li><a href="/devoluciones" className="text-white text-decoration-none">Devoluciones y reembolsos</a></li>
                            <li><a href="/contacto" className="text-white text-decoration-none">Contacto</a></li>
                        </ul>
                    </Col>
                    
                    <Col md={3}>
                        <h5>MÉTODOS DE PAGO</h5>
                        <div className="d-flex flex-wrap">
                            <img src={visa} alt="Visa" className="me-2 mb-2" width="40" />
                            <img src={mastercard} alt="MasterCard" className="me-2 mb-2" width="40" />
                            <img src={amex} alt="American Express" className="me-2 mb-2" width="40" />
                            <img src={paypal} alt="PayPal" className="me-2 mb-2" width="40" />
                        </div>
                        
                        <h5 className="mt-3">SÍGUENOS</h5>
                        <div className="d-flex">
                            <a href="#" className="text-white me-3"><FaFacebook size={24} /></a>
                            <a href="#" className="text-white me-3"><FaTwitter size={24} /></a>
                            <a href="#" className="text-white me-3"><FaInstagram size={24} /></a>
                            <a href="#" className="text-white"><FaYoutube size={24} /></a>
                        </div>
                    </Col>
                </Row>
            </Container>

            <hr className="my-0 bg-secondary" />

            <Container className="py-3">
                <Row>
                    <Col md={6}>
                        <p className="mb-0">© {new Date().getFullYear()} MiTiendaGenérica. Todos los derechos reservados.</p>
                    </Col>
                    <Col md={6} className="text-md-end">
                        <p className="mb-0">Argentina</p>
                    </Col>
                </Row>
            </Container>
        </footer>
    );
};

export default Footer;
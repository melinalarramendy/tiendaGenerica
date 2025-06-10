import React from "react";
import { Container, Row, Col, Form, Button, Card, Alert } from "react-bootstrap";
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock, FaPaperPlane } from "react-icons/fa";
import NavbarTienda from "./NavbarTienda";

const Contacto = () => {
    return (
        <>
            <NavbarTienda />
            <Container className="my-5">
                {/* Encabezado */}
                <Row className="mb-5 text-center">
                    <Col>
                        <h1 className="display-5 fw-bold">Contacto</h1>
                        <p className="lead text-muted">Estamos acá para ayudarte</p>
                    </Col>
                </Row>

                <Row className="g-4">
                    {/* Información de contacto */}
                    <Col md={4}>
                        <Card className="h-100 border-0 shadow-sm">
                            <Card.Body className="p-4">
                                <h3 className="h4 fw-bold mb-4">Información de Contacto</h3>

                                <div className="d-flex mb-4">
                                    <div className="me-3 text-primary">
                                        <FaMapMarkerAlt size={20} />
                                    </div>
                                    <div>
                                        <h4 className="h6 fw-bold mb-1">Dirección</h4>
                                        <p className="text-muted mb-0">[Dirección completa de la tienda]</p>
                                    </div>
                                </div>

                                <div className="d-flex mb-4">
                                    <div className="me-3 text-primary">
                                        <FaPhone size={20} />
                                    </div>
                                    <div>
                                        <h4 className="h6 fw-bold mb-1">Teléfono</h4>
                                        <p className="text-muted mb-0">[Número de teléfono principal]</p>
                                        <p className="text-muted mb-0">[Número de teléfono secundario]</p>
                                    </div>
                                </div>

                                <div className="d-flex mb-4">
                                    <div className="me-3 text-primary">
                                        <FaEnvelope size={20} />
                                    </div>
                                    <div>
                                        <h4 className="h6 fw-bold mb-1">Email</h4>
                                        <p className="text-muted mb-0">[Email de contacto general]</p>
                                        <p className="text-muted mb-0">[Email de soporte técnico]</p>
                                    </div>
                                </div>

                                <div className="d-flex">
                                    <div className="me-3 text-primary">
                                        <FaClock size={20} />
                                    </div>
                                    <div>
                                        <h4 className="h6 fw-bold mb-1">Horario de atención</h4>
                                        <p className="text-muted mb-0">[Días y horarios de atención]</p>
                                    </div>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>

                    {/* Formulario de contacto */}
                    <Col md={8}>
                        <Card className="border-0 shadow-sm">
                            <Card.Body className="p-4">
                                <h3 className="h4 fw-bold mb-4">Envianos un mensaje</h3>

                                <Alert variant="info">
                                    Todos los campos marcados con <span className="text-danger">*</span> son obligatorios.
                                </Alert>

                                <Form>
                                    <Row className="mb-3">
                                        <Col md={6} className="mb-3 mb-md-0">
                                            <Form.Group controlId="formNombre">
                                                <Form.Label>Nombre completo <span className="text-danger">*</span></Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Ingresa tu nombre completo"
                                                    required
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group controlId="formEmail">
                                                <Form.Label>Email <span className="text-danger">*</span></Form.Label>
                                                <Form.Control
                                                    type="email"
                                                    placeholder="Ingresa tu email"
                                                    required
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>

                                    <Row className="mb-3">
                                        <Col md={6} className="mb-3 mb-md-0">
                                            <Form.Group controlId="formTelefono">
                                                <Form.Label>Teléfono</Form.Label>
                                                <Form.Control
                                                    type="tel"
                                                    placeholder="Ingresa tu número de teléfono"
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group controlId="formAsunto">
                                                <Form.Label>Asunto <span className="text-danger">*</span></Form.Label>
                                                <Form.Select required>
                                                    <option value="">Selecciona un asunto</option>
                                                    <option value="consulta">Consulta general</option>
                                                    <option value="pedido">Consulta sobre mi pedido</option>
                                                    <option value="devolucion">Devolución o cambio</option>
                                                    <option value="garantia">Consulta sobre garantía</option>
                                                    <option value="otro">Otro</option>
                                                </Form.Select>
                                            </Form.Group>
                                        </Col>
                                    </Row>

                                    <Form.Group className="mb-3" controlId="formMensaje">
                                        <Form.Label>Mensaje <span className="text-danger">*</span></Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            rows={5}
                                            placeholder="Escribe tu mensaje aquí..."
                                            required
                                        />
                                    </Form.Group>

                                    <div className="d-grid">
                                        <Button variant="primary" type="submit" className="fw-bold">
                                            <FaPaperPlane className="me-2" /> Enviar mensaje
                                        </Button>
                                    </div>
                                </Form>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                {/* Mapa de ubicación */}
                <Row className="mt-5">
                    <Col>
                        <Card className="border-0 shadow-sm">
                            <Card.Body className="p-0">
                                <div className="ratio ratio-16x9">
                                    <iframe
                                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d[LATITUD]!2d[LONGITUD]!3d[ZOOM]!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2z[LATITUD]x[LONGITUD]!5e0!3m2!1sen!2sus!4v[TIEMPO]"
                                        title="Ubicación de la tienda"
                                        allowFullScreen
                                        loading="lazy"
                                        className="border-0"
                                    ></iframe>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>


        </>
    );
};

export default Contacto;
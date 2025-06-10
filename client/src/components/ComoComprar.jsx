import React from "react";
import { Container, Row, Col, Card, ListGroup, Accordion } from "react-bootstrap";
import NavbarTienda from "./NavbarTienda";
import { FaShoppingCart, FaUser, FaMapMarkerAlt, FaFileInvoice, FaTruck, FaCreditCard, FaCheckCircle } from "react-icons/fa";

const ComoComprar = () => {
    return (

        <>
        <NavbarTienda />
        
            <Container className="my-5">
                <Row className="mb-4">
                    <Col className="text-center">
                        <h1 className="display-5 fw-bold">Cómo Comprar</h1>
                        <p className="lead">Sigue estos sencillos pasos para realizar tu compra</p>
                    </Col>
                </Row>

                <Row className="g-4">
                    {/* Paso 1 */}
                    <Col md={6} lg={4}>
                        <Card className="h-100 shadow-sm border-0">
                            <Card.Body className="text-center p-4">
                                <div className="bg-primary bg-opacity-10 rounded-circle d-inline-flex p-3 mb-3">
                                    <FaShoppingCart size={24} className="text-primary" />
                                </div>
                                <Card.Title className="fw-bold mb-3">1. Selección de Productos</Card.Title>
                                <Card.Text>
                                    Elige el producto que deseas comprar y haz clic en "Agregar al carrito".
                                    Puedes seguir agregando otros productos o continuar al checkout.
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>

                    {/* Paso 2 */}
                    <Col md={6} lg={4}>
                        <Card className="h-100 shadow-sm border-0">
                            <Card.Body className="text-center p-4">
                                <div className="bg-primary bg-opacity-10 rounded-circle d-inline-flex p-3 mb-3">
                                    <FaUser size={24} className="text-primary" />
                                </div>
                                <Card.Title className="fw-bold mb-3">2. Datos de Contacto</Card.Title>
                                <Card.Text>
                                    Completa tus datos personales y haz clic en "Continuar".
                                    Asegúrate de que la información sea correcta para recibir las notificaciones.
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>

                    {/* Paso 3 */}
                    <Col md={6} lg={4}>
                        <Card className="h-100 shadow-sm border-0">
                            <Card.Body className="text-center p-4">
                                <div className="bg-primary bg-opacity-10 rounded-circle d-inline-flex p-3 mb-3">
                                    <FaMapMarkerAlt size={24} className="text-primary" />
                                </div>
                                <Card.Title className="fw-bold mb-3">3. Dirección de Envío</Card.Title>
                                <Card.Text>
                                    Ingresa la dirección donde deseas recibir el producto.
                                    Verifica que los datos sean exactos para evitar inconvenientes en la entrega.
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>

                    {/* Paso 4 */}
                    <Col md={6} lg={4}>
                        <Card className="h-100 shadow-sm border-0">
                            <Card.Body className="text-center p-4">
                                <div className="bg-primary bg-opacity-10 rounded-circle d-inline-flex p-3 mb-3">
                                    <FaFileInvoice size={24} className="text-primary" />
                                </div>
                                <Card.Title className="fw-bold mb-3">4. Datos de Facturación</Card.Title>
                                <Card.Text>
                                    Selecciona el tipo de factura (Consumidor Final o con datos fiscales) y completa
                                    la información requerida según corresponda.
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>

                    {/* Paso 5 */}
                    <Col md={6} lg={4}>
                        <Card className="h-100 shadow-sm border-0">
                            <Card.Body className="text-center p-4">
                                <div className="bg-primary bg-opacity-10 rounded-circle d-inline-flex p-3 mb-3">
                                    <FaTruck size={24} className="text-primary" />
                                </div>
                                <Card.Title className="fw-bold mb-3">5. Método de Envío</Card.Title>
                                <Card.Text>
                                    <strong>Opción 1:</strong> MercadoEnvíos (recomendado)<br />
                                    <strong>Opción 2:</strong> Retiro en local (consultar horarios)<br />
                                    <strong>Opción 3:</strong> Envío por transporte (pago al recibir)
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>

                    {/* Paso 6 */}
                    <Col md={6} lg={4}>
                        <Card className="h-100 shadow-sm border-0">
                            <Card.Body className="text-center p-4">
                                <div className="bg-primary bg-opacity-10 rounded-circle d-inline-flex p-3 mb-3">
                                    <FaCreditCard size={24} className="text-primary" />
                                </div>
                                <Card.Title className="fw-bold mb-3">6. Medio de Pago</Card.Title>
                                <Card.Text>
                                    Elige entre transferencia bancaria, MercadoPago, tarjeta de crédito/débito
                                    u otros métodos disponibles. Haz clic en "Continuar".
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                <Row className="mt-5">
                    <Col lg={8} className="mx-auto">
                        <Accordion defaultActiveKey="0" className="shadow-sm">
                            <Accordion.Item eventKey="0">
                                <Accordion.Header className="fw-bold">
                                    <FaCheckCircle className="text-success me-2" /> Confirmación de Compra
                                </Accordion.Header>
                                <Accordion.Body>
                                    <p>
                                        En la página de confirmación revisa toda la información de tu compra.
                                        Al hacer clic en "Finalizar Compra" serás redirigido para completar el pago.
                                    </p>
                                    <p className="mb-0">
                                        Recibirás un correo de confirmación (no es comprobante de pago).
                                        El envío se realizará una vez acreditado el pago.
                                    </p>
                                </Accordion.Body>
                            </Accordion.Item>

                            <Accordion.Item eventKey="1">
                                <Accordion.Header className="fw-bold">
                                    <FaTruck className="text-primary me-2" /> Detalles de Envíos
                                </Accordion.Header>
                                <Accordion.Body>
                                    <p>
                                        <strong>MercadoEnvíos:</strong> Seleccionamos el transporte más adecuado para tu compra.
                                    </p>
                                    <p>
                                        <strong>Retiro en local:</strong> Consultar horarios de atención antes de acercarse.
                                    </p>
                                    <p className="mb-0">
                                        <strong>Envío por transporte:</strong> Solo abonas embalaje, el flete se paga al recibir.
                                    </p>
                                </Accordion.Body>
                            </Accordion.Item>
                        </Accordion>
                    </Col>
                </Row>

                {/* Sección de Contacto */}
                <Row className="mt-5 pt-4 border-top">
                    <Col md={6}>
                        <h3 className="fw-bold mb-4">Contacto</h3>
                        <ListGroup variant="flush">
                            <ListGroup.Item className="border-0 ps-0">
                                <strong>Dirección:</strong> [Tu dirección completa]
                            </ListGroup.Item>
                            <ListGroup.Item className="border-0 ps-0">
                                <strong>Teléfono:</strong> [Número de contacto]
                            </ListGroup.Item>
                            <ListGroup.Item className="border-0 ps-0">
                                <strong>Email:</strong> [Email de contacto]
                            </ListGroup.Item>
                            <ListGroup.Item className="border-0 ps-0">
                                <strong>Horario de atención:</strong> Lunes a Viernes de 9 a 18hs
                            </ListGroup.Item>
                        </ListGroup>
                    </Col>
                    <Col md={6}>
                        <h3 className="fw-bold mb-4">¿Necesitas ayuda?</h3>
                        <p>
                            Si tienes dudas sobre el proceso de compra o necesitas asistencia,
                            no dudes en contactarnos a través de nuestros canales de atención.
                        </p>
                        <p className="mb-0">
                            Nuestro equipo estará encantado de ayudarte con cualquier consulta
                            que tengas sobre nuestros productos o servicios.
                        </p>
                    </Col>
                </Row>
            </Container>

            
        </>


    );
};

export default ComoComprar;
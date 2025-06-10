import React from "react";
import { Container, Accordion, Card, ListGroup, Badge } from "react-bootstrap";
import { FaShieldAlt, FaExchangeAlt, FaUndo, FaFileInvoice, FaBoxOpen, FaEnvelope } from "react-icons/fa";
import NavbarTienda from "./NavbarTienda";

const Devoluciones = () => {


  return (

    <>
    <NavbarTienda />
    <Container className="my-5">
      <div className="text-center mb-5">
        <h1 className="fw-bold">Política de Devoluciones</h1>
        <p className="lead text-muted">Conoce nuestros términos para cambios, reembolsos y garantías</p>
      </div>

      {/* Sección de Garantías */}
      <Card className="mb-4 border-0 shadow-sm">
        <Card.Body>
          <div className="d-flex align-items-center mb-3">
            <FaShieldAlt className="text-primary me-3" size={28} />
            <h2 className="mb-0 fw-bold">Garantía de Productos</h2>
          </div>
          <p>
            Todos nuestros productos cuentan con garantía variable según cada artículo, emitida por distribuidores 
            y/o fabricantes oficiales del producto adquirido.
          </p>
          <div className="alert alert-info">
            <strong>Importante:</strong> Es indispensable contar con la factura oficial para hacer válida 
            cualquier garantía o devolución.
          </div>
        </Card.Body>
      </Card>

      {/* Acordeón de políticas */}
      <Accordion defaultActiveKey="0" className="mb-5">
        {/* Cambio de productos */}
        <Accordion.Item eventKey="0" className="mb-3 border-0 shadow-sm">
          <Accordion.Header className="fw-bold">
            <FaExchangeAlt className="text-primary me-2" /> Cambio de Productos
          </Accordion.Header>
          <Accordion.Body>
            <ListGroup variant="flush">
              <ListGroup.Item className="border-0 px-0">
                <Badge bg="primary" className="me-2">1</Badge>
                Plazo máximo de 30 días desde la compra para solicitar cambios
              </ListGroup.Item>
              <ListGroup.Item className="border-0 px-0">
                <Badge bg="primary" className="me-2">2</Badge>
                Debe presentarse ticket o factura de compra
              </ListGroup.Item>
              <ListGroup.Item className="border-0 px-0">
                <Badge bg="primary" className="me-2">3</Badge>
                Cambio por otro producto de menor valor: diferencia en dinero o nota de crédito (90 días)
              </ListGroup.Item>
              <ListGroup.Item className="border-0 px-0">
                <Badge bg="primary" className="me-2">4</Badge>
                Cambio por decisión del cliente: envío a cargo del cliente
              </ListGroup.Item>
              <ListGroup.Item className="border-0 px-0">
                <Badge bg="primary" className="me-2">5</Badge>
                Cambio por falla de fábrica: envío a cargo de la empresa
              </ListGroup.Item>
              <ListGroup.Item className="border-0 px-0">
                <Badge bg="primary" className="me-2">6</Badge>
                Productos comprados con descuento: cambio respetando valor facturado
              </ListGroup.Item>
            </ListGroup>
          </Accordion.Body>
        </Accordion.Item>

        {/* Devoluciones */}
        <Accordion.Item eventKey="1" className="mb-3 border-0 shadow-sm">
          <Accordion.Header className="fw-bold">
            <FaUndo className="text-primary me-2" /> Política de Devoluciones
          </Accordion.Header>
          <Accordion.Body>
            <h5 className="fw-bold">Condiciones generales:</h5>
            <ul className="mb-4">
              <li>Plazo máximo de 10 días corridos desde recepción/retiro</li>
              <li>Productos nuevos - sin usar - con todos sus componentes</li>
              <li>Presentación de factura y remito de entrega (si corresponde)</li>
            </ul>

            <div className="row">
              <div className="col-md-6">
                <Card className="h-100 border-0 bg-light">
                  <Card.Body>
                    <h6 className="fw-bold">Compras presenciales:</h6>
                    <p className="mb-0">
                      Solo se aceptan devoluciones por fallas que impidan el uso normal del producto.
                    </p>
                  </Card.Body>
                </Card>
              </div>
              <div className="col-md-6 mt-3 mt-md-0">
                <Card className="h-100 border-0 bg-light">
                  <Card.Body>
                    <h6 className="fw-bold">Compras online:</h6>
                    <p className="mb-0">
                      Revocación de compra posible dentro de los 10 días para productos nuevos sin usar.
                    </p>
                  </Card.Body>
                </Card>
              </div>
            </div>

            <div className="alert alert-warning mt-4">
              <FaBoxOpen className="me-2" />
              <strong>Recomendación:</strong> Revisar el paquete antes de firmar el remito. No se aceptan reclamos por daños estéticos una vez firmada la entrega.
            </div>
          </Accordion.Body>
        </Accordion.Item>

        {/* Proceso de devolución */}
        <Accordion.Item eventKey="2" className="border-0 shadow-sm">
          <Accordion.Header className="fw-bold">
            <FaEnvelope className="text-primary me-2" /> ¿Cómo solicitar un cambio o devolución?
          </Accordion.Header>
          <Accordion.Body>
            <h5 className="fw-bold mb-3">Seguí estos pasos:</h5>
            <div className="d-flex mb-3">
              <div className="me-3 text-primary fw-bold">1</div>
              <div>
                Enviar correo a <strong>info@MAIL.com.ar</strong> con:
                <ul className="mt-2">
                  <li>Producto a devolver/cambiar</li>
                  <li>Motivo detallado</li>
                  <li>Descripción de falla (si aplica)</li>
                  <li>Factura/ticket adjunto</li>
                  <li>Teléfono de contacto</li>
                  <li>Fotos del producto y caja (si hay daños)</li>
                </ul>
              </div>
            </div>
            <div className="d-flex mb-3">
              <div className="me-3 text-primary fw-bold">2</div>
              <div>
                Esperar nuestro contacto para coordinar la solución más adecuada
              </div>
            </div>
            <div className="d-flex">
              <div className="me-3 text-primary fw-bold">3</div>
              <div>
                Seguir las instrucciones proporcionadas para el envío o entrega del producto
              </div>
            </div>

            <Card className="mt-4 border-danger">
              <Card.Body className="text-danger">
                <strong>Nota:</strong> Productos que no cumplan con las condiciones establecidas no serán aceptados o serán devueltos a origen.
              </Card.Body>
            </Card>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>

      {/* Resumen de tiempos */}
      <Card className="border-0 shadow-sm">
        <Card.Body>
          <h3 className="fw-bold mb-4">Plazos importantes</h3>
          <div className="table-responsive">
            <table className="table">
              <thead className="table-light">
                <tr>
                  <th>Concepto</th>
                  <th>Plazo</th>
                  <th>Condiciones</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Cambio de producto</td>
                  <td>30 días</td>
                  <td>Con factura/ticket de compra</td>
                </tr>
                <tr>
                  <td>Devolución por arrepentimiento</td>
                  <td>10 días</td>
                  <td>Solo compras online, producto sin usar</td>
                </tr>
                <tr>
                  <td>Devolución por falla</td>
                  <td>Garantía del fabricante</td>
                  <td>Con factura y según términos de garantía</td>
                </tr>
                <tr>
                  <td>Nota de crédito</td>
                  <td>Válida por 90 días</td>
                  <td>Para compras con diferencia a favor</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card.Body>
      </Card>
    </Container>

    </>
    
  );
};

export default Devoluciones;
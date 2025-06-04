import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Row, Col } from 'react-bootstrap';

const CategorySlider = ({ category, products }) => {
  const navigate = useNavigate();

  return (
    <div className="mb-5">
      <h3 className="mb-3 text-capitalize">{category}</h3>
      <Row className="flex-nowrap overflow-auto">
        {products.map((product) => (
          <Col key={product._id} xs={8} sm={6} md={4} lg={3} className="px-2">
            <Card
              onClick={() => navigate(`/product/${product._id}`)}
              style={{ cursor: 'pointer' }}
            >
              <Card.Img
                variant="top"
                src={product.main_image}
                style={{ height: '200px', objectFit: 'cover' }}
              />
              <Card.Body>
                <Card.Title className="fs-6">{product.title}</Card.Title>
                <Card.Text>${product.price.toLocaleString()}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default CategorySlider;
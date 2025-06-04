import React, { useEffect, useState } from 'react';
import { Container, Spinner, Alert } from 'react-bootstrap';
import CategorySlider from './CategorySlider';
import NavbarTienda from './NavbarTienda';
import axios from 'axios';

const HomePage = () => {
  const [groupedProducts, setGroupedProducts] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('/api/products') 
      .then((res) => {
        const groupByCategory = {};
        res.data.forEach((product) => {
          const cat = product.category?.toLowerCase() || 'otros';
          if (!groupByCategory[cat]) groupByCategory[cat] = [];
          groupByCategory[cat].push(product);
        });
        setGroupedProducts(groupByCategory);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("No se pudieron cargar los productos");
        setLoading(false);
      });
  }, []);

  return (
    <>
    <NavbarTienda />

    <Container className="mt-5 pt-4">
      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" />
        </div>
      ) : error ? (
        <Alert variant="danger" className="text-center">
          {error}
        </Alert>
      ) : (
        Object.entries(groupedProducts).map(([category, products]) => (
          <CategorySlider key={category} category={category} products={products} />
        ))
      )}
    </Container>
    
    </>
    
  );
};

export default HomePage;
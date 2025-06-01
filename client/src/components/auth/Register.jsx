import React, { useState } from 'react';
import { Form, Button, Container, Row, Col, Card } from 'react-bootstrap';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { FiUserPlus } from 'react-icons/fi';
import Swal from 'sweetalert2';

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 1800,
  timerProgressBar: true
});

const Register = () => {
  const [formData, setFormData] = useState({
    username: '', 
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

  const validateEmail = (email) => {
    return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) newErrors.username = 'Nombre de usuario es requerido';
    else if (formData.username.length < 3) newErrors.username = 'Mínimo 3 caracteres';

    if (!formData.email.trim()) newErrors.email = 'Email es requerido';
    else if (!validateEmail(formData.email)) newErrors.email = 'Email inválido';

    if (!formData.password) newErrors.password = 'Contraseña es requerida';
    else if (formData.password.length < 6) newErrors.password = 'Mínimo 6 caracteres';

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      Toast.fire({
        icon: 'error',
        title: 'Validación',
        text: Object.values(newErrors).join('\n')
      });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const response = await axios.post('http://localhost:5005/auth/register', {
        username: formData.username,
        email: formData.email,
        password: formData.password
      });

      if (response.data && response.data.access_token) {
        // Guardar tokens y datos de usuario
        localStorage.setItem('token', response.data.access_token);
        localStorage.setItem('refresh_token', response.data.refresh_token);
        localStorage.setItem('user', JSON.stringify({
          id: response.data.user_id,
          username: formData.username,
          email: formData.email
        }));

        // Configurar axios para futuras peticiones
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.access_token}`;

        Toast.fire({
          icon: 'success',
          title: '¡Registro exitoso!',
          text: 'Tu cuenta ha sido creada correctamente.'
        });

        // Redirigir al dashboard después del registro
        setTimeout(() => {
          navigate('/dashboard');
        }, 1200);
      } else {
        throw new Error('Respuesta inesperada del servidor');
      }

    } catch (err) {
      let errorMessage = 'Error al registrar usuario';

      if (err.response) {
        if (err.response.status === 400) {
          errorMessage = err.response.data.error || 'Datos inválidos';
        } else if (err.response.status === 409) {
          errorMessage = err.response.data.error || 'El usuario o email ya está registrado';
        } else {
          errorMessage = `Error del servidor: ${err.response.status}`;
        }
      } else if (err.message) {
        errorMessage = err.message;
      }

      Toast.fire({
        icon: 'error',
        title: 'Error',
        text: errorMessage
      });

      // Limpiar datos en caso de error
      localStorage.removeItem('token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
      delete axios.defaults.headers.common['Authorization'];
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
      <Row className="w-100">
        <Col md={{ span: 6, offset: 3 }} lg={{ span: 4, offset: 4 }}>
          <Card className="shadow-sm border-0">
            <Card.Body className="p-4">
              <div className="text-center mb-4">
                <FiUserPlus size={32} className="text-primary mb-2" />
                <h2>Crear Cuenta</h2>
                <p className="text-muted">Regístrate para comenzar</p>
              </div>

              <Form onSubmit={handleSubmit} noValidate>
                <Form.Group className="mb-3">
                  <Form.Label>Nombre de Usuario</Form.Label>
                  <Form.Control
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    isInvalid={!!errors.username}
                    placeholder="Ej: juan123"
                    required
                    minLength="3"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.username}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    isInvalid={!!errors.email}
                    placeholder="tucorreo@ejemplo.com"
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.email}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Contraseña</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    isInvalid={!!errors.password}
                    placeholder="Mínimo 6 caracteres"
                    required
                    minLength="6"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.password}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>Confirmar Contraseña</Form.Label>
                  <Form.Control
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    isInvalid={!!errors.confirmPassword}
                    placeholder="Repite tu contraseña"
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.confirmPassword}
                  </Form.Control.Feedback>
                </Form.Group>

                <Button
                  variant="primary"
                  type="submit"
                  className="w-100 mb-3 py-2"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Registrando...
                    </>
                  ) : 'Crear Cuenta'}
                </Button>

                <div className="text-center mt-3">
                  <span className="text-muted">¿Ya tienes cuenta? </span>
                  <Link to="/login" className="text-decoration-none">
                    Inicia Sesión
                  </Link>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Register;
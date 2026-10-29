import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import Icon from '../common/Icon';
import { getApiUrl } from '../../config/api';

export default function LoginView({ onLoginSuccess, onNavigateToRegister }) {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm({
    defaultValues: {
      username: 'carlos_titan',
      password: 'password123'
    }
  });

  const handleSuccess = (user, institution) => {
    if (onLoginSuccess) {
      onLoginSuccess(user, institution);
    }
    navigate('/');
  };

  const onLoginSubmit = async (formData) => {
    setError(null);
    setLoading(true);

    try {
      const res = await fetch(getApiUrl('/api/auth/login'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Error al iniciar sesión');
      }

      handleSuccess(data.user, data.institution);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (user) => {
    setValue('username', user.username);
    setValue('password', user.hintPassword);
    setLoading(true);
    fetch(getApiUrl('/api/auth/login'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: user.username, password: user.hintPassword })
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) throw new Error(data.error);
        handleSuccess(data.user, data.institution);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  const ownerAccounts = [
    { username: 'carlos_titan', label: 'Gimnasio', name: 'Carlos Méndez', icon: 'building' },
    { username: 'marcela_pilates', label: 'Pilates', name: 'Marcela Rossi', icon: 'heart-pulse' },
    { username: 'esteban_yoga', label: 'Yoga', name: 'Esteban Varela', icon: 'sun' }
  ];

  const clientAccounts = [
    { username: 'mariano_cliente', label: 'Cliente', name: 'Mariano López', icon: 'person' },
    { username: 'valeria_cliente', label: 'Cliente', name: 'Valeria Montes', icon: 'person' },
    { username: 'lucas_cliente', label: 'Cliente', name: 'Lucas Herrera', icon: 'person' }
  ];

  const goToRegister = () => {
    if (onNavigateToRegister) {
      onNavigateToRegister();
    } else {
      navigate('/register');
    }
  };

  return (
    <div className="login-page d-flex align-items-center py-5 min-vh-100">
      <Container style={{ maxWidth: '820px' }}>
        <div className="login-box">
          <header className="app-window-top">
            <div className="d-flex align-items-baseline gap-2">
              <span className="brand-title">NexoFit</span>
              <span className="brand-subtitle d-none d-sm-inline">
                &bull; Portal de Acceso
              </span>
            </div>
            <span className="text-white small opacity-75">
              Red Deportiva Jujuy
            </span>
          </header>

          <Row className="g-0">
            <Col xs={12} md={5} className="bg-white d-flex flex-column border-end p-4 justify-content-center">
              {error && (
                <Alert variant="danger" className="p-2 mb-3 small">
                  <Icon name="exclamation-triangle-fill" className="me-2" />
                  {error}
                </Alert>
              )}

              <Form onSubmit={handleSubmit(onLoginSubmit)}>
                  <Form.Group className="mb-3" controlId="loginUsername">
                    <Form.Label className="small fw-bold mb-1">
                      Nombre de Usuario
                    </Form.Label>
                    <Form.Control
                      size="sm"
                      type="text"
                      placeholder="Ej. carlos_titan"
                      isInvalid={Boolean(errors.username)}
                      {...register('username', { required: 'Usuario requerido' })}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.username?.message}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="loginPassword">
                    <Form.Label className="small fw-bold mb-1">
                      Contraseña
                    </Form.Label>
                    <Form.Control
                      size="sm"
                      type="password"
                      isInvalid={Boolean(errors.password)}
                      {...register('password', { required: 'Contraseña requerida' })}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.password?.message}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Button
                    variant="primary"
                    size="sm"
                    type="submit"
                    className="w-100 py-2 mt-2"
                    disabled={loading}
                  >
                    <Icon name="box-arrow-in-right" className="me-1" />
                    {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                  </Button>

                  <div className="text-center mt-3 pt-2 border-top">
                    <span className="small text-muted me-1">¿No tienes cuenta?</span>
                    <Button
                      variant="link"
                      className="p-0 small text-decoration-none fw-bold"
                      onClick={goToRegister}
                    >
                      Regístrate gratis
                    </Button>
                  </div>
                </Form>
            </Col>

            <Col xs={12} md={7} className="bg-white p-4 d-flex flex-column justify-content-center">
              <div className="mb-3">
                <div className="small fw-bold text-uppercase mb-2 text-primary">
                  Cuentas Dueño
                </div>
                <Row className="g-2">
                  {ownerAccounts.map((item) => (
                    <Col xs={4} key={item.username}>
                      <Button
                        variant="light"
                        className="w-100 p-2 text-center border h-100 d-flex flex-column align-items-center justify-content-center"
                        onClick={() => handleQuickLogin({ username: item.username, hintPassword: 'password123' })}
                        title={`Ingresar como ${item.name}`}
                      >
                        <Icon name={item.icon} className="text-primary mb-1 fs-5" />
                        <div className="fw-bold small text-truncate w-100">{item.label}</div>
                        <div className="text-muted text-truncate w-100 small">{item.name}</div>
                      </Button>
                    </Col>
                  ))}
                </Row>
              </div>

              <div>
                <div className="small fw-bold text-success text-uppercase mb-2">
                  Cuentas Cliente
                </div>
                <Row className="g-2">
                  {clientAccounts.map((item) => (
                    <Col xs={4} key={item.username}>
                      <Button
                        variant="light"
                        className="w-100 p-2 text-center border h-100 d-flex flex-column align-items-center justify-content-center"
                        onClick={() => handleQuickLogin({ username: item.username, hintPassword: 'password123' })}
                        title={`Ingresar como ${item.name}`}
                      >
                        <Icon name={item.icon} className="text-success mb-1 fs-5" />
                        <div className="fw-bold small text-truncate w-100">{item.label}</div>
                        <div className="text-muted text-truncate w-100 small">{item.name}</div>
                      </Button>
                    </Col>
                  ))}
                </Row>
              </div>
            </Col>
          </Row>
        </div>
      </Container>
    </div>
  );
}

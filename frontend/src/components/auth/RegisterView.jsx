import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import Icon from '../common/Icon';
import { getApiUrl } from '../../config/api';

export default function RegisterView({ onRegisterSuccess, onNavigateToLogin }) {
  const navigate = useNavigate();
  const [role, setRole] = useState('CLIENT');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
      category: 'Gimnasio',
      neighborhood: 'Centro',
      preferredShift: 'Noche',
      institutionNeighborhood: 'Centro',
      institutionSchedule: 'Lun a Vie 07:00 a 23:00 | Sáb 09:00 a 18:00',
      institutionShifts: 'Jornada Completa'
    }
  });

  const onRegisterSubmit = async (formData) => {
    setError(null);
    setLoading(true);

    const payload = {
      role,
      name: formData.name,
      username: formData.username,
      password: formData.password,
      email: formData.email,
      phone: formData.phone,
      termsAccepted: Boolean(formData.termsAccepted)
    };

    if (role === 'CLIENT') {
      payload.dni = formData.dni;
      payload.neighborhood = formData.neighborhood || 'Centro';
      payload.preferredShift = formData.preferredShift || 'Noche';
    } else {
      const shiftsMap = {
        'Jornada Completa': ['Mañana', 'Tarde', 'Noche'],
        'Diurno': ['Mañana', 'Tarde'],
        'Tarde y Noche': ['Tarde', 'Noche'],
        'Nocturno': ['Noche']
      };
      payload.institutionData = {
        name: formData.institutionName,
        category: formData.category,
        address: formData.address,
        neighborhood: formData.institutionNeighborhood || 'Centro',
        schedule: formData.institutionSchedule || 'Lun a Vie 07:00 a 23:00',
        shifts: shiftsMap[formData.institutionShifts] || ['Mañana', 'Tarde', 'Noche'],
        phone: formData.institutionPhone || formData.phone,
        tagline: formData.tagline
      };
    }

    try {
      const res = await fetch(getApiUrl('/api/auth/register'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Error al procesar el registro.');
      }

      if (onRegisterSuccess) {
        onRegisterSuccess(data.user, data.institution);
      }
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const goToLogin = () => {
    if (onNavigateToLogin) {
      onNavigateToLogin();
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="login-page py-5 min-vh-100 d-flex align-items-center">
      <Container style={{ maxWidth: '680px' }}>
        <div className="login-box">
          <header className="app-window-top">
            <div className="d-flex align-items-baseline gap-2">
              <span className="brand-title">NexoFit</span>
              <span className="brand-subtitle d-none d-sm-inline">
                &bull; Registro Unificado de Cuenta
              </span>
            </div>
            <span className="text-white small opacity-75">
              Alta Gratuita
            </span>
          </header>

          <div className="p-4 bg-white">
            <div className="mb-3 text-center">
              <span className="small text-muted d-block mb-2 fw-bold text-uppercase">
                Selecciona tu tipo de cuenta gratuita
              </span>
              <ButtonGroup className="w-100">
                <Button
                  size="sm"
                  variant={role === 'CLIENT' ? 'primary' : 'outline-primary'}
                  onClick={() => {
                    setRole('CLIENT');
                    setError(null);
                  }}
                >
                  <Icon name="person-fill" className="me-1" />
                  Deportista / Cliente
                </Button>
                <Button
                  size="sm"
                  variant={role === 'OWNER' ? 'primary' : 'outline-primary'}
                  onClick={() => {
                    setRole('OWNER');
                    setError(null);
                  }}
                >
                  <Icon name="building" className="me-1" />
                  Dueño de Centro Deportivo
                </Button>
              </ButtonGroup>
            </div>

            {error && (
              <Alert variant="danger" className="p-2 mb-3 small">
                <Icon name="exclamation-triangle-fill" className="me-2" />
                {error}
              </Alert>
            )}

            <Form onSubmit={handleSubmit(onRegisterSubmit)}>
              <Row className="g-2 mb-2">
                <Col xs={12} md={6}>
                  <Form.Group controlId="registerName">
                    <Form.Label className="small fw-bold mb-1">
                      {role === 'OWNER' ? 'Nombre del Titular' : 'Nombre Completo'} *
                    </Form.Label>
                    <Form.Control
                      size="sm"
                      type="text"
                      placeholder="Ej. Lucas Herrera"
                      isInvalid={Boolean(errors.name)}
                      {...register('name', { required: 'Nombre requerido' })}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.name?.message}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>

                <Col xs={12} md={6}>
                  <Form.Group controlId="registerUsername">
                    <Form.Label className="small fw-bold mb-1">
                      Nombre de Usuario *
                    </Form.Label>
                    <Form.Control
                      size="sm"
                      type="text"
                      placeholder="Ej. lucas_herrera"
                      isInvalid={Boolean(errors.username)}
                      {...register('username', { required: 'Usuario requerido' })}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.username?.message}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>

              <Row className="g-2 mb-2">
                <Col xs={12} md={6}>
                  <Form.Group controlId="registerPassword">
                    <Form.Label className="small fw-bold mb-1">
                      Contraseña *
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
                </Col>

                <Col xs={12} md={6}>
                  <Form.Group controlId="registerEmail">
                    <Form.Label className="small fw-bold mb-1">
                      Email de Contacto
                    </Form.Label>
                    <Form.Control
                      size="sm"
                      type="email"
                      placeholder="nombre@ejemplo.com"
                      {...register('email')}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row className="g-2 mb-3">
                <Col xs={12} md={6}>
                  <Form.Group controlId="registerPhone">
                    <Form.Label className="small fw-bold mb-1">
                      Teléfono
                    </Form.Label>
                    <Form.Control
                      size="sm"
                      type="text"
                      placeholder="388-412-3456"
                      {...register('phone')}
                    />
                  </Form.Group>
                </Col>

                {role === 'CLIENT' && (
                  <Col xs={12} md={6}>
                    <Form.Group controlId="registerDni">
                      <Form.Label className="small fw-bold mb-1">
                        DNI (Documento) *
                      </Form.Label>
                      <Form.Control
                        size="sm"
                        type="text"
                        placeholder="38.123.456"
                        isInvalid={Boolean(errors.dni)}
                        {...register('dni', { required: 'DNI requerido' })}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.dni?.message}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                )}
              </Row>

              {role === 'CLIENT' && (
                <Row className="g-2 mb-3">
                  <Col xs={12} md={6}>
                    <Form.Group controlId="clientNeighborhood">
                      <Form.Label className="small fw-bold mb-1">
                        Barrio de Residencia *
                      </Form.Label>
                      <Form.Select size="sm" {...register('neighborhood')}>
                        <option value="Centro">Centro</option>
                        <option value="Los Perales">Los Perales</option>
                        <option value="Alto Comedero">Alto Comedero</option>
                        <option value="Ciudad de Nieva">Ciudad de Nieva</option>
                        <option value="Cuyaya">Cuyaya</option>
                        <option value="San Pedrito">San Pedrito</option>
                        <option value="Bajo La Viña">Bajo La Viña</option>
                        <option value="Chijra">Chijra</option>
                        <option value="Coronel Arias">Coronel Arias</option>
                        <option value="Gorriti">Gorriti</option>
                        <option value="Huaico">Huaico</option>
                        <option value="Moreno">Moreno</option>
                        <option value="Santa Rosa">Santa Rosa</option>
                        <option value="Reyes">Reyes</option>
                        <option value="Mariano Moreno">Mariano Moreno</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col xs={12} md={6}>
                    <Form.Group controlId="clientPreferredShift">
                      <Form.Label className="small fw-bold mb-1">
                        Horario Habitual de Entrenamiento *
                      </Form.Label>
                      <Form.Select size="sm" {...register('preferredShift')}>
                        <option value="Noche">Turno Noche (18:00 a 23:00 / Post-laboral)</option>
                        <option value="Tarde">Turno Tarde (12:00 a 18:00)</option>
                        <option value="Mañana">Turno Mañana (07:00 a 12:00)</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>
              )}

              {role === 'OWNER' && (
                <div className="p-3 mb-3 bg-light border rounded-2">
                  <div className="small fw-bold text-uppercase mb-2 text-primary">
                    <Icon name="geo-alt-fill" className="me-1" />
                    Datos del Centro Deportivo
                  </div>

                  <Row className="g-2 mb-2">
                    <Col xs={12} md={8}>
                      <Form.Group controlId="instName">
                        <Form.Label className="small fw-bold mb-1">
                          Nombre de la Institución / Sede *
                        </Form.Label>
                        <Form.Control
                          size="sm"
                          type="text"
                          placeholder="Ej. Gimnasio Spartak Fitness"
                          isInvalid={Boolean(errors.institutionName)}
                          {...register('institutionName', { required: 'Nombre de sede requerido' })}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.institutionName?.message}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>

                    <Col xs={12} md={4}>
                      <Form.Group controlId="instCat">
                        <Form.Label className="small fw-bold mb-1">
                          Disciplina *
                        </Form.Label>
                        <Form.Select size="sm" {...register('category')}>
                          <option value="Gimnasio">Gimnasio / Musculación</option>
                          <option value="Pilates">Pilates / Reformer</option>
                          <option value="Yoga">Yoga / Meditación</option>
                          <option value="CrossFit">CrossFit / Funcional</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row className="g-2 mb-2">
                    <Col xs={12} md={7}>
                      <Form.Group controlId="instAddress">
                        <Form.Label className="small fw-bold mb-1">
                          Dirección de la Sede *
                        </Form.Label>
                        <Form.Control
                          size="sm"
                          type="text"
                          placeholder="Av. Fascio 850"
                          isInvalid={Boolean(errors.address)}
                          {...register('address', { required: 'Dirección requerida' })}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.address?.message}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>

                    <Col xs={12} md={5}>
                      <Form.Group controlId="instNeighborhood">
                        <Form.Label className="small fw-bold mb-1">
                          Barrio de la Sede *
                        </Form.Label>
                        <Form.Select size="sm" {...register('institutionNeighborhood')}>
                          <option value="Centro">Centro</option>
                          <option value="Los Perales">Los Perales</option>
                          <option value="Alto Comedero">Alto Comedero</option>
                          <option value="Ciudad de Nieva">Ciudad de Nieva</option>
                          <option value="Cuyaya">Cuyaya</option>
                          <option value="San Pedrito">San Pedrito</option>
                          <option value="Bajo La Viña">Bajo La Viña</option>
                          <option value="Chijra">Chijra</option>
                          <option value="Coronel Arias">Coronel Arias</option>
                          <option value="Gorriti">Gorriti</option>
                          <option value="Huaico">Huaico</option>
                          <option value="Moreno">Moreno</option>
                          <option value="Santa Rosa">Santa Rosa</option>
                          <option value="Reyes">Reyes</option>
                          <option value="Mariano Moreno">Mariano Moreno</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row className="g-2 mb-2">
                    <Col xs={12} md={6}>
                      <Form.Group controlId="instSchedule">
                        <Form.Label className="small fw-bold mb-1">
                          Horario de Atención
                        </Form.Label>
                        <Form.Control
                          size="sm"
                          type="text"
                          placeholder="Lun a Vie 07:00 a 23:00"
                          {...register('institutionSchedule')}
                        />
                      </Form.Group>
                    </Col>

                    <Col xs={12} md={6}>
                      <Form.Group controlId="instShifts">
                        <Form.Label className="small fw-bold mb-1">
                          Turnos que Cubre la Sede
                        </Form.Label>
                        <Form.Select size="sm" {...register('institutionShifts')}>
                          <option value="Jornada Completa">Jornada Completa (Mañana, Tarde y Noche)</option>
                          <option value="Diurno">Diurno (Mañana y Tarde)</option>
                          <option value="Tarde y Noche">Vespertino / Nocturno (Tarde y Noche)</option>
                          <option value="Nocturno">Exclusivo Nocturno (Noche)</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row className="g-2 mb-2">
                    <Col xs={12} md={6}>
                      <Form.Group controlId="instPhone">
                        <Form.Label className="small fw-bold mb-1">
                          Teléfono de la Sede
                        </Form.Label>
                        <Form.Control
                          size="sm"
                          type="text"
                          placeholder="+54 388 423-8800"
                          {...register('institutionPhone')}
                        />
                      </Form.Group>
                    </Col>

                    <Col xs={12} md={6}>
                      <Form.Group controlId="instTagline">
                        <Form.Label className="small fw-bold mb-1">
                          Lema o Descripción Breve
                        </Form.Label>
                        <Form.Control
                          size="sm"
                          type="text"
                          placeholder="Equipamiento moderno y clases guiadas."
                          {...register('tagline')}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                </div>
              )}

              {role === 'CLIENT' ? (
                <Alert variant="info" className="p-2 small mb-3">
                  <strong>Términos del Usuario Gratuito:</strong> Tu cuenta es 100% gratuita para explorar sedes y matricularte. Al registrarte voluntariamente, aceptas la visualización de publicidades comerciales incrustadas en el sitio web como contraprestación para el sostenimiento de la plataforma, tal como en otros sitios contemporáneos.
                </Alert>
              ) : (
                <Alert variant="info" className="p-2 small mb-3">
                  <strong>Términos del Centro Adherido:</strong> El alta de tu institución es voluntaria y sin costos fijos ni contratos notariales tradicionales. Al registrarte, aceptas que NexoFit retenga una comisión base del 8% (con ajuste dinámico progresivo según el volumen activo de socios de la sede) únicamente sobre los aranceles de los socios matriculados a través de NexoFit. Las cuotas cobradas en mostrador directo no devengan comisión directa.
                </Alert>
              )}

              <Form.Group className="mb-3" controlId="termsCheckbox">
                <Form.Check
                  type="checkbox"
                  className="small"
                  isInvalid={Boolean(errors.termsAccepted)}
                  label={
                    role === 'CLIENT'
                      ? 'He leído y acepto los Términos y Condiciones de NexoFit (servicio gratuito con visualización de publicidades incrustadas en la plataforma).'
                      : 'He leído y acepto los Términos y Condiciones de NexoFit (alta voluntaria de centro con cobro de comisión base del 8% y escala dinámica progresiva por suscripciones vía web).'
                  }
                  {...register('termsAccepted', { required: 'Debe aceptar los términos' })}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.termsAccepted?.message}
                </Form.Control.Feedback>
              </Form.Group>

              <Button
                variant="primary"
                size="sm"
                type="submit"
                className="w-100 py-2"
                disabled={loading}
              >
                <Icon name="check-circle" className="me-1" />
                {loading ? 'Creando cuenta...' : 'Crear Cuenta Gratuita'}
              </Button>

              <div className="text-center mt-3 pt-2 border-top">
                <span className="small text-muted me-1">¿Ya tienes una cuenta registrada?</span>
                <Button
                  variant="link"
                  className="p-0 small text-decoration-none fw-bold"
                  onClick={goToLogin}
                >
                  Iniciar Sesión
                </Button>
              </div>
            </Form>
          </div>
        </div>
      </Container>
    </div>
  );
}

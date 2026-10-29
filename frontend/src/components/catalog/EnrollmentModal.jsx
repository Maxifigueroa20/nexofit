import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Alert from 'react-bootstrap/Alert';
import Icon from '../common/Icon';

export default function EnrollmentModal({
  isOpen,
  onClose,
  institution,
  initialPlan,
  initialUser,
  onSubmit
}) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors }
  } = useForm();

  useEffect(() => {
    if (institution && isOpen) {
      const plan = initialPlan || institution.plans?.[0];
      reset({
        fullName: initialUser?.name || '',
        dni: initialUser?.dni || '',
        phone: initialUser?.phone || '',
        email: initialUser?.email || '',
        planName: plan ? plan.name : '',
        monthlyAmount: plan ? plan.price : 20000
      });
    }
  }, [institution, initialPlan, initialUser, isOpen, reset]);

  if (!institution) return null;

  const onFormSubmit = (data) => {
    onSubmit(institution.id, {
      ...data,
      source: 'NexoFit (Web Captación)',
      notes: 'Inscripción online mediante NexoFit.'
    });
  };

  return (
    <Modal show={Boolean(isOpen)} onHide={onClose} centered>
      <Form onSubmit={handleSubmit(onFormSubmit)}>
        <Modal.Header closeButton>
          <Modal.Title className="fs-6 fw-bold">
            Afiliación a {institution.name}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Alert variant="light" className="p-2 mb-3 small border">
            <Icon name="info-circle-fill" className="me-2 text-primary" />
            Tu solicitud se enviará directamente a la administración de{' '}
            <strong>{institution.name}</strong> a través de <strong>NexoFit</strong>.
          </Alert>

          <Form.Group className="mb-2" controlId="enrollmentFullName">
            <Form.Label className="small fw-bold mb-1">
              Nombre y Apellido Completo *
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="Ej. Valeria Montes"
              isInvalid={Boolean(errors.fullName)}
              {...register('fullName', { required: 'Nombre y apellido requerido' })}
            />
            <Form.Control.Feedback type="invalid">
              {errors.fullName?.message}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-2" controlId="enrollmentDni">
            <Form.Label className="small fw-bold mb-1">
              Documento Nacional de Identidad (DNI) *
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="Ej. 39.400.128"
              isInvalid={Boolean(errors.dni)}
              {...register('dni', { required: 'DNI requerido' })}
            />
            <Form.Control.Feedback type="invalid">
              {errors.dni?.message}
            </Form.Control.Feedback>
          </Form.Group>

          <Row className="g-2 mb-2">
            <Col xs={6}>
              <Form.Group controlId="enrollmentPhone">
                <Form.Label className="small fw-bold mb-1">
                  Teléfono Celular *
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="388-423-4567"
                  isInvalid={Boolean(errors.phone)}
                  {...register('phone', { required: 'Teléfono requerido' })}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.phone?.message}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

            <Col xs={6}>
              <Form.Group controlId="enrollmentEmail">
                <Form.Label className="small fw-bold mb-1">
                  Correo Electrónico *
                </Form.Label>
                <Form.Control
                  type="email"
                  placeholder="valeria@gmail.com"
                  isInvalid={Boolean(errors.email)}
                  {...register('email', { required: 'Correo requerido' })}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.email?.message}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-2" controlId="enrollmentPlan">
            <Form.Label className="small fw-bold mb-1">
              Plan / Membresía Seleccionada *
            </Form.Label>
            <Form.Select
              {...register('planName')}
              onChange={(e) => {
                const p = institution.plans?.find((x) => x.name === e.target.value);
                setValue('planName', e.target.value);
                if (p) setValue('monthlyAmount', p.price);
              }}
            >
              {institution.plans?.map((p) => (
                <option key={p.id} value={p.name}>
                  {p.name} - ${p.price.toLocaleString('es-AR')} / {p.period}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="light" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="success" type="submit">
            <Icon name="check-lg" className="me-1" />
            Confirmar Solicitud
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

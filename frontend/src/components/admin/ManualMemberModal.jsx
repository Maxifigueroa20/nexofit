import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Icon from '../common/Icon';

export default function ManualMemberModal({
  isOpen,
  onClose,
  institution,
  onSubmit
}) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors }
  } = useForm({
    defaultValues: {
      fullName: '',
      dni: '',
      phone: '',
      email: '',
      planName: institution?.plans?.[0]?.name || 'Pase Estándar',
      monthlyAmount: institution?.plans?.[0]?.price || 20000,
      source: 'Directo (Mostrador)',
      notes: 'Inscripción manual en mostrador de la sede.'
    }
  });

  useEffect(() => {
    if (isOpen) {
      reset({
        fullName: '',
        dni: '',
        phone: '',
        email: '',
        planName: institution?.plans?.[0]?.name || 'Pase Estándar',
        monthlyAmount: institution?.plans?.[0]?.price || 20000,
        source: 'Directo (Mostrador)',
        notes: 'Inscripción manual en mostrador de la sede.'
      });
    }
  }, [isOpen, institution, reset]);

  const onFormSubmit = (data) => {
    onSubmit(data);
  };

  if (!institution) return null;

  return (
    <Modal show={Boolean(isOpen)} onHide={onClose} centered>
      <Form onSubmit={handleSubmit(onFormSubmit)}>
        <Modal.Header closeButton>
          <Modal.Title className="fs-6 fw-bold">
            Alta de Socio en Mostrador - {institution.name}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form.Group className="mb-2" controlId="manualMemberFullName">
            <Form.Label className="small fw-bold mb-1">
              Nombre y Apellido Completo *
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="Ej. Lucas Daniel Herrera"
              isInvalid={Boolean(errors.fullName)}
              {...register('fullName', { required: 'Nombre y apellido requerido' })}
            />
            <Form.Control.Feedback type="invalid">
              {errors.fullName?.message}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-2" controlId="manualMemberDni">
            <Form.Label className="small fw-bold mb-1">
              Documento de Identidad (DNI) *
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="Ej. 37.890.123"
              isInvalid={Boolean(errors.dni)}
              {...register('dni', { required: 'DNI requerido' })}
            />
            <Form.Control.Feedback type="invalid">
              {errors.dni?.message}
            </Form.Control.Feedback>
          </Form.Group>

          <Row className="g-2 mb-2">
            <Col xs={6}>
              <Form.Group controlId="manualMemberPhone">
                <Form.Label className="small fw-bold mb-1">
                  Teléfono de Contacto
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Ej. 388-412-3456"
                  {...register('phone')}
                />
              </Form.Group>
            </Col>
            <Col xs={6}>
              <Form.Group controlId="manualMemberEmail">
                <Form.Label className="small fw-bold mb-1">
                  Correo Electrónico
                </Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Ej. lucas@gmail.com"
                  {...register('email')}
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-2" controlId="manualMemberPlan">
            <Form.Label className="small fw-bold mb-1">
              Plan / Membresía Seleccionada *
            </Form.Label>
            <Form.Select
              {...register('planName')}
              onChange={(e) => {
                const plan = institution.plans.find((p) => p.name === e.target.value);
                setValue('planName', e.target.value);
                if (plan) setValue('monthlyAmount', plan.price);
              }}
            >
              {institution.plans.map((p) => (
                <option key={p.id} value={p.name}>
                  {p.name} - ${p.price.toLocaleString('es-AR')} / {p.period}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-2" controlId="manualMemberNotes">
            <Form.Label className="small fw-bold mb-1">
              Observaciones de Recepción
            </Form.Label>
            <Form.Control
              type="text"
              {...register('notes')}
            />
          </Form.Group>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="light" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="primary" type="submit">
            <Icon name="check-lg" className="me-1" />
            Confirmar Alta y Guardar
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

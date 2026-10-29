import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Badge from 'react-bootstrap/Badge';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

export default function EnrollmentModal({
  isOpen,
  onClose,
  institution,
  currentUser,
  isEnrolled,
  onSubmit
}) {
  const [selectedPlanId, setSelectedPlanId] = useState(null);

  if (!institution) return null;

  const plans = institution.plans || [];
  const selectedPlan = plans.find((p) => p.id === selectedPlanId) || plans[0] || null;

  const handleConfirm = () => {
    if (!selectedPlan) return;
    onSubmit(institution.id, {
      fullName: currentUser?.name || 'Deportista NexoFit',
      dni: currentUser?.dni || 'S/D',
      phone: currentUser?.phone || 'S/D',
      email: currentUser?.email || 'S/D',
      planName: selectedPlan.name,
      monthlyAmount: selectedPlan.price,
      source: 'NexoFit (Web Captación)',
      notes: 'Inscripción online directa desde catálogo.'
    });
  };

  return (
    <Modal
      show={Boolean(isOpen)}
      onHide={onClose}
      centered
      size="lg"
      aria-labelledby="institution-modal-title"
    >
      <Modal.Header closeButton className="py-2 px-3">
        <Modal.Title id="institution-modal-title" className="fs-6 fw-bold text-white d-flex align-items-center gap-2">
          <span>{institution.name}</span>
          {institution.isPremium && (
            <Badge bg="warning" text="dark" className="fw-semibold">
              Destacado
            </Badge>
          )}
          <Badge bg="secondary" className="fw-normal">
            {institution.category}
          </Badge>
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="p-3">
        <p className="text-secondary fst-italic mb-3">
          "{institution.tagline}"
        </p>

        <div className="bg-light border rounded-1 p-3 mb-3">
          <Row className="g-2 small">
            <Col xs={12} sm={6}>
              <div className="text-muted text-uppercase fw-semibold" style={{ fontSize: '11px' }}>
                Ubicación
              </div>
              <div className="text-dark fw-medium">
                {institution.neighborhood ? `${institution.neighborhood} • ` : ''}{institution.address}
              </div>
            </Col>
            <Col xs={12} sm={6}>
              <div className="text-muted text-uppercase fw-semibold" style={{ fontSize: '11px' }}>
                Contacto Directo
              </div>
              <div className="text-dark fw-medium">
                {institution.phone}
              </div>
            </Col>
            <Col xs={12} sm={6}>
              <div className="text-muted text-uppercase fw-semibold" style={{ fontSize: '11px' }}>
                Horario de Atención
              </div>
              <div className="text-dark fw-medium">
                {institution.schedule || 'Lun a Vie 08:00 a 22:00'}
              </div>
            </Col>
            <Col xs={12} sm={6}>
              <div className="text-muted text-uppercase fw-semibold" style={{ fontSize: '11px' }}>
                Turnos Disponibles
              </div>
              <div className="d-flex gap-1 flex-wrap mt-1">
                {Array.isArray(institution.shifts) && institution.shifts.map((shift) => (
                  <Badge key={shift} bg="light" text="dark" className="border fw-normal">
                    {shift}
                  </Badge>
                ))}
              </div>
            </Col>
          </Row>
        </div>

        <fieldset className="mb-2">
          <legend id="plan-selector-legend" className="fs-6 fw-semibold text-dark mb-2">
            Planes y aranceles disponibles
          </legend>

          <div
            className="d-flex flex-column gap-2"
            role="radiogroup"
            aria-labelledby="plan-selector-legend"
          >
            {plans.map((plan) => {
              const isSelected = selectedPlan?.id === plan.id;
              const inputId = `plan-radio-${institution.id}-${plan.id}`;

              return (
                <div key={plan.id} className="position-relative">
                  <input
                    type="radio"
                    className="btn-check"
                    name={`plan-selection-${institution.id}`}
                    id={inputId}
                    autoComplete="off"
                    checked={isSelected}
                    onChange={() => setSelectedPlanId(plan.id)}
                  />
                  <label
                    htmlFor={inputId}
                    className={`btn text-start w-100 p-3 border rounded-2 d-flex justify-content-between align-items-center ${
                      isSelected
                        ? 'border-primary bg-primary-subtle text-dark shadow-sm'
                        : 'border-secondary-subtle bg-white text-dark'
                    }`}
                  >
                    <div>
                      <div className="fw-semibold fs-6 text-dark">{plan.name}</div>
                      <div className="small text-secondary mt-1">
                        {plan.desc || 'Acceso completo a instalaciones y equipamiento.'}
                      </div>
                    </div>
                    <div className="text-end ps-3">
                      <div className="fw-bold fs-6 text-primary">
                        ${plan.price.toLocaleString('es-AR')}
                      </div>
                      <span className="small text-muted text-uppercase" style={{ fontSize: '11px' }}>
                        {plan.period}
                      </span>
                    </div>
                  </label>
                </div>
              );
            })}
          </div>
        </fieldset>
      </Modal.Body>

      <Modal.Footer className="d-flex justify-content-between align-items-center py-2 px-3">
        <Button variant="light" size="sm" onClick={onClose}>
          Cerrar
        </Button>
        <Button
          variant="primary"
          size="sm"
          disabled={isEnrolled || !selectedPlan}
          onClick={handleConfirm}
        >
          {isEnrolled ? 'Ya matriculado' : 'Asociarme'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

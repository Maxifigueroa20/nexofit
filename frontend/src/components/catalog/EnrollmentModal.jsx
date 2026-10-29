import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Badge from 'react-bootstrap/Badge';
import Card from 'react-bootstrap/Card';
import Icon from '../common/Icon';

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

  const selectedPlan = institution.plans?.find((p) => p.id === selectedPlanId) || institution.plans?.[0] || null;

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
    <Modal show={Boolean(isOpen)} onHide={onClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title className="fs-6 fw-bold text-white d-flex align-items-center gap-2">
          {institution.isPremium && <Icon name="star-fill" className="text-warning" />}
          {institution.name} &bull; Perfil y Afiliación
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="p-3">
        <p className="small text-muted fst-italic mb-3">
          "{institution.tagline}"
        </p>

        <Card className="p-2 mb-3 small bg-light border rounded-1">
          <div className="d-flex justify-content-between align-items-center mb-1 flex-wrap gap-1">
            <div>
              <Icon name="geo-alt-fill" className="text-primary me-1" />
              <strong>Sede:</strong> {institution.neighborhood ? `${institution.neighborhood} • ` : ''}{institution.address}
            </div>
            <Badge bg="secondary">{institution.category}</Badge>
          </div>
          <div className="mb-1">
            <Icon name="clock-fill" className="text-muted me-1" />
            <strong>Horarios:</strong> {institution.schedule || 'Lun a Vie 08:00 a 22:00'}
          </div>
          <div className="d-flex align-items-center gap-1 mb-1 flex-wrap">
            <strong className="text-muted">Turnos disponibles:</strong>
            {Array.isArray(institution.shifts) && institution.shifts.map((s) => (
              <Badge key={s} bg="light" text="dark" className="border">
                {s}
              </Badge>
            ))}
          </div>
          <div>
            <strong>Contacto:</strong> {institution.phone} &bull; <strong>Comunidad:</strong> {institution.stats?.totalMembers || 0} socios
          </div>
        </Card>

        <div className="mb-3">
          <div className="small fw-bold text-primary mb-2">
            Seleccionar Plan de Entrenamiento:
          </div>
          <div className="d-flex flex-column gap-2">
            {institution.plans?.map((plan) => {
              const isSelected = selectedPlan?.id === plan.id;
              return (
                <Button
                  key={plan.id}
                  type="button"
                  variant={isSelected ? 'primary' : 'light'}
                  className={`text-start p-2 border ${isSelected ? 'border-primary shadow-sm' : ''}`}
                  onClick={() => setSelectedPlanId(plan.id)}
                >
                  <div className="d-flex justify-content-between align-items-center">
                    <strong>{plan.name}</strong>
                    <span className={`badge ${isSelected ? 'bg-warning text-dark' : 'bg-success'}`}>
                      ${plan.price.toLocaleString('es-AR')} / {plan.period}
                    </span>
                  </div>
                  <div className="small opacity-75 mt-1">
                    {plan.desc || 'Acceso completo a instalaciones.'}
                  </div>
                </Button>
              );
            })}
          </div>
        </div>

        <div className="p-2 bg-light border rounded-1 small">
          <div className="fw-bold text-secondary mb-1">
            <Icon name="person-check-fill" className="text-primary me-1" />
            Matriculación Automática:
          </div>
          <div className="text-muted">
            <strong>Titular:</strong> {currentUser?.name} &bull; <strong>DNI:</strong> {currentUser?.dni || 'S/D'} &bull; <strong>Email:</strong> {currentUser?.email || 'S/D'}
          </div>
        </div>
      </Modal.Body>

      <Modal.Footer className="d-flex justify-content-between align-items-center">
        <Button variant="light" size="sm" onClick={onClose}>
          Cerrar
        </Button>
        <Button
          variant="success"
          size="sm"
          disabled={isEnrolled || !selectedPlan}
          onClick={handleConfirm}
        >
          <Icon name="check-lg" className="me-1" />
          {isEnrolled ? 'Ya estás matriculado' : `Asociarme con ${selectedPlan?.name || 'este plan'}`}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

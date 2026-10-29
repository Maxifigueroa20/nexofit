import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import Icon from '../common/Icon';
import { getApiUrl } from '../../config/api';

export default function PremiumModal({
  isOpen,
  onClose,
  institution,
  onPremiumActivated
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!institution) return null;

  const isAlreadyPremium = Boolean(institution.isPremium);

  const handleConfirm = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(getApiUrl(`/api/institutions/${institution.id}/premium`), {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'No se pudo actualizar el estado Premium');
      }

      const updated = await res.json();
      onPremiumActivated(updated);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      show={Boolean(isOpen)}
      onHide={onClose}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>
          Suscripción Premium &bull; {institution.name}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {error && (
          <Alert variant="danger" className="p-2 mb-3">
            <Icon name="exclamation-triangle-fill" className="me-2" />
            {error}
          </Alert>
        )}

        <div className="mb-3">
          <p className="mb-2">
            La <strong>Suscripción Premium</strong> posiciona a tu sede deportiva de manera destacada en la red NexoFit.
          </p>
          <div className="p-2 bg-light border">
            <div className="fw-bold mb-1 text-primary">Beneficios para tu centro:</div>
            <ul className="mb-0 ps-3">
              <li><strong>Puesto #1 en el Directorio:</strong> Tu sede encabeza la grilla de búsqueda de centros deportivos en Jujuy.</li>
              <li><strong>Distintivo de Sede Destacada:</strong> Insignia de reconocimiento visible para todos los deportistas.</li>
              <li><strong>Prioridad de captación:</strong> Mayor visibilidad orgánica en los resultados por barrio y disciplina.</li>
            </ul>
          </div>
        </div>

        <div className="text-muted small">
          Modalidad opcional con renovación mensual gestionada de forma automática.
        </div>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="light" size="sm" onClick={onClose} disabled={loading}>
          Cancelar
        </Button>
        <Button
          variant={isAlreadyPremium ? 'danger' : 'primary'}
          size="sm"
          onClick={handleConfirm}
          disabled={loading}
        >
          {loading
            ? 'Guardando...'
            : isAlreadyPremium
            ? 'Desactivar Modo Premium'
            : 'Activar Suscripción Premium'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

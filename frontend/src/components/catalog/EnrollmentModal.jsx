import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import Icon from '../common/Icon';

export default function EnrollmentModal({
  isOpen,
  onClose,
  institution,
  initialPlan,
  initialUser,
  onSubmit
}) {
  const [form, setForm] = useState({
    fullName: '',
    dni: '',
    phone: '',
    email: '',
    planName: '',
    monthlyAmount: 0
  });

  useEffect(() => {
    if (institution) {
      const plan = initialPlan || institution.plans[0];
      setForm({
        fullName: initialUser?.name || '',
        dni: initialUser?.dni || '',
        phone: initialUser?.phone || '',
        email: initialUser?.email || '',
        planName: plan ? plan.name : '',
        monthlyAmount: plan ? plan.price : 20000
      });
    }
  }, [institution, initialPlan, initialUser]);

  if (!institution) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.fullName || !form.dni) {
      alert('Por favor ingrese su nombre y DNI para procesar la afiliación.');
      return;
    }
    onSubmit(institution.id, {
      ...form,
      source: 'NexoFit (Web Captación)',
      notes: 'Inscripción online mediante NexoFit.'
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Afiliación a ${institution.name}`}
    >
      <form onSubmit={handleSubmit}>
        <div className="modal-body">
          <div className="alert alert-light p-2 mb-3 small">
            <Icon name="info-circle-fill" className="me-2 text-primary" />
            Tu solicitud se enviará directamente a la administración de{' '}
            <strong>{institution.name}</strong> a través de <strong>NexoFit</strong>.
          </div>

          <div className="mb-2">
            <label className="form-label small fw-bold mb-1">
              Nombre y Apellido Completo *
            </label>
            <input
              type="text"
              required
              className="form-control"
              placeholder="Ej. Valeria Montes"
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
            />
          </div>

          <div className="mb-2">
            <label className="form-label small fw-bold mb-1">
              Documento Nacional de Identidad (DNI) *
            </label>
            <input
              type="text"
              required
              className="form-control"
              placeholder="Ej. 39.400.128"
              value={form.dni}
              onChange={(e) => setForm({ ...form, dni: e.target.value })}
            />
          </div>

          <div className="row g-2 mb-2">
            <div className="col-6">
              <label className="form-label small fw-bold mb-1">
                Teléfono Celular *
              </label>
              <input
                type="text"
                required
                className="form-control"
                placeholder="11-2345-6789"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </div>

            <div className="col-6">
              <label className="form-label small fw-bold mb-1">
                Correo Electrónico *
              </label>
              <input
                type="email"
                required
                className="form-control"
                placeholder="valeria@gmail.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
          </div>

          <div className="mb-2">
            <label className="form-label small fw-bold mb-1">
              Plan / Membresía Seleccionada *
            </label>
            <select
              className="form-select"
              value={form.planName}
              onChange={(e) => {
                const p = institution.plans.find((x) => x.name === e.target.value);
                setForm({
                  ...form,
                  planName: e.target.value,
                  monthlyAmount: p ? p.price : form.monthlyAmount
                });
              }}
            >
              {institution.plans.map((p) => (
                <option key={p.id} value={p.name}>
                  {p.name} - ${p.price.toLocaleString('es-AR')} / {p.period}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-light"
            onClick={onClose}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="btn btn-success"
          >
            <Icon name="check-lg" />
            Confirmar Solicitud
          </button>
        </div>
      </form>
    </Modal>
  );
}

import React, { useState } from 'react';
import Modal from '../common/Modal';
import Icon from '../common/Icon';

export default function ManualMemberModal({
  isOpen,
  onClose,
  institution,
  onSubmit
}) {
  const [form, setForm] = useState({
    fullName: '',
    dni: '',
    phone: '',
    email: '',
    planName: institution.plans[0]?.name || 'Pase Estándar',
    monthlyAmount: institution.plans[0]?.price || 20000,
    source: 'Directo (Mostrador)',
    notes: 'Inscripción manual en mostrador de la sede.'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.fullName || !form.dni) {
      alert('Por favor complete Nombre y DNI');
      return;
    }
    onSubmit(form);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Alta de Socio en Mostrador - ${institution.name}`}
    >
      <form onSubmit={handleSubmit}>
        <div className="modal-body">
          <div className="mb-2">
            <label className="form-label small fw-bold mb-1">
              Nombre y Apellido Completo *
            </label>
            <input
              type="text"
              required
              className="form-control"
              placeholder="Ej. Lucas Daniel Herrera"
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
            />
          </div>

          <div className="mb-2">
            <label className="form-label small fw-bold mb-1">
              Documento de Identidad (DNI) *
            </label>
            <input
              type="text"
              required
              className="form-control"
              placeholder="Ej. 37.890.123"
              value={form.dni}
              onChange={(e) => setForm({ ...form, dni: e.target.value })}
            />
          </div>

          <div className="row g-2 mb-2">
            <div className="col-6">
              <label className="form-label small fw-bold mb-1">
                Teléfono de Contacto
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="Ej. 11-4567-8901"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </div>

            <div className="col-6">
              <label className="form-label small fw-bold mb-1">
                Correo Electrónico
              </label>
              <input
                type="email"
                className="form-control"
                placeholder="Ej. lucas@gmail.com"
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
                const plan = institution.plans.find((p) => p.name === e.target.value);
                setForm({
                  ...form,
                  planName: e.target.value,
                  monthlyAmount: plan ? plan.price : form.monthlyAmount
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

          <div className="mb-2">
            <label className="form-label small fw-bold mb-1">
              Observaciones de Recepción
            </label>
            <input
              type="text"
              className="form-control"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
            />
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
            className="btn btn-primary"
          >
            <Icon name="check-lg" />
            Confirmar Alta y Guardar
          </button>
        </div>
      </form>
    </Modal>
  );
}

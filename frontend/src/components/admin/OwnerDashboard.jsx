import React from 'react';
import Icon from '../common/Icon';
import ManualMemberModal from './ManualMemberModal';

export default function OwnerDashboard({
  institution,
  filteredMembers,
  activeTab = 'audit-table',
  newlyAddedId,
  isManualModalOpen,
  setIsManualModalOpen,
  onMemberUpdate,
  onMemberCreated
}) {
  const handleTogglePayment = async (memberId) => {
    try {
      const res = await fetch(`/api/members/${memberId}/toggle-payment`, {
        method: 'PATCH'
      });
      if (res.ok) {
        const updated = await res.json();
        onMemberUpdate(updated);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleRegisterAttendance = async (memberId) => {
    try {
      const res = await fetch(`/api/members/${memberId}/attendance`, {
        method: 'POST'
      });
      if (res.ok) {
        const updated = await res.json();
        onMemberUpdate(updated);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleManualMemberSubmit = async (formData) => {
    try {
      const res = await fetch(`/api/institutions/${institution.id}/members`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        const created = await res.json();
        onMemberCreated(created);
        setIsManualModalOpen(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (activeTab === 'contract-info') {
    return (
      <div className="w-100">
        <div className="card">
          <div className="card-header">
            <h2 className="fs-6 fw-bold mb-0">
              <Icon name="file-earmark-lock-fill" className="me-2 text-white" />
              Contrato de Afiliación &bull; {institution.name}
            </h2>
          </div>
          <div className="card-body">
            <div className="well-card mb-3">
              <div className="row g-2">
                <div className="col-12 col-md-6">
                  <div><strong>Institución:</strong> {institution.name}</div>
                  <div><strong>Titular:</strong> {institution.owner?.name} ({institution.owner?.username})</div>
                  <div><strong>Sede Deportiva:</strong> {institution.address}</div>
                </div>
                <div className="col-12 col-md-6">
                  <div><strong>N° Contrato NexoFit:</strong> <code>{institution.owner?.contractId}</code></div>
                  <div><strong>Fecha de Suscripción:</strong> {institution.owner?.contractDate}</div>
                  <div><strong>Comisión Pactada:</strong> <span className="badge badge-info">{institution.owner?.commissionRate}</span></div>
                </div>
              </div>
            </div>

            <div className="alert alert-info p-2 mb-0 small">
              <strong>Condiciones del Servicio:</strong> NexoFit conecta deportistas locales con su institución. Los socios que se registran a través de la plataforma se incorporan directamente a su padrón con el arancel correspondiente, aplicándose la comisión por gestión en la liquidación mensual.
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-100">
      <div className="card mb-0">
        <div className="card-header">
          <h2 className="fs-6 fw-bold mb-0">
            <Icon name="list-ul" className="me-2" />
            Padrón de Socios ({filteredMembers.length})
          </h2>
        </div>

        <div className="card-body p-0">
          <div className="table-wrapper">
            <table className="table table-hover mb-0">
              <thead>
                <tr>
                  <th>ID Socio</th>
                  <th>Fecha Alta</th>
                  <th>Canal</th>
                  <th>Nombre y Apellido</th>
                  <th>DNI</th>
                  <th>Contacto</th>
                  <th>Plan / Membresía</th>
                  <th>Arancel</th>
                  <th>Estado Cuota</th>
                  <th>Vencimiento</th>
                  <th>Asistencias</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredMembers.length === 0 ? (
                  <tr>
                    <td colSpan="12" className="text-center py-4 text-muted">
                      No se encontraron socios con los filtros indicados en el panel lateral.
                    </td>
                  </tr>
                ) : (
                  filteredMembers.map((member) => {
                    const isNew = member.id === newlyAddedId;
                    const isNexoFit = member.source?.includes('NexoFit');

                    let badgeClass = 'badge badge-success';
                    if (member.paymentStatus === 'Pendiente') badgeClass = 'badge badge-warning';
                    if (member.paymentStatus === 'Vencida') badgeClass = 'badge badge-danger';

                    return (
                      <tr key={member.id} className={isNew ? 'row-flash' : ''}>
                        <td><code>{member.id}</code></td>
                        <td className="text-muted">{member.registeredAt}</td>
                        <td>
                          <span className={isNexoFit ? 'badge badge-info' : 'badge bg-secondary'}>
                            {isNexoFit ? 'NexoFit' : 'Mostrador'}
                          </span>
                        </td>
                        <td><strong>{member.fullName}</strong></td>
                        <td><code>{member.dni}</code></td>
                        <td>
                          <div>{member.phone}</div>
                          <div className="small text-muted">{member.email}</div>
                        </td>
                        <td>{member.planName}</td>
                        <td><strong>${member.monthlyAmount.toLocaleString('es-AR')}</strong></td>
                        <td>
                          <button
                            type="button"
                            className={`border-0 ${badgeClass}`}
                            onClick={() => handleTogglePayment(member.id)}
                            title="Haga clic para alternar estado"
                          >
                            {member.paymentStatus} ▾
                          </button>
                        </td>
                        <td className="text-muted">{member.dueDate}</td>
                        <td>
                          <strong>{member.attendancesThisMonth || 0}</strong> ingresos
                        </td>
                        <td>
                          <div className="d-flex gap-1">
                            <button
                              type="button"
                              className="btn btn-sm btn-light"
                              onClick={() => handleRegisterAttendance(member.id)}
                              title="Registrar ingreso en sala"
                            >
                              + Check-in
                            </button>
                            <button
                              type="button"
                              className="btn btn-sm btn-light"
                              onClick={() => handleTogglePayment(member.id)}
                              title="Alternar estado de cuota"
                            >
                              Cuota
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card-footer">
          <span>
            * Haga clic sobre <strong>Estado Cuota</strong> para alternar entre <em>Al día</em>, <em>Pendiente</em> y <em>Vencida</em>.
          </span>
          <span>
            Padrón sincronizado en tiempo real.
          </span>
        </div>
      </div>

      <ManualMemberModal
        isOpen={isManualModalOpen}
        onClose={() => setIsManualModalOpen(false)}
        institution={institution}
        onSubmit={handleManualMemberSubmit}
      />
    </div>
  );
}

import React, { useState } from 'react';
import Icon from '../common/Icon';
import EnrollmentModal from './EnrollmentModal';

export default function ClientCatalog({
  currentUser,
  institutions,
  filteredInstitutions,
  clientMemberships = [],
  activeTab = 'catalog',
  onEnrollSuccess
}) {
  const [selectedInstitutionForEnroll, setSelectedInstitutionForEnroll] = useState(null);
  const [selectedPlanForEnroll, setSelectedPlanForEnroll] = useState(null);

  const enrolledInstitutionIds = clientMemberships.map((m) => m.institutionId);

  const handleOpenEnroll = (inst, plan) => {
    setSelectedInstitutionForEnroll(inst);
    setSelectedPlanForEnroll(plan);
  };

  const handleEnrollSubmit = async (institutionId, memberData) => {
    try {
      const res = await fetch(`/api/institutions/${institutionId}/members`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(memberData)
      });

      if (res.ok) {
        const newMember = await res.json();
        const instName = selectedInstitutionForEnroll?.name;
        setSelectedInstitutionForEnroll(null);
        if (onEnrollSuccess) {
          onEnrollSuccess(newMember, institutionId, instName);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (activeTab === 'my-memberships') {
    return (
      <div className="w-100">
        <div className="card">
          <div className="card-header">
            <h2 className="fs-6 fw-bold mb-0">
              <Icon name="person-check-fill" className="me-2 text-white" />
              Mis Membresías Activas &bull; {currentUser?.name}
            </h2>
          </div>
          <div className="card-body">
            <div className="well-card mb-3 small">
              <strong>Titular:</strong> {currentUser?.name} &bull; <strong>DNI:</strong> {currentUser?.dni || 'S/D'} &bull; <strong>Email:</strong> {currentUser?.email || 'S/D'}
            </div>

            <div className="table-wrapper">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Centro Deportivo</th>
                    <th>Plan Contratado</th>
                    <th>Arancel Mensual</th>
                    <th>Estado de Cuota</th>
                    <th>Canal</th>
                    <th>Fecha Alta</th>
                  </tr>
                </thead>
                <tbody>
                  {clientMemberships.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center py-4 text-muted">
                        No posees membresías activas en este momento.
                      </td>
                    </tr>
                  ) : (
                    clientMemberships.map((membership) => {
                      const inst = institutions.find((i) => i.id === membership.institutionId);
                      return (
                        <tr key={membership.id}>
                          <td><strong>{inst ? inst.name : membership.institutionId}</strong></td>
                          <td>{membership.planName}</td>
                          <td><strong>${membership.monthlyAmount?.toLocaleString('es-AR')}</strong></td>
                          <td>
                            <span className={membership.paymentStatus === 'Al día' ? 'badge badge-success' : 'badge badge-warning'}>
                              {membership.paymentStatus}
                            </span>
                          </td>
                          <td><span className="badge badge-info">{membership.source}</span></td>
                          <td className="text-muted">{membership.registeredAt}</td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-100">
      <div className="row g-3">
        {filteredInstitutions.length === 0 ? (
          <div className="col-12">
            <div className="card p-4 text-center text-muted">
              No se encontraron centros deportivos que coincidan con la búsqueda.
            </div>
          </div>
        ) : (
          filteredInstitutions.map((inst) => {
            const isEnrolled = enrolledInstitutionIds.includes(inst.id);

            return (
              <div key={inst.id} className="col-12 col-lg-6">
                <div className="card h-100 mb-0 d-flex flex-column">
                  <div className="card-header d-flex justify-content-between align-items-center">
                    <strong className="text-white">
                      {inst.name}
                    </strong>
                    <span className="badge badge-success">
                      {inst.category}
                    </span>
                  </div>

                  <div className="card-body d-flex flex-column flex-grow-1">
                    <p className="small text-muted fst-italic mb-2">
                      "{inst.tagline}"
                    </p>

                    <div className="well-card p-2 mb-3 small">
                      <div><strong>Dirección:</strong> {inst.address}</div>
                      <div><strong>Teléfono:</strong> {inst.phone}</div>
                      <div><strong>Socios:</strong> {inst.stats?.totalMembers || 0} ({inst.stats?.nexoFitConverted || 0} por NexoFit)</div>
                    </div>

                    <div className="flex-grow-1">
                      <div className="small fw-bold text-primary mb-1">
                        Planes y Aranceles:
                      </div>
                      <div className="table-wrapper mb-2">
                        <table className="table table-hover mb-0">
                          <tbody>
                            {inst.plans.map((plan) => (
                              <tr key={plan.id}>
                                <td>{plan.name} ({plan.period})</td>
                                <td className="text-end fw-bold text-success">
                                  ${plan.price.toLocaleString('es-AR')}
                                </td>
                                <td className="text-end">
                                  <button
                                    type="button"
                                    className="btn btn-sm btn-primary"
                                    disabled={isEnrolled}
                                    onClick={() => handleOpenEnroll(inst, plan)}
                                  >
                                    Elegir &rarr;
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <div className="pt-2 border-top d-flex justify-content-between align-items-center mt-auto">
                      <span className={`small ${isEnrolled ? 'fw-bold text-success' : 'text-muted'}`}>
                        {isEnrolled ? 'Matriculado' : 'No matriculado'}
                      </span>
                      <button
                        type="button"
                        className="btn btn-success"
                        disabled={isEnrolled}
                        onClick={() => handleOpenEnroll(inst, inst.plans[0])}
                      >
                        {isEnrolled ? 'Matriculado' : 'Asociarme \u2192'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      <EnrollmentModal
        isOpen={Boolean(selectedInstitutionForEnroll)}
        onClose={() => setSelectedInstitutionForEnroll(null)}
        institution={selectedInstitutionForEnroll}
        initialPlan={selectedPlanForEnroll}
        initialUser={currentUser}
        onSubmit={handleEnrollSubmit}
      />
    </div>
  );
}

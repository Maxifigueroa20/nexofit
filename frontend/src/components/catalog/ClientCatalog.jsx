import React, { useState } from 'react';
import Card from 'react-bootstrap/Card';
import Table from 'react-bootstrap/Table';
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Pagination from 'react-bootstrap/Pagination';
import Icon from '../common/Icon';
import EnrollmentModal from './EnrollmentModal';
import { getApiUrl } from '../../config/api';

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

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  const totalPages = Math.ceil(filteredInstitutions.length / pageSize) || 1;
  const activePage = Math.min(Math.max(1, currentPage), totalPages);
  const startIndex = (activePage - 1) * pageSize;
  const paginatedInstitutions = filteredInstitutions.slice(startIndex, startIndex + pageSize);

  const renderPaginationItems = () => {
    if (totalPages <= 1) return null;
    const items = [];
    const maxVisible = 5;
    let startPage = Math.max(1, activePage - Math.floor(maxVisible / 2));
    let endPage = Math.min(totalPages, startPage + maxVisible - 1);
    if (endPage - startPage + 1 < maxVisible) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }

    if (startPage > 1) {
      items.push(
        <Pagination.Item key={1} onClick={() => setCurrentPage(1)}>
          1
        </Pagination.Item>
      );
      if (startPage > 2) {
        items.push(<Pagination.Ellipsis key="start-ell" disabled />);
      }
    }

    for (let page = startPage; page <= endPage; page++) {
      items.push(
        <Pagination.Item
          key={page}
          active={page === activePage}
          onClick={() => setCurrentPage(page)}
        >
          {page}
        </Pagination.Item>
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        items.push(<Pagination.Ellipsis key="end-ell" disabled />);
      }
      items.push(
        <Pagination.Item key={totalPages} onClick={() => setCurrentPage(totalPages)}>
          {totalPages}
        </Pagination.Item>
      );
    }

    return items;
  };

  const handleOpenEnroll = (inst, plan) => {
    setSelectedInstitutionForEnroll(inst);
    setSelectedPlanForEnroll(plan);
  };

  const handleEnrollSubmit = async (institutionId, memberData) => {
    try {
      const res = await fetch(getApiUrl(`/api/institutions/${institutionId}/members`), {
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
        <Card className="mb-3">
          <Card.Header className="py-2 px-3">
            <h2 className="fs-6 fw-bold mb-0 text-white d-flex align-items-center">
              <Icon name="person-check-fill" className="me-2 text-white" />
              Mis Membresías Activas &bull; {currentUser?.name}
            </h2>
          </Card.Header>
          <Card.Body className="p-3">
            <div className="p-2 mb-3 bg-light border small">
              <strong>Titular:</strong> {currentUser?.name} &bull; <strong>DNI:</strong> {currentUser?.dni || 'S/D'} &bull; <strong>Email:</strong> {currentUser?.email || 'S/D'}
            </div>

            <Table hover responsive className="mb-0 align-middle">
              <thead className="table-light">
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
                          <Badge bg={membership.paymentStatus === 'Al día' ? 'success' : 'warning'} text={membership.paymentStatus === 'Al día' ? undefined : 'dark'}>
                            {membership.paymentStatus}
                          </Badge>
                        </td>
                        <td><Badge bg="info" text="dark">{membership.source}</Badge></td>
                        <td className="text-muted small">{membership.registeredAt}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      </div>
    );
  }

  if (activeTab === 'terms-and-conditions') {
    return (
      <div className="w-100">
        <Card className="mb-3">
          <Card.Header className="py-2 px-3">
            <h2 className="fs-6 fw-bold mb-0 text-white d-flex align-items-center">
              <Icon name="shield-check" className="me-2 text-white" />
              Términos y Condiciones del Usuario &bull; {currentUser?.name}
            </h2>
          </Card.Header>
          <Card.Body className="p-3">
            <div className="p-2 mb-3 bg-light border">
              <Row className="g-2 small">
                <Col xs={12} md={6}>
                  <div><strong>Usuario Titular:</strong> {currentUser?.name} ({currentUser?.username})</div>
                  <div><strong>DNI Registrado:</strong> {currentUser?.dni || 'S/D'}</div>
                  <div><strong>Email:</strong> {currentUser?.email || 'S/D'}</div>
                </Col>
                <Col xs={12} md={6}>
                  <div>
                    <strong>Estado de Cuenta:</strong>{' '}
                    <Badge bg="success">Aceptados al Registrarse</Badge>
                  </div>
                  <div>
                    <strong>Modalidad de Acceso:</strong>{' '}
                    <Badge bg="info" text="dark">Gratuito Financiado con Publicidad</Badge>
                  </div>
                  <div>
                    <strong>Fecha de Alta:</strong> {currentUser?.termsAcceptedDate || '10/10/2026'}
                  </div>
                </Col>
              </Row>
            </div>

            <Alert variant="info" className="p-3 mb-3 small">
              <div className="fw-bold mb-1">
                <Icon name="info-circle-fill" className="me-1" />
                Cláusula de Gratuidad y Publicidad Incrustada:
              </div>
              <div>
                Al registrarse gratuitamente en NexoFit, usted aceptó los Términos y Condiciones del Usuario. La plataforma no cobra comisiones ni tarifas de suscripción a los deportistas por explorar centros ni por afiliarse a sus planes.
              </div>
              <div className="mt-2">
                Como contraprestación directa para sustentar y mantener la infraestructura sin costo para los usuarios, usted consiente la visualización de publicidades y anuncios patrocinados incrustados en las distintas secciones de la plataforma, de forma análoga a cualquier otro sitio web contemporáneo.
              </div>
            </Alert>

            <Card className="p-3 border rounded-2 bg-light text-center mb-2">
              <div className="text-muted text-uppercase fw-bold" style={{ fontSize: '10px', letterSpacing: '1px' }}>
                Espacio Publicitario Patrocinado
              </div>
              <div className="d-flex align-items-center justify-content-center gap-3 py-2 flex-wrap">
                <Icon name="lightning-charge-fill" className="text-warning fs-3" />
                <div className="text-start">
                  <div className="fw-bold text-primary">NutriSport Suplementos &bull; 20% OFF</div>
                  <div className="small text-muted">Proteínas, creatinas e indumentaria deportiva con envío en San Salvador de Jujuy. Código: <code>NEXOFIT20</code></div>
                </div>
                <Button variant="outline-primary" size="sm" onClick={() => alert('Demostración de anuncio publicitario incrustado.')}>
                  Ver Promoción
                </Button>
              </div>
            </Card>
          </Card.Body>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-100">
      {currentUser?.role === 'CLIENT' && (currentUser.neighborhood || currentUser.preferredShift) && (
        <div className="p-2 mb-3 bg-light border small d-flex align-items-center justify-content-between flex-wrap gap-2">
          <span>
            <Icon name="person-check-fill" className="text-primary me-1" />
            Feed personalizado para <strong>{currentUser.name}</strong>: Priorizando sedes en <strong>{currentUser.neighborhood || 'tu zona'}</strong> con atención en <strong>Turno {currentUser.preferredShift || 'habitual'}</strong>.
          </span>
          <Badge bg="light" text="dark" className="border">Preferencia de Perfil</Badge>
        </div>
      )}

      <div className="d-flex justify-content-between align-items-center mb-3 p-2 bg-light border small flex-wrap gap-2">
        <span className="text-muted">
          Mostrando <strong>{filteredInstitutions.length === 0 ? 0 : startIndex + 1}-{Math.min(startIndex + pageSize, filteredInstitutions.length)}</strong> de <strong>{filteredInstitutions.length}</strong> centros deportivos en Jujuy
        </span>
        {totalPages > 1 && (
          <Pagination size="sm" className="mb-0">
            <Pagination.First disabled={activePage === 1} onClick={() => setCurrentPage(1)} />
            <Pagination.Prev disabled={activePage === 1} onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} />
            {renderPaginationItems()}
            <Pagination.Next disabled={activePage === totalPages} onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} />
            <Pagination.Last disabled={activePage === totalPages} onClick={() => setCurrentPage(totalPages)} />
          </Pagination>
        )}
      </div>

      <Row className="g-3">
        {filteredInstitutions.length === 0 ? (
          <Col xs={12}>
            <Card className="p-4 text-center text-muted">
              No se encontraron centros deportivos que coincidan con la búsqueda.
            </Card>
          </Col>
        ) : (
          paginatedInstitutions.map((inst) => {
            const isEnrolled = enrolledInstitutionIds.includes(inst.id);
            const isMatchBarrio = Boolean(currentUser?.role === 'CLIENT' && currentUser?.neighborhood && inst.neighborhood === currentUser.neighborhood);
            const isMatchTurno = Boolean(currentUser?.role === 'CLIENT' && currentUser?.preferredShift && Array.isArray(inst.shifts) && inst.shifts.includes(currentUser.preferredShift));

            return (
              <Col xs={12} lg={6} key={inst.id}>
                <Card className="h-100 mb-0 d-flex flex-column">
                  <Card.Header className="d-flex justify-content-between align-items-center py-2 px-3">
                    <div className="d-flex align-items-center gap-2">
                      {inst.isPremium && <Icon name="star-fill" className="text-warning" />}
                      <strong className="text-white">
                        {inst.name}
                      </strong>
                    </div>
                    <div className="d-flex align-items-center gap-1">
                      {inst.isPremium && (
                        <Badge bg="warning" text="dark">
                          Destacado
                        </Badge>
                      )}
                      <Badge bg="secondary">
                        {inst.category}
                      </Badge>
                    </div>
                  </Card.Header>

                  <Card.Body className="d-flex flex-column flex-grow-1 p-3">
                    <p className="small text-muted fst-italic mb-2">
                      "{inst.tagline}"
                    </p>

                    <Card className="p-2 mb-3 small bg-light border-0">
                      <div className="d-flex justify-content-between align-items-center mb-1 flex-wrap gap-1">
                        <div>
                          <Icon name="geo-alt-fill" className="text-primary me-1" />
                          <strong>Barrio:</strong> {inst.neighborhood || 'Centro'} &bull; {inst.address}
                        </div>
                        {isMatchBarrio && (
                          <Badge bg="info" text="dark">En tu barrio</Badge>
                        )}
                      </div>
                      <div className="d-flex justify-content-between align-items-center mb-1 flex-wrap gap-1">
                        <div>
                          <Icon name="clock-fill" className="text-muted me-1" />
                          <strong>Horario:</strong> {inst.schedule || 'Lun a Vie 08:00 a 22:00'}
                        </div>
                        {isMatchTurno && (
                          <Badge bg="primary">Tu turno ({currentUser.preferredShift})</Badge>
                        )}
                      </div>
                      <div><strong>Teléfono:</strong> {inst.phone}</div>
                      <div><strong>Socios:</strong> {inst.stats?.totalMembers || 0} ({inst.stats?.nexoFitConverted || 0} por NexoFit)</div>
                    </Card>

                    <div className="flex-grow-1">
                      <div className="small fw-bold text-primary mb-1">
                        Planes y Aranceles:
                      </div>
                      <Table hover size="sm" className="mb-2 align-middle">
                        <tbody>
                          {inst.plans.map((plan) => (
                            <tr key={plan.id}>
                              <td>{plan.name} ({plan.period})</td>
                              <td className="text-end fw-bold text-success">
                                ${plan.price.toLocaleString('es-AR')}
                              </td>
                              <td className="text-end">
                                <Button
                                  variant="primary"
                                  size="sm"
                                  disabled={isEnrolled}
                                  onClick={() => handleOpenEnroll(inst, plan)}
                                >
                                  Elegir Plan
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </div>

                    <div className="pt-2 border-top d-flex justify-content-between align-items-center mt-auto">
                      <span className={`small ${isEnrolled ? 'fw-bold text-success' : 'text-muted'}`}>
                        {isEnrolled ? 'Matriculado' : 'No matriculado'}
                      </span>
                      <Button
                        variant="success"
                        disabled={isEnrolled}
                        onClick={() => handleOpenEnroll(inst, inst.plans[0])}
                      >
                        {isEnrolled ? 'Matriculado' : 'Asociarme'}
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            );
          })
        )}
      </Row>

      {totalPages > 1 && (
        <div className="d-flex justify-content-center mt-3 pt-2 border-top">
          <Pagination size="sm" className="mb-0">
            <Pagination.First disabled={activePage === 1} onClick={() => setCurrentPage(1)} />
            <Pagination.Prev disabled={activePage === 1} onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} />
            {renderPaginationItems()}
            <Pagination.Next disabled={activePage === totalPages} onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} />
            <Pagination.Last disabled={activePage === totalPages} onClick={() => setCurrentPage(totalPages)} />
          </Pagination>
        </div>
      )}

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

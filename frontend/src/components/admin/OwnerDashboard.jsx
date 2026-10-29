import React, { useState } from 'react';
import Card from 'react-bootstrap/Card';
import Table from 'react-bootstrap/Table';
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Pagination from 'react-bootstrap/Pagination';
import Form from 'react-bootstrap/Form';
import Icon from '../common/Icon';
import ManualMemberModal from './ManualMemberModal';
import { getApiUrl } from '../../config/api';

export default function OwnerDashboard({
  institution,
  filteredMembers,
  totalMembersCount = 0,
  activeTab = 'audit-table',
  newlyAddedId,
  isManualModalOpen,
  setIsManualModalOpen,
  onMemberUpdate,
  onMemberCreated
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const totalPages = Math.ceil(filteredMembers.length / pageSize) || 1;
  const activePage = Math.min(Math.max(1, currentPage), totalPages);
  const startIndex = (activePage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, filteredMembers.length);
  const paginatedMembers = filteredMembers.slice(startIndex, endIndex);

  const renderPaginationItems = () => {
    if (totalPages <= 1) return null;
    const items = [];
    items.push(
      <Pagination.Prev
        key="prev"
        disabled={activePage === 1}
        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
      />
    );
    for (let number = 1; number <= totalPages; number++) {
      if (
        number === 1 ||
        number === totalPages ||
        (number >= activePage - 2 && number <= activePage + 2)
      ) {
        items.push(
          <Pagination.Item
            key={number}
            active={number === activePage}
            onClick={() => setCurrentPage(number)}
          >
            {number}
          </Pagination.Item>
        );
      } else if (
        number === activePage - 3 ||
        number === activePage + 3
      ) {
        items.push(<Pagination.Ellipsis key={`ellipsis-${number}`} disabled />);
      }
    }
    items.push(
      <Pagination.Next
        key="next"
        disabled={activePage === totalPages}
        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
      />
    );
    return items;
  };

  const dynamicRate = (8 + ((totalMembersCount || filteredMembers.length) * 0.05)).toFixed(2);

  const handleTogglePayment = async (memberId) => {
    try {
      const res = await fetch(getApiUrl(`/api/members/${memberId}/toggle-payment`), {
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
      const res = await fetch(getApiUrl(`/api/members/${memberId}/attendance`), {
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
      const res = await fetch(getApiUrl(`/api/institutions/${institution.id}/members`), {
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

  if (activeTab === 'terms-and-conditions') {
    return (
      <div className="w-100">
        <Card className="mb-3">
          <Card.Header className="py-2 px-3">
            <h2 className="fs-6 fw-bold mb-0 text-white d-flex align-items-center">
              <Icon name="shield-check" className="me-2 text-white" />
              Términos y Condiciones del Servicio &bull; {institution.name}
            </h2>
          </Card.Header>
          <Card.Body className="p-3">
            <div className="p-2 mb-3 bg-light border">
              <Row className="g-2 small">
                <Col xs={12} md={6}>
                  <div><strong>Institución Adherida:</strong> {institution.name}</div>
                  <div><strong>Titular Responsable:</strong> {institution.owner?.name} ({institution.owner?.username})</div>
                  <div><strong>Sede Deportiva:</strong> {institution.address}</div>
                </Col>
                <Col xs={12} md={6}>
                  <div>
                    <strong>Estado de Adhesión:</strong>{' '}
                    <Badge bg="success">Aceptados al Registrarse</Badge>
                  </div>
                  <div>
                    <strong>Fecha de Alta Voluntaria:</strong>{' '}
                    {institution.owner?.termsAcceptedDate || institution.owner?.contractDate || '15/03/2024'}
                  </div>
                  <div>
                    <strong>Comisión por Captación:</strong>{' '}
                    <Badge bg="warning" text="dark">{dynamicRate}% (Base 8% + Tasa Dinámica)</Badge>
                  </div>
                </Col>
              </Row>
            </div>

            <Alert variant="info" className="p-3 mb-3 small">
              <div className="fw-bold mb-1">
                <Icon name="info-circle-fill" className="me-1" />
                Cláusula de Captación y Arancel Dinámico Progresivo:
              </div>
              <div>
                Al registrarse voluntariamente como Dueño y dar de alta su institución deportiva, usted aceptó los Términos y Condiciones de NexoFit. La plataforma opera sin abonos fijos de mantenimiento ni contratos notariales tradicionales.
              </div>
              <div className="mt-2">
                Se establece una comisión base del <strong>8%</strong> calculada exclusivamente sobre el arancel mensual de cada socio que se matricule a través de la plataforma NexoFit. Esta tasa se complementa dinámicamente con una escala progresiva adaptada al volumen total de socios activos en el padrón de su sede deportiva, situando su alícuota actual en un <strong>{dynamicRate}%</strong>.
              </div>
              <div className="mt-2">
                Los socios inscritos manualmente por el mostrador presencial de su establecimiento no pagan comisión directa por su alta, contribuyendo a la escala de servicio general.
              </div>
            </Alert>

            <div className="p-2 small text-muted border-top">
              <strong>Soporte y Consultas:</strong> Para actualizar aranceles, planes o datos de la sede, comuníquese con el equipo de soporte de NexoFit en <code>soporte@nexofit.com</code>.
            </div>
          </Card.Body>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-100">
      <Card className="mb-0">
        <Card.Header className="py-2 px-3">
          <h2 className="fs-6 fw-bold mb-0 text-white d-flex align-items-center">
            <Icon name="list-ul" className="me-2 text-white" />
            Padrón de Socios ({filteredMembers.length})
          </h2>
        </Card.Header>

        <Card.Body className="p-0">
          <Table hover responsive className="mb-0 align-middle">
            <thead className="table-light">
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
                paginatedMembers.map((member) => {
                  const isNew = member.id === newlyAddedId;
                  const isNexoFit = member.source?.includes('NexoFit');

                  let badgeVariant = 'success';
                  let badgeText = undefined;
                  if (member.paymentStatus === 'Pendiente') {
                    badgeVariant = 'warning';
                    badgeText = 'dark';
                  } else if (member.paymentStatus === 'Vencida') {
                    badgeVariant = 'danger';
                  }

                  return (
                    <tr key={member.id} className={isNew ? 'row-flash' : ''}>
                      <td><code>{member.id}</code></td>
                      <td className="text-muted small">{member.registeredAt}</td>
                      <td>
                        <Badge bg={isNexoFit ? 'info' : 'secondary'} text={isNexoFit ? 'dark' : undefined}>
                          {isNexoFit ? 'NexoFit' : 'Mostrador'}
                        </Badge>
                      </td>
                      <td><strong>{member.fullName}</strong></td>
                      <td><code>{member.dni}</code></td>
                      <td>
                        <div className="small">{member.phone}</div>
                        <div className="small text-muted">{member.email}</div>
                      </td>
                      <td>{member.planName}</td>
                      <td><strong>${member.monthlyAmount.toLocaleString('es-AR')}</strong></td>
                      <td>
                        <Badge
                          as="button"
                          bg={badgeVariant}
                          text={badgeText}
                          className="border-0 cursor-pointer"
                          onClick={() => handleTogglePayment(member.id)}
                          title="Haga clic para alternar estado"
                        >
                          {member.paymentStatus}
                        </Badge>
                      </td>
                      <td className="text-muted small">{member.dueDate}</td>
                      <td>
                        <strong>{member.attendancesThisMonth || 0}</strong> ingresos
                      </td>
                      <td>
                        <div className="d-flex gap-1">
                          <Button
                            variant="light"
                            size="sm"
                            className="border"
                            onClick={() => handleRegisterAttendance(member.id)}
                            title="Registrar ingreso en sala"
                          >
                            Check-in
                          </Button>
                          <Button
                            variant="light"
                            size="sm"
                            className="border"
                            onClick={() => handleTogglePayment(member.id)}
                            title="Alternar estado de cuota"
                          >
                            Cuota
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </Table>
        </Card.Body>

        <Card.Footer className="bg-light py-2 px-3 small text-muted">
          <Row className="align-items-center g-2">
            <Col xs={12} md={5} className="d-flex align-items-center gap-2">
              <span>Mostrar</span>
              <Form.Select
                size="sm"
                style={{ width: 'auto' }}
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </Form.Select>
              <span>
                {filteredMembers.length > 0
                  ? `${startIndex + 1} - ${endIndex} de ${filteredMembers.length} socios`
                  : '0 socios'}
              </span>
            </Col>
            <Col xs={12} md={7} className="d-flex justify-content-md-end justify-content-center">
              {totalPages > 1 && (
                <Pagination size="sm" className="mb-0">
                  {renderPaginationItems()}
                </Pagination>
              )}
            </Col>
          </Row>
        </Card.Footer>
      </Card>

      <ManualMemberModal
        isOpen={isManualModalOpen}
        onClose={() => setIsManualModalOpen(false)}
        institution={institution}
        onSubmit={handleManualMemberSubmit}
      />
    </div>
  );
}

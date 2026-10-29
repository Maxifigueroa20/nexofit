import React from 'react';
import { useLocation, useNavigate } from 'react-router';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Badge from 'react-bootstrap/Badge';
import Icon from '../common/Icon';

export default function Sidebar({
  role,
  institution,
  members = [],
  onOpenManualModal,
  onOpenPremiumModal,
  onResetSeeds,
  onLogout,
  ownerFilters,
  clientFilters
}) {
  const location = useLocation();
  const navigate = useNavigate();
  const pathname = location.pathname;

  const isOwner = role === 'OWNER';

  const total = members.length;
  const upToDate = members.filter((m) => m.paymentStatus === 'Al día').length;
  const overdueOrPending = total - upToDate;
  const nexoFitMembers = members.filter((m) => m.source?.includes('NexoFit')).length;
  const dynamicRate = (8 + (total * 0.05)).toFixed(2);

  const isAuditActive = pathname === '/dashboard' || pathname === '/';
  const isOwnerTermsActive = pathname === '/dashboard/terms';
  const isCatalogActive = pathname === '/catalog' || pathname === '/';
  const isMembershipsActive = pathname === '/my-memberships';
  const isClientTermsActive = pathname === '/terms';

  return (
    <aside className="app-sidebar">
      {isOwner && (
        <Button
          className="btn-premium w-100 py-1 d-flex align-items-center justify-content-center gap-1 mb-2"
          onClick={onOpenPremiumModal}
        >
          <Icon name="star-fill" />
          <span>{institution?.isPremium ? 'Sede Destacada' : 'Ser Sede Destacada'}</span>
        </Button>
      )}

      <div className="sidebar-group">
        <div className="sidebar-header">Navegación</div>
        {isOwner ? (
          <>
            <button
              type="button"
              className={`sidebar-link ${isAuditActive ? 'active' : ''}`}
              onClick={() => navigate('/dashboard')}
            >
              <Icon name="table" />
              Padrón de Socios
            </button>
            <button
              type="button"
              className={`sidebar-link ${isOwnerTermsActive ? 'active' : ''}`}
              onClick={() => navigate('/dashboard/terms')}
            >
              <Icon name="shield-check" />
              Términos y Condiciones
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              className={`sidebar-link ${isCatalogActive ? 'active' : ''}`}
              onClick={() => navigate('/catalog')}
            >
              <Icon name="grid-fill" />
              Directorio de Centros
            </button>
            <button
              type="button"
              className={`sidebar-link ${isMembershipsActive ? 'active' : ''}`}
              onClick={() => navigate('/my-memberships')}
            >
              <Icon name="card-checklist" />
              Mis Afiliaciones
            </button>
            <button
              type="button"
              className={`sidebar-link ${isClientTermsActive ? 'active' : ''}`}
              onClick={() => navigate('/terms')}
            >
              <Icon name="shield-check" />
              Términos y Condiciones
            </button>
          </>
        )}
      </div>

      {isOwner && ownerFilters && isAuditActive && (
        <div className="sidebar-group">
          <div className="sidebar-header">Filtros del Padrón</div>
          <div className="p-2">
            <Form.Group className="mb-2">
              <Form.Label className="small fw-bold mb-1">Buscar socio</Form.Label>
              <Form.Control
                size="sm"
                type="text"
                placeholder="Nombre, DNI o ID..."
                value={ownerFilters.searchTerm}
                onChange={(e) => ownerFilters.setSearchTerm(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label className="small fw-bold mb-1">Estado de cuota</Form.Label>
              <Form.Select
                size="sm"
                value={ownerFilters.statusFilter}
                onChange={(e) => ownerFilters.setStatusFilter(e.target.value)}
              >
                <option value="ALL">Todas las cuotas</option>
                <option value="Al día">Al día</option>
                <option value="Pendiente">Pendiente</option>
                <option value="Vencida">Vencida</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label className="small fw-bold mb-1">Canal de captación</Form.Label>
              <Form.Select
                size="sm"
                value={ownerFilters.sourceFilter}
                onChange={(e) => ownerFilters.setSourceFilter(e.target.value)}
              >
                <option value="ALL">Todos los canales</option>
                <option value="NexoFit (Web Captación)">Canal NexoFit</option>
                <option value="Mostrador / Directo">Mostrador Directo</option>
              </Form.Select>
            </Form.Group>

            <div className="small text-muted">
              Mostrando {ownerFilters.filteredCount} de {ownerFilters.totalCount} socios.
            </div>
          </div>
        </div>
      )}

      {!isOwner && clientFilters && isCatalogActive && (
        <div className="sidebar-group">
          <div className="sidebar-header">Directorio de Centros Afiliados</div>
          <div className="p-2">
            <Form.Group className="mb-2">
              <Form.Label className="small fw-bold mb-1">Disciplina</Form.Label>
              <Form.Select
                size="sm"
                value={clientFilters.category}
                onChange={(e) => clientFilters.setCategory(e.target.value)}
              >
                <option value="ALL">Todas las disciplinas</option>
                <option value="Gimnasio">Gimnasios & Musculación</option>
                <option value="Pilates">Centros de Pilates</option>
                <option value="Yoga">Estudios de Yoga</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label className="small fw-bold mb-1">Búsqueda</Form.Label>
              <Form.Control
                size="sm"
                type="text"
                placeholder="Buscar por barrio o nombre..."
                value={clientFilters.search}
                onChange={(e) => clientFilters.setSearch(e.target.value)}
              />
            </Form.Group>

            <div className="small text-muted">
              Mostrando {clientFilters.filteredCount} de {clientFilters.totalCount} centros.
            </div>
          </div>
        </div>
      )}

      {isOwner && institution && (
        <div className="sidebar-group">
          <div className="sidebar-header">{institution.name}</div>
          <div className="p-2 small">
            <div className="text-muted mb-1">
              <Icon name="geo-alt-fill" className="me-1 text-primary" />
              {institution.address}
            </div>
            <div className="text-muted mb-2">
              <Icon name="shield-check" className="me-1 text-success" />
              <span>Términos ({dynamicRate}%)</span>
            </div>

            <div className="d-flex flex-column gap-1 border-top pt-2">
              <div className="d-flex justify-content-between align-items-center">
                <span className="text-muted">Total socios:</span>
                <Badge bg="info" text="dark">{total}</Badge>
              </div>
              <div className="d-flex justify-content-between align-items-center">
                <span className="text-muted">Al día:</span>
                <Badge bg="success">{upToDate}</Badge>
              </div>
              {overdueOrPending > 0 && (
                <div className="d-flex justify-content-between align-items-center">
                  <span className="text-muted">Morosos:</span>
                  <Badge bg="danger">{overdueOrPending}</Badge>
                </div>
              )}
              <div className="d-flex justify-content-between align-items-center">
                <span className="text-muted">Vía NexoFit:</span>
                <Badge bg="secondary">{nexoFitMembers}</Badge>
              </div>
            </div>

            {onOpenManualModal && (
              <Button
                variant="primary"
                size="sm"
                className="w-100 mt-2"
                onClick={onOpenManualModal}
              >
                <Icon name="plus-lg" className="me-1" />
                Nuevo Socio Mostrador
              </Button>
            )}
          </div>
        </div>
      )}

      <div className="sidebar-group">
        <div className="sidebar-header">Sistema</div>
        <button
          type="button"
          className="sidebar-link"
          onClick={onResetSeeds}
          title="Restablecer datos seedeados"
        >
          <Icon name="arrow-clockwise" />
          Reiniciar Seeds
        </button>
        <button
          type="button"
          className="sidebar-link text-danger"
          onClick={onLogout}
          title="Cerrar sesión actual"
        >
          <Icon name="box-arrow-right" />
          Cerrar Sesión
        </button>
      </div>
    </aside>
  );
}

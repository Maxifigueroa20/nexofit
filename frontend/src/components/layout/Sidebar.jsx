import React from 'react';
import Icon from '../common/Icon';

export default function Sidebar({
  role,
  activeTab,
  onTabChange,
  institution,
  members = [],
  onOpenManualModal,
  onResetSeeds,
  onLogout,
  ownerFilters,
  clientFilters
}) {
  const isOwner = role === 'OWNER';

  const total = members.length;
  const upToDate = members.filter((m) => m.paymentStatus === 'Al día').length;
  const overdueOrPending = total - upToDate;
  const nexoFitMembers = members.filter((m) => m.source?.includes('NexoFit')).length;

  return (
    <aside className="aero-sidebar">
      <div className="sidebar-group">
        <div className="sidebar-header">Navegación</div>
        {isOwner ? (
          <>
            <button
              type="button"
              className={`sidebar-link ${activeTab === 'audit-table' ? 'active' : ''}`}
              onClick={() => onTabChange('audit-table')}
            >
              <Icon name="table" />
              Padrón de Socios
            </button>
            <button
              type="button"
              className={`sidebar-link ${activeTab === 'contract-info' ? 'active' : ''}`}
              onClick={() => onTabChange('contract-info')}
            >
              <Icon name="file-earmark-text" />
              Contrato NexoFit
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              className={`sidebar-link ${activeTab === 'catalog' ? 'active' : ''}`}
              onClick={() => onTabChange('catalog')}
            >
              <Icon name="grid-fill" />
              Directorio de Centros
            </button>
            <button
              type="button"
              className={`sidebar-link ${activeTab === 'my-memberships' ? 'active' : ''}`}
              onClick={() => onTabChange('my-memberships')}
            >
              <Icon name="card-checklist" />
              Mis Afiliaciones
            </button>
          </>
        )}
      </div>

      {isOwner && ownerFilters && activeTab === 'audit-table' && (
        <div className="sidebar-group">
          <div className="sidebar-header">Filtros del Padrón</div>
          <div className="p-2">
            <label className="form-label small fw-bold mb-1">Buscar socio</label>
            <input
              type="text"
              className="form-control form-control-sm mb-2"
              placeholder="Nombre, DNI o ID..."
              value={ownerFilters.searchTerm}
              onChange={(e) => ownerFilters.setSearchTerm(e.target.value)}
            />

            <label className="form-label small fw-bold mb-1">Estado de cuota</label>
            <select
              className="form-select form-select-sm mb-2"
              value={ownerFilters.statusFilter}
              onChange={(e) => ownerFilters.setStatusFilter(e.target.value)}
            >
              <option value="ALL">Todas las cuotas</option>
              <option value="Al día">Al día</option>
              <option value="Pendiente">Pendiente</option>
              <option value="Vencida">Vencida</option>
            </select>

            <label className="form-label small fw-bold mb-1">Canal de captación</label>
            <select
              className="form-select form-select-sm mb-2"
              value={ownerFilters.sourceFilter}
              onChange={(e) => ownerFilters.setSourceFilter(e.target.value)}
            >
              <option value="ALL">Todos los canales</option>
              <option value="NexoFit (Web Captación)">Canal NexoFit</option>
              <option value="Mostrador / Directo">Mostrador Directo</option>
            </select>

            <div className="small text-muted">
              Mostrando {ownerFilters.filteredCount} de {ownerFilters.totalCount} socios.
            </div>
          </div>
        </div>
      )}

      {!isOwner && clientFilters && activeTab === 'catalog' && (
        <div className="sidebar-group">
          <div className="sidebar-header">Directorio de Centros Afiliados</div>
          <div className="p-2">
            <label className="form-label small fw-bold mb-1">Disciplina</label>
            <select
              className="form-select form-select-sm mb-2"
              value={clientFilters.category}
              onChange={(e) => clientFilters.setCategory(e.target.value)}
            >
              <option value="ALL">Todas las disciplinas</option>
              <option value="Gimnasio">Gimnasios & Musculación</option>
              <option value="Pilates">Centros de Pilates</option>
              <option value="Yoga">Estudios de Yoga</option>
            </select>

            <label className="form-label small fw-bold mb-1">Búsqueda</label>
            <input
              type="text"
              className="form-control form-control-sm mb-2"
              placeholder="Buscar por barrio o nombre..."
              value={clientFilters.search}
              onChange={(e) => clientFilters.setSearch(e.target.value)}
            />

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
              <Icon name="file-earmark-lock-fill" className="me-1 text-secondary" />
              <code>{institution.owner?.contractId}</code>
            </div>

            <div className="d-flex flex-column gap-1 border-top pt-2">
              <div className="d-flex justify-content-between align-items-center">
                <span className="text-muted">Total socios:</span>
                <span className="badge badge-info">{total}</span>
              </div>
              <div className="d-flex justify-content-between align-items-center">
                <span className="text-muted">Al día:</span>
                <span className="badge badge-success">{upToDate}</span>
              </div>
              {overdueOrPending > 0 && (
                <div className="d-flex justify-content-between align-items-center">
                  <span className="text-muted">Morosos:</span>
                  <span className="badge badge-danger">{overdueOrPending}</span>
                </div>
              )}
              <div className="d-flex justify-content-between align-items-center">
                <span className="text-muted">Vía NexoFit:</span>
                <span className="badge bg-secondary">{nexoFitMembers}</span>
              </div>
            </div>

            {onOpenManualModal && (
              <button
                type="button"
                className="btn btn-primary btn-sm w-100 mt-2"
                onClick={onOpenManualModal}
              >
                <Icon name="plus-lg" />
                + Nuevo Socio Mostrador
              </button>
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

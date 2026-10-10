import React from 'react';
import Icon from '../common/Icon';

export default function Header({ currentUser, currentInstitution }) {
  const isOwner = currentUser?.role === 'OWNER';

  return (
    <header className="aero-window-top">
      <div className="d-flex align-items-center gap-2">
        <div className="aero-brand-icon">
          <Icon name="link-45deg" />
        </div>
        <div>
          <h1 className="aero-brand-title">NexoFit</h1>
          <p className="aero-brand-subtitle">Red Deportiva &bull; Afiliaciones y Padrón</p>
        </div>
      </div>

      <div className="d-flex align-items-center gap-2">
        <span className="aero-user-badge">
          <Icon name="person-circle" />
          <strong>{currentUser?.name}</strong>
          <span>
            ({isOwner && currentInstitution ? currentInstitution.name : 'Cliente'})
          </span>
        </span>
      </div>
    </header>
  );
}

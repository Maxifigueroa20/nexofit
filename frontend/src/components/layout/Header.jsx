import React from 'react';
import Icon from '../common/Icon';

export default function Header({ currentUser, currentInstitution }) {
  const isOwner = currentUser?.role === 'OWNER';

  return (
    <header className="app-window-top">
      <div className="d-flex align-items-baseline gap-2">
        <h1 className="brand-title mb-0">NexoFit</h1>
        <span className="brand-subtitle d-none d-sm-inline">
          &bull; Red Deportiva de Jujuy
        </span>
      </div>

      <div className="d-flex align-items-center gap-2">
        <span className="user-badge">
          <Icon name="person-fill" />
          <strong>{currentUser?.name}</strong>
          <span className="opacity-75">
            ({isOwner && currentInstitution ? currentInstitution.name : 'Cliente'})
          </span>
        </span>
      </div>
    </header>
  );
}

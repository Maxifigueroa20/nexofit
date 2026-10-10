import React from 'react';
import Icon from './Icon';

export default function Toast({ notification, onClose }) {
  if (!notification) return null;

  return (
    <div className="toast-container position-fixed bottom-0 end-0 p-3">
      <div className="toast show" role="alert" aria-live="assertive" aria-atomic="true">
        <div className="toast-header">
          <Icon name="bell-fill" className="text-primary me-2" />
          <strong className="me-auto">{notification.title}</strong>
          <small className="text-muted">En vivo</small>
          <button
            type="button"
            className="btn-close"
            onClick={onClose}
            aria-label="Cerrar"
          ></button>
        </div>
        <div className="toast-body">
          {notification.body}
        </div>
      </div>
    </div>
  );
}

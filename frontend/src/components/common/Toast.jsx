import React from 'react';
import ToastContainer from 'react-bootstrap/ToastContainer';
import BsToast from 'react-bootstrap/Toast';
import Icon from './Icon';

export default function Toast({ notification, onClose }) {
  if (!notification) return null;

  return (
    <ToastContainer position="bottom-end" className="p-3 position-fixed" style={{ zIndex: 1090 }}>
      <BsToast show={Boolean(notification)} onClose={onClose} delay={5000} autohide>
        <BsToast.Header>
          <Icon name="bell-fill" className="text-primary me-2" />
          <strong className="me-auto">{notification.title}</strong>
          <small className="text-muted">En vivo</small>
        </BsToast.Header>
        <BsToast.Body>{notification.body}</BsToast.Body>
      </BsToast>
    </ToastContainer>
  );
}

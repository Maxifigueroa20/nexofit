import React from 'react';
import BsModal from 'react-bootstrap/Modal';

export default function Modal({
  title,
  isOpen,
  onClose,
  children,
  dialogClassName = ''
}) {
  return (
    <BsModal
      show={Boolean(isOpen)}
      onHide={onClose}
      centered
      dialogClassName={dialogClassName}
    >
      <BsModal.Header closeButton>
        <BsModal.Title className="fs-6 fw-bold mb-0 text-white">
          {title}
        </BsModal.Title>
      </BsModal.Header>
      {children}
    </BsModal>
  );
}

Modal.Body = BsModal.Body;
Modal.Footer = BsModal.Footer;
Modal.Header = BsModal.Header;
Modal.Title = BsModal.Title;

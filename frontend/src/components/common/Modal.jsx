import React, { useEffect } from 'react';

export default function Modal({ title, isOpen, onClose, children }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.classList.remove('modal-open');
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      <div
        className="modal fade show d-block"
        tabIndex="-1"
        role="dialog"
        aria-modal="true"
        onClick={onClose}
      >
        <div
          className="modal-dialog modal-dialog-centered"
          role="document"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="modal-content">
            <div className="modal-header d-flex justify-content-between align-items-center">
              <h5 className="modal-title fs-6 fw-bold mb-0 text-white">
                {title}
              </h5>
              <button
                type="button"
                className="btn btn-sm btn-light py-0 px-2"
                onClick={onClose}
                aria-label="Cerrar"
              >
                ✕
              </button>
            </div>
            {children}
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show"></div>
    </>
  );
}

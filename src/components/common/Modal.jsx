import React, { useEffect } from 'react';

/**
 * Componente Modal accesible con soporte para cierre por teclado (Escape) y fondo.
 * 
 * @param {{
 *   isOpen: boolean,
 *   title: string,
 *   onClose: () => void,
 *   children: React.ReactNode
 * }} props
 */
export function Modal({ isOpen, title, onClose, children }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()} // Previene cierre al hacer clic dentro
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h3 id="modal-title" style={{ margin: 0, fontSize: '1.25rem', fontWeight: 600 }}>
            {title}
          </h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar modal"
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.5rem',
              lineHeight: '1',
              cursor: 'pointer',
              color: 'var(--text-muted)'
            }}
          >
            &times;
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

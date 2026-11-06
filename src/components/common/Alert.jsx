import React from 'react';

/**
 * Componente Alert para feedback al usuario (errores, advertencias, éxito).
 * 
 * @param {{
 *   type?: 'danger' | 'success' | 'warning' | 'info',
 *   message: string,
 *   onClose?: () => void
 * }} props
 */
export function Alert({ type = 'danger', message, onClose }) {
  if (!message) return null;

  const icons = {
    danger: '⚠️',
    success: '✅',
    warning: '⚡',
    info: 'ℹ️'
  };

  return (
    <div className={`alert alert-${type}`} role="alert">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1 }}>
        <span aria-hidden="true">{icons[type] || 'ℹ️'}</span>
        <span>{message}</span>
      </div>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar notificación"
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '1.1rem',
            color: 'inherit',
            opacity: 0.8
          }}
        >
          &times;
        </button>
      )}
    </div>
  );
}

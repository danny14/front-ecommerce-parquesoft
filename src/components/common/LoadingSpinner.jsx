import React from 'react';

/**
 * Componente de estado de carga con feedback visual accesible.
 * 
 * @param {{ message?: string }} props
 */
export function LoadingSpinner({ message = 'Cargando datos desde el servidor...' }) {
  return (
    <div className="spinner-container" role="status" aria-live="polite">
      <div className="spinner" />
      <p style={{ marginTop: '0.75rem', color: 'var(--text-muted)', fontSize: '0.95rem' }}>
        {message}
      </p>
    </div>
  );
}

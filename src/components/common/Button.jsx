import React from 'react';

/**
 * Componente de Botón reutilizable con variantes semánticas.
 * 
 * @param {{
 *   children: React.ReactNode,
 *   variant?: 'primary' | 'secondary' | 'danger' | 'outline',
 *   type?: 'button' | 'submit' | 'reset',
 *   onClick?: (e: React.MouseEvent) => void,
 *   disabled?: boolean,
 *   className?: string,
 *   style?: React.CSSProperties
 * }} props
 */
export function Button({
  children,
  variant = 'primary',
  type = 'button',
  onClick,
  disabled = false,
  className = '',
  style = {}
}) {
  const variantClass = `btn-${variant}`;

  return (
    <button
      type={type}
      className={`btn ${variantClass} ${className}`.trim()}
      onClick={onClick}
      disabled={disabled}
      style={style}
    >
      {children}
    </button>
  );
}

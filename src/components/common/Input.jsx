import React from 'react';

/**
 * Componente de Entrada de Formulario con soporte para etiquetas y errores de validación.
 * 
 * @param {{
 *   label: string,
 *   name: string,
 *   type?: string,
 *   value: string|number,
 *   onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
 *   placeholder?: string,
 *   required?: boolean,
 *   error?: string,
 *   step?: string,
 *   min?: string|number,
 *   disabled?: boolean
 * }} props
 */
export function Input({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder = '',
  required = false,
  error = null,
  step,
  min,
  disabled = false
}) {
  return (
    <div className="form-group">
      {label && (
        <label htmlFor={name} className="form-label">
          {label} {required && <span style={{ color: 'var(--danger)' }}>*</span>}
        </label>
      )}
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        step={step}
        min={min}
        disabled={disabled}
        className={`form-input ${error ? 'form-input-error' : ''}`.trim()}
      />
      {error && (
        <span className="form-error-text" role="alert">
          {error}
        </span>
      )}
    </div>
  );
}

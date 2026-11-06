import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { Alert } from '../common/Alert';
import { validateCustomerData } from '../../utils/validators';

const INITIAL_FORM_STATE = {
  fullName: '',
  email: '',
  loyaltyPoints: '0'
};

/**
 * Modal controlado para creación y edición de clientes.
 * 
 * @param {{
 *   isOpen: boolean,
 *   onClose: () => void,
 *   onSubmit: (customerData: object) => Promise<{ success: boolean, error?: string }>,
 *   initialData?: object | null
 * }} props
 */
export function CustomerFormModal({ isOpen, onClose, onSubmit, initialData = null }) {
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [fieldErrors, setFieldErrors] = useState({});
  const [serverError, setServerError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditMode = Boolean(initialData && initialData.id);

  // Sincronizar datos al abrir modal
  useEffect(() => {
    if (initialData) {
      setFormData({
        fullName: initialData.fullName || '',
        email: initialData.email || '',
        loyaltyPoints: initialData.loyaltyPoints !== undefined ? String(initialData.loyaltyPoints) : '0'
      });
    } else {
      setFormData(INITIAL_FORM_STATE);
    }
    setFieldErrors({});
    setServerError(null);
  }, [initialData, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Limpiar error del campo
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError(null);

    // Validación defensiva en cliente
    const validation = validateCustomerData(formData);
    if (!validation.isValid) {
      setFieldErrors(validation.errors);
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        fullName: formData.fullName.trim(),
        email: formData.email.trim().toLowerCase(),
        loyaltyPoints: parseInt(formData.loyaltyPoints, 10)
      };

      const result = await onSubmit(payload);
      if (result.success) {
        onClose();
      } else {
        setServerError(result.error || 'Error al guardar el cliente');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      title={isEditMode ? 'Editar Cliente' : 'Registrar Nuevo Cliente'}
      onClose={onClose}
    >
      {serverError && (
        <div style={{ marginBottom: '1rem' }}>
          <Alert type="danger" message={serverError} onClose={() => setServerError(null)} />
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <Input
          label="Nombre Completo"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          placeholder="Ej. Juan Pérez"
          required
          error={fieldErrors.fullName}
        />

        <Input
          label="Correo Electrónico"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="juan.perez@ejemplo.com"
          required
          error={fieldErrors.email}
        />

        <Input
          label="Puntos de Fidelidad"
          name="loyaltyPoints"
          type="number"
          step="1"
          min="0"
          value={formData.loyaltyPoints}
          onChange={handleChange}
          placeholder="0"
          required
          error={fieldErrors.loyaltyPoints}
        />

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
          <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button variant="primary" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Guardando...' : (isEditMode ? 'Actualizar Cliente' : 'Guardar Cliente')}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

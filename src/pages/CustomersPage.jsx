import React, { useState } from 'react';
import { useCustomers } from '../hooks/useCustomers';
import { useAuth } from '../context/AuthContext';
import { CustomerList } from '../components/customers/CustomerList';
import { CustomerFormModal } from '../components/customers/CustomerFormModal';
import { Button } from '../components/common/Button';
import { Alert } from '../components/common/Alert';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

/**
 * Vista administrativa de Clientes protegida estrictamente por RBAC (ROLE_ADMIN).
 * Cumple con el contrato de seguridad de /api/customers del backend Spring Boot.
 */
export function CustomersPage() {
  const { isAdmin, setIsLoginModalOpen } = useAuth();
  const { customers, isLoading, error, reload, addCustomer, updateCustomer, removeCustomer } = useCustomers();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [notification, setNotification] = useState(null);

  // Si el usuario no tiene permisos de administrador, mostramos pantalla de acceso denegado
  if (!isAdmin) {
    return (
      <div style={{ maxWidth: '600px', margin: '3rem auto' }}>
        <div className="card" style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
          <span role="img" aria-label="Acceso Denegado" style={{ fontSize: '3.5rem', display: 'block', marginBottom: '1rem' }}>
            🔒
          </span>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.75rem' }}>
            Módulo Protegido: Solo Administradores
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '1.5rem' }}>
            El módulo de clientes (<code>/api/customers</code>) requiere permisos de nivel{' '}
            <strong>ROLE_ADMIN</strong> según el contrato de seguridad de Spring Boot. Los visitantes o
            usuarios con rol <strong>ROLE_USER</strong> no tienen autorización para consultar ni modificar esta información.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem' }}>
            <Button variant="primary" onClick={() => setIsLoginModalOpen(true)}>
              Iniciar Sesión como Administrador
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const handleOpenCreate = () => {
    setEditingCustomer(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (customer) => {
    setEditingCustomer(customer);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCustomer(null);
  };

  const handleFormSubmit = async (customerData) => {
    if (editingCustomer) {
      const res = await updateCustomer(editingCustomer.id, customerData);
      if (res.success) {
        setNotification({ type: 'success', message: 'Cliente actualizado correctamente en la base de datos.' });
      }
      return res;
    } else {
      const res = await addCustomer(customerData);
      if (res.success) {
        setNotification({ type: 'success', message: 'Cliente registrado exitosamente en Spring Boot.' });
      }
      return res;
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm('¿Está seguro de desactivar a este cliente en el sistema?');
    if (!confirmed) return;

    const res = await removeCustomer(id);
    if (res.success) {
      setNotification({ type: 'info', message: 'Cliente desactivado lógicamente.' });
    } else {
      setNotification({ type: 'danger', message: res.error || 'Error al desactivar el cliente.' });
    }
  };

  return (
    <section aria-labelledby="customers-heading">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <h2 id="customers-heading" style={{ fontSize: '1.75rem', fontWeight: 700, margin: 0 }}>
              Gestión de Clientes
            </h2>
            <span className="badge badge-primary" style={{ fontSize: '0.7rem' }}>
              PROTEGIDO: ROLE_ADMIN
            </span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: '0.25rem 0 0' }}>
            Control de usuarios, membresías y puntos de fidelidad en <code>/api/customers</code>
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Button variant="secondary" onClick={reload} disabled={isLoading}>
            🔄 Recargar
          </Button>
          <Button variant="primary" onClick={handleOpenCreate}>
            + Nuevo Cliente
          </Button>
        </div>
      </div>

      {notification && (
        <div style={{ marginBottom: '1.25rem' }}>
          <Alert
            type={notification.type}
            message={notification.message}
            onClose={() => setNotification(null)}
          />
        </div>
      )}

      {isLoading && <LoadingSpinner message="Consultando clientes en http://localhost:8081/api/customers..." />}

      {error && !isLoading && (
        <div style={{ marginBottom: '1.5rem' }}>
          <Alert type="danger" message={error} />
        </div>
      )}

      {!isLoading && !error && (
        <CustomerList
          customers={customers}
          onEdit={handleOpenEdit}
          onDelete={handleDelete}
        />
      )}

      <CustomerFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleFormSubmit}
        initialData={editingCustomer}
      />
    </section>
  );
}

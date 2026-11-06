import React from 'react';
import { Button } from '../common/Button';

const VIP_THRESHOLD = 100;

/**
 * Componente presentacional para la lista de clientes.
 * 
 * @param {{
 *   customers: Array<{ id: number|string, fullName: string, email: string, loyaltyPoints: number, active: boolean }>,
 *   onEdit: (customer: object) => void,
 *   onDelete: (id: number|string) => void
 * }} props
 */
export function CustomerList({ customers, onEdit, onDelete }) {
  if (!customers || customers.length === 0) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '3rem 1rem' }}>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', margin: 0 }}>
          👥 No hay clientes registrados en la base de datos.
        </p>
      </div>
    );
  }

  return (
    <div className="card table-responsive">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre Completo</th>
            <th>Correo Electrónico</th>
            <th>Puntos de Fidelidad</th>
            <th>Categoría</th>
            <th>Estado</th>
            <th style={{ textAlign: 'right' }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer) => {
            const isVip = (customer.loyaltyPoints || 0) >= VIP_THRESHOLD;
            return (
              <tr key={customer.id}>
                <td>{customer.id}</td>
                <td>
                  <strong>{customer.fullName}</strong>
                </td>
                <td>{customer.email}</td>
                <td>{customer.loyaltyPoints ?? 0} pts</td>
                <td>
                  {isVip ? (
                    <span className="badge badge-success">⭐ VIP</span>
                  ) : (
                    <span className="badge badge-neutral">Estándar</span>
                  )}
                </td>
                <td>
                  <span className={`badge ${customer.active ? 'badge-success' : 'badge-danger'}`}>
                    {customer.active ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                    <Button
                      variant="secondary"
                      className="btn-sm"
                      onClick={() => onEdit(customer)}
                      disabled={!customer.active}
                    >
                      Editar
                    </Button>
                    {customer.active && (
                      <Button
                        variant="danger"
                        className="btn-sm"
                        onClick={() => onDelete(customer.id)}
                      >
                        Desactivar
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

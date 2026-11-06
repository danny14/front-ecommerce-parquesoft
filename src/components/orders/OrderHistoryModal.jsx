import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { orderService } from '../../services/orderService';
import { formatCurrency } from '../../utils/validators';

/**
 * Modal de Historial de Pedidos para el usuario autenticado ("Mis Pedidos").
 */
export function OrderHistoryModal() {
  const { isHistoryOpen, setIsHistoryOpen } = useCart();
  const { user, isAuthenticated, setIsLoginModalOpen } = useAuth();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (isHistoryOpen && user?.email) {
      const userOrders = orderService.getOrdersByUser(user.email);
      setOrders(userOrders);
    }
  }, [isHistoryOpen, user]);

  if (!isHistoryOpen) return null;

  if (!isAuthenticated) {
    return (
      <Modal isOpen={isHistoryOpen} title="Mis Pedidos" onClose={() => setIsHistoryOpen(false)}>
        <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
          <span role="img" aria-label="Candado" style={{ fontSize: '3rem', display: 'block', marginBottom: '0.75rem' }}>
            🔒
          </span>
          <h3 style={{ marginBottom: '0.5rem' }}>Inicia sesión para ver tus pedidos</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            Debes ingresar con tu cuenta para acceder al historial de compras.
          </p>
          <Button
            variant="primary"
            onClick={() => {
              setIsHistoryOpen(false);
              setIsLoginModalOpen(true);
            }}
          >
            Iniciar Sesión
          </Button>
        </div>
      </Modal>
    );
  }

  return (
    <Modal
      isOpen={isHistoryOpen}
      title={`📜 Mis Pedidos (${orders.length})`}
      onClose={() => setIsHistoryOpen(false)}
    >
      <div className="order-history-container">
        {orders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
            <span role="img" aria-label="Sin pedidos" style={{ fontSize: '3rem', display: 'block', marginBottom: '0.75rem' }}>
              📦
            </span>
            <p style={{ fontWeight: 600, fontSize: '1.1rem', marginBottom: '0.25rem' }}>
              Aún no has realizado ninguna orden de compra
            </p>
            <p style={{ fontSize: '0.875rem' }}>
              Explora nuestra tienda y descubre los mejores artículos tecnológicos.
            </p>
          </div>
        ) : (
          <div className="order-history-list">
            {orders.map((ord) => (
              <div key={ord.id} className="card order-history-card">
                <div className="order-history-card-header">
                  <div>
                    <strong style={{ fontSize: '1rem', color: 'var(--primary)' }}>
                      {ord.orderNumber}
                    </strong>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block' }}>
                      {new Date(ord.createdAt).toLocaleDateString('es-CO', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span className="badge badge-success" style={{ marginBottom: '0.25rem' }}>
                      {ord.status}
                    </span>
                    <strong style={{ display: 'block', fontSize: '1.05rem' }}>
                      {formatCurrency(ord.total)}
                    </strong>
                  </div>
                </div>

                <div className="order-history-card-body">
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                    📍 Envío a: <strong>{ord.shippingAddress?.address}, {ord.shippingAddress?.city}</strong>
                  </p>
                  <ul className="order-history-items-list">
                    {ord.items?.map((it, i) => (
                      <li key={i}>
                        {it.quantity}x {it.name} - {formatCurrency(it.subtotal || it.price * it.quantity)}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.25rem' }}>
          <Button variant="secondary" onClick={() => setIsHistoryOpen(false)}>
            Cerrar
          </Button>
        </div>
      </div>
    </Modal>
  );
}

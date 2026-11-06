import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { formatCurrency } from '../../utils/validators';
import { Button } from './Button';

/**
 * Barra de Navegación de Tienda Real (E-Commerce Header).
 * Incluye barra de anuncios promocionales, accesos a catálogo,
 * acceso a "Mis Pedidos", estado de sesión y activador del carrito con subtotal.
 * 
 * @param {{
 *   activeTab: 'home' | 'products' | 'customers' | 'login',
 *   onTabChange: (tab: 'home' | 'products' | 'customers' | 'login') => void
 * }} props
 */
export function Navbar({ activeTab, onTabChange }) {
  const { user, isAuthenticated, isAdmin, logout, setIsLoginModalOpen } = useAuth();
  const { totalItems, subtotal, setIsCartOpen, setIsHistoryOpen } = useCart();

  return (
    <header className="store-header">
      {/* 1. Barra Superior de Anuncios Promocionales */}
      <div className="store-top-announcement-bar">
        <span>🚚 Envío Gratis en pedidos superiores a US$ 50.00</span>
        <span className="announcement-divider">•</span>
        <span>🛡️ Compra 100% Protegida con Garantía Oficial</span>
        <span className="announcement-divider">•</span>
        <span>💳 Hasta 12 cuotas sin interés</span>
      </div>

      {/* 2. Barra Principal de Navegación */}
      <div className="navbar">
        <div className="navbar-left">
          <button
            type="button"
            className="navbar-brand-btn"
            onClick={() => onTabChange('home')}
            title="Ir a la tienda principal"
          >
            <span role="img" aria-label="Carrito" className="brand-logo-icon">
              🛒
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <span className="navbar-brand-text">E-Commerce Parquesoft</span>
              <span className="navbar-brand-tagline">Tienda Oficial de Tecnología</span>
            </div>
          </button>

          <nav className="navbar-nav" aria-label="Navegación principal">
            <button
              type="button"
              className={`nav-button ${activeTab === 'home' ? 'active' : ''}`}
              onClick={() => onTabChange('home')}
            >
              🛍️ Catálogo Tienda
            </button>

            <button
              type="button"
              className={`nav-button ${activeTab === 'products' ? 'active' : ''}`}
              onClick={() => onTabChange('products')}
            >
              📦 Inventario {isAdmin && <span className="badge badge-primary-xs">ADMIN</span>}
            </button>

            <button
              type="button"
              className={`nav-button ${activeTab === 'customers' ? 'active' : ''}`}
              onClick={() => onTabChange('customers')}
            >
              👥 Clientes {!isAdmin && <span style={{ fontSize: '0.75rem', opacity: 0.7 }}>🔒</span>}
            </button>
          </nav>
        </div>

        <div className="navbar-right">
          {/* Botón Flotante de Carrito con Conteo y Precio */}
          <button
            type="button"
            className="cart-nav-btn"
            onClick={() => setIsCartOpen(true)}
            aria-label="Abrir carrito de compras"
          >
            <div className="cart-nav-icon-wrap">
              <span style={{ fontSize: '1.25rem' }}>🛒</span>
              {totalItems > 0 && <span className="cart-nav-badge">{totalItems}</span>}
            </div>
            <div className="cart-nav-text">
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Mi Cesta:</span>
              <strong style={{ fontSize: '0.875rem', color: 'var(--primary)' }}>
                {formatCurrency(subtotal)}
              </strong>
            </div>
          </button>

          {/* Menú de Usuario / Autenticación */}
          {isAuthenticated ? (
            <div className="user-session-box">
              <div className="user-info-text">
                <span className="user-name">{user?.fullName || user?.email}</span>
                <span
                  className={`badge ${isAdmin ? 'badge-primary' : 'badge-success'}`}
                  style={{ fontSize: '0.65rem', padding: '0.1rem 0.35rem' }}
                >
                  {isAdmin ? 'ADMINISTRADOR' : 'COMPRADOR'}
                </span>
              </div>

              {/* Botón Mis Pedidos para compradores */}
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={() => setIsHistoryOpen(true)}
                title="Consultar historial de órdenes"
              >
                📜 Mis Pedidos
              </button>

              <Button
                variant="outline"
                className="btn-sm"
                onClick={logout}
                title="Cerrar sesión actual"
              >
                Salir
              </Button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <Button
                variant="primary"
                className="btn-sm"
                onClick={() => setIsLoginModalOpen(true)}
              >
                🔑 Iniciar Sesión / Registrarse
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

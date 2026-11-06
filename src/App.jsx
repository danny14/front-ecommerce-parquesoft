import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { Navbar } from './components/common/Navbar';
import { HomePage } from './pages/HomePage';
import { ProductsPage } from './pages/ProductsPage';
import { CustomersPage } from './pages/CustomersPage';
import { LoginPage } from './pages/LoginPage';
import { CartDrawer } from './components/cart/CartDrawer';
import { LoginFormModal } from './components/auth/LoginFormModal';
import { CheckoutModal } from './components/checkout/CheckoutModal';
import { OrderSuccessModal } from './components/checkout/OrderSuccessModal';
import { OrderHistoryModal } from './components/orders/OrderHistoryModal';

/**
 * Shell Principal de la Aplicación E-Commerce.
 * Orquesta la navegación de pestañas y encapsula los modales de la pasarela de compra.
 */
function MainContent() {
  const [activeTab, setActiveTab] = useState('home');

  return (
    <div className="app-layout">
      <Navbar activeTab={activeTab} onTabChange={setActiveTab} />
      
      <main className="container" id="main-content">
        {activeTab === 'home' && <HomePage />}
        {activeTab === 'products' && <ProductsPage />}
        {activeTab === 'customers' && <CustomersPage />}
        {activeTab === 'login' && <LoginPage onSuccessRedirect={setActiveTab} />}
      </main>

      {/* Pie de Página de Tienda Real */}
      <footer className="store-footer">
        <div className="store-footer-inner container">
          <div>
            <h4 style={{ fontWeight: 800, color: 'var(--primary)', marginBottom: '0.5rem' }}>
              🛒 E-Commerce Parquesoft
            </h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', maxWidth: '380px' }}>
              Plataforma desarrollada para el curso de Spring Boot 3 & React 18.
              Integración completa de catálogo, carrito, control de stock, seguridad JWT y órdenes.
            </p>
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-main)', display: 'block', marginBottom: '0.5rem' }}>
              MÉTODOS DE PAGO ACEPTADOS:
            </span>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              <span className="badge badge-neutral">💳 Visa / MasterCard</span>
              <span className="badge badge-neutral">🏦 PSE / Bancolombia</span>
              <span className="badge badge-neutral">📱 Nequi / Daviplata</span>
              <span className="badge badge-neutral">💵 Contra Entrega</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Modales y Drawers Globales del Flujo de Compra */}
      <CartDrawer />
      <LoginFormModal />
      <CheckoutModal />
      <OrderSuccessModal />
      <OrderHistoryModal />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <MainContent />
      </CartProvider>
    </AuthProvider>
  );
}

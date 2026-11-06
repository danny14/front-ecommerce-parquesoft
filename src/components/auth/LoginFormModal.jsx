import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { Alert } from '../common/Alert';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { isValidEmail } from '../../utils/validators';

/**
 * Modal interactivo con pestañas de "Iniciar Sesión" y "Registrarse",
 * con integración especial para el flujo de compra pendiente (Checkout Gate).
 */
export function LoginFormModal() {
  const { isLoginModalOpen, setIsLoginModalOpen, login, register } = useAuth();
  const { pendingCheckout } = useCart();
  const [tab, setTab] = useState('login'); // 'login' | 'register'
  
  // Estados de Login
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Estados de Registro
  const [regFullName, setRegFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regRole, setRegRole] = useState('ROLE_USER');

  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isLoginModalOpen) return null;

  const handleClose = () => {
    setError(null);
    setIsLoginModalOpen(false);
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!isValidEmail(email)) {
      setError('Por favor ingresa un correo electrónico válido.');
      return;
    }
    if (!password) {
      setError('La contraseña es requerida.');
      return;
    }

    setIsSubmitting(true);
    try {
      await login(email, password);
      handleClose();
    } catch (err) {
      setError(err.message || 'Error al autenticar credenciales.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!regFullName.trim() || regFullName.trim().length < 3) {
      setError('El nombre completo debe tener al menos 3 caracteres.');
      return;
    }
    if (!isValidEmail(regEmail)) {
      setError('Por favor ingresa un correo electrónico válido.');
      return;
    }
    if (!regPassword || regPassword.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    setIsSubmitting(true);
    try {
      await register({
        fullName: regFullName,
        email: regEmail,
        password: regPassword,
        role: regRole
      });
      handleClose();
    } catch (err) {
      setError(err.message || 'Error al registrar el usuario.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickFill = (testEmail, testPassword) => {
    setTab('login');
    setEmail(testEmail);
    setPassword(testPassword);
    setError(null);
  };

  return (
    <Modal
      isOpen={isLoginModalOpen}
      title={tab === 'login' ? 'Identifícate en la Tienda' : 'Crear Cuenta de Cliente'}
      onClose={handleClose}
    >
      {/* Aviso especial cuando se requiere login para completar el pago */}
      {pendingCheckout && (
        <div style={{ marginBottom: '1.25rem' }}>
          <Alert
            type="info"
            message="🔒 Inicia sesión o regístrate para completar tu compra. Tus productos seleccionados están guardados y se abrirá el paso de pago inmediatamente."
          />
        </div>
      )}

      {/* Selector de Pestañas Login / Registro */}
      <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', marginBottom: '1.25rem' }}>
        <button
          type="button"
          onClick={() => { setTab('login'); setError(null); }}
          style={{
            flex: 1,
            padding: '0.6rem',
            background: 'none',
            border: 'none',
            borderBottom: tab === 'login' ? '2px solid var(--primary)' : 'none',
            fontWeight: tab === 'login' ? 700 : 500,
            color: tab === 'login' ? 'var(--primary)' : 'var(--text-muted)',
            cursor: 'pointer'
          }}
        >
          Iniciar Sesión
        </button>
        <button
          type="button"
          onClick={() => { setTab('register'); setError(null); }}
          style={{
            flex: 1,
            padding: '0.6rem',
            background: 'none',
            border: 'none',
            borderBottom: tab === 'register' ? '2px solid var(--primary)' : 'none',
            fontWeight: tab === 'register' ? 700 : 500,
            color: tab === 'register' ? 'var(--primary)' : 'var(--text-muted)',
            cursor: 'pointer'
          }}
        >
          Crear Cuenta
        </button>
      </div>

      {/* Acceso Rápido con Usuarios Seeder de Spring Boot */}
      <div style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--border)', marginBottom: '1.25rem' }}>
        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.4rem' }}>
          Cuentas Rápidas de Prueba:
        </span>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button
            type="button"
            className="badge"
            style={{ background: '#f0fdf4', color: 'var(--success)', border: '1px solid #bbf7d0', cursor: 'pointer' }}
            onClick={() => handleQuickFill('comprador@ecommerce.com', 'user123')}
          >
            🛍️ Comprador (comprador@ecommerce.com / user123)
          </button>
          <button
            type="button"
            className="badge"
            style={{ background: '#eff6ff', color: 'var(--primary)', border: '1px solid #bfdbfe', cursor: 'pointer' }}
            onClick={() => handleQuickFill('admin@ecommerce.com', 'admin123')}
          >
            👑 Admin (admin@ecommerce.com / admin123)
          </button>
        </div>
      </div>

      {error && (
        <div style={{ marginBottom: '1rem' }}>
          <Alert type="danger" message={error} onClose={() => setError(null)} />
        </div>
      )}

      {tab === 'login' ? (
        <form onSubmit={handleLoginSubmit} noValidate>
          <Input
            label="Correo Electrónico"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="comprador@ecommerce.com"
            required
          />

          <Input
            label="Contraseña"
            name="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <Button variant="secondary" onClick={handleClose} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button variant="primary" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Autenticando...' : 'Iniciar Sesión y Continuar'}
            </Button>
          </div>
        </form>
      ) : (
        <form onSubmit={handleRegisterSubmit} noValidate>
          <Input
            label="Nombre Completo"
            name="regFullName"
            type="text"
            value={regFullName}
            onChange={(e) => setRegFullName(e.target.value)}
            placeholder="Ej. Carlos Gómez"
            required
          />

          <Input
            label="Correo Electrónico"
            name="regEmail"
            type="email"
            value={regEmail}
            onChange={(e) => setRegEmail(e.target.value)}
            placeholder="carlos@ejemplo.com"
            required
          />

          <Input
            label="Contraseña (mínimo 6 caracteres)"
            name="regPassword"
            type="password"
            value={regPassword}
            onChange={(e) => setRegPassword(e.target.value)}
            placeholder="••••••••"
            required
          />

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <Button variant="secondary" onClick={handleClose} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button variant="primary" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Registrando...' : 'Registrarme y Comprar'}
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}

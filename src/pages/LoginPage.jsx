import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { Alert } from '../components/common/Alert';
import { isValidEmail } from '../utils/validators';

/**
 * Vista de Página completa para Autenticación JWT y Registro.
 * Cumple con la especificación de /pages/LoginPage.jsx en la arquitectura del curso.
 * 
 * @param {{ onSuccessRedirect: (targetTab: string) => void }} props
 */
export function LoginPage({ onSuccessRedirect }) {
  const { login, register, isAuthenticated, user, logout } = useAuth();
  const [tab, setTab] = useState('login'); // 'login' | 'register'

  // Credenciales de Login
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Credenciales de Registro
  const [fullName, setFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [role, setRole] = useState('ROLE_USER');

  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async (e) => {
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
      const res = await login(email, password);
      if (onSuccessRedirect) {
        onSuccessRedirect(res.user.role === 'ROLE_ADMIN' ? 'products' : 'home');
      }
    } catch (err) {
      setError(err.message || 'Error de conexión con el backend.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);

    if (!fullName.trim() || fullName.trim().length < 3) {
      setError('El nombre completo debe tener al menos 3 caracteres.');
      return;
    }
    if (!isValidEmail(regEmail)) {
      setError('Por favor ingresa un correo electrónico válido.');
      return;
    }
    if (!regPassword || regPassword.length < 6) {
      setError('La contraseña debe tener mínimo 6 caracteres.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await register({ fullName, email: regEmail, password: regPassword, role });
      if (onSuccessRedirect) {
        onSuccessRedirect(res.user.role === 'ROLE_ADMIN' ? 'products' : 'home');
      }
    } catch (err) {
      setError(err.message || 'Error al procesar el registro.');
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

  if (isAuthenticated) {
    return (
      <div style={{ maxWidth: '500px', margin: '3rem auto' }}>
        <div className="card" style={{ textAlign: 'center', padding: '2.5rem 1.5rem' }}>
          <span role="img" aria-label="Usuario logueado" style={{ fontSize: '3.5rem', display: 'block', marginBottom: '1rem' }}>
            👤
          </span>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.5rem' }}>
            Sesión Activa
          </h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
            Conectado como: <strong>{user?.fullName}</strong>
          </p>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
            Correo: {user?.email} | Rol: <span className="badge badge-primary">{user?.role}</span>
          </p>

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
            <Button variant="primary" onClick={() => onSuccessRedirect && onSuccessRedirect('home')}>
              Ir a la Tienda
            </Button>
            {user?.role === 'ROLE_ADMIN' && (
              <Button variant="secondary" onClick={() => onSuccessRedirect && onSuccessRedirect('products')}>
                Panel Admin
              </Button>
            )}
            <Button variant="outline" onClick={logout}>
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '480px', margin: '2rem auto' }}>
      <div className="card">
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <span role="img" aria-label="Candado" style={{ fontSize: '2.5rem', display: 'block', marginBottom: '0.5rem' }}>
            🔐
          </span>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>
            {tab === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta'}
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            E-Commerce Parquesoft API Security (JWT)
          </p>
        </div>

        {/* Pestañas Login / Registro */}
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
            Ingresar
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
            Registrarse
          </button>
        </div>

        {/* Acceso Rápido con Seeder Backend */}
        <div style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--border)', marginBottom: '1.25rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.4rem' }}>
            Cuentas Pre-cargadas en Spring Boot:
          </span>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button
              type="button"
              className="badge"
              style={{ background: '#eff6ff', color: 'var(--primary)', border: '1px solid #bfdbfe', cursor: 'pointer' }}
              onClick={() => handleQuickFill('admin@ecommerce.com', 'admin123')}
            >
              👑 Admin (admin@ecommerce.com / admin123)
            </button>
            <button
              type="button"
              className="badge"
              style={{ background: '#f0fdf4', color: 'var(--success)', border: '1px solid #bbf7d0', cursor: 'pointer' }}
              onClick={() => handleQuickFill('comprador@ecommerce.com', 'user123')}
            >
              🛍️ Comprador (comprador@ecommerce.com / user123)
            </button>
          </div>
        </div>

        {error && (
          <div style={{ marginBottom: '1rem' }}>
            <Alert type="danger" message={error} onClose={() => setError(null)} />
          </div>
        )}

        {tab === 'login' ? (
          <form onSubmit={handleLogin} noValidate>
            <Input
              label="Correo Electrónico"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@ecommerce.com"
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

            <Button
              variant="primary"
              type="submit"
              disabled={isSubmitting}
              style={{ width: '100%', marginTop: '1rem' }}
            >
              {isSubmitting ? 'Autenticando...' : 'Iniciar Sesión'}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleRegister} noValidate>
            <Input
              label="Nombre Completo"
              name="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Ej. Carlos Mendoza"
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

            <div className="form-group">
              <label className="form-label">Rol Deseado</label>
              <select
                className="form-input"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="ROLE_USER">Comprador (ROLE_USER)</option>
                <option value="ROLE_ADMIN">Administrador (ROLE_ADMIN)</option>
              </select>
            </div>

            <Button
              variant="primary"
              type="submit"
              disabled={isSubmitting}
              style={{ width: '100%', marginTop: '1rem' }}
            >
              {isSubmitting ? 'Registrando...' : 'Crear Cuenta'}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}

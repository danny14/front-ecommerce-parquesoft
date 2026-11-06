import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

/**
 * Proveedor de Contexto de Autenticación y Autorización basada en Roles (RBAC).
 * Centraliza la sesión, emisión de JWT y permisos para toda la aplicación.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  // Inicializar estado de sesión desde localStorage al arrancar la app
  useEffect(() => {
    const savedToken = authService.getToken();
    const savedUser = authService.getCurrentUser();
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(savedUser);
    }
    setIsLoadingAuth(false);
  }, []);

  /**
   * Inicia sesión con email y contraseña contra Spring Boot.
   * @param {string} email 
   * @param {string} password 
   */
  const login = async (email, password) => {
    const session = await authService.login(email, password);
    setUser(session.user);
    setToken(session.token);
    setIsLoginModalOpen(false);
    return session;
  };

  /**
   * Registra un nuevo usuario en la plataforma.
   * @param {{ fullName: string, email: string, password: string, role?: string }} data 
   */
  const register = async (data) => {
    const session = await authService.register(data);
    setUser(session.user);
    setToken(session.token);
    setIsLoginModalOpen(false);
    return session;
  };

  /**
   * Cierra la sesión activa.
   */
  const logout = () => {
    authService.logout();
    setUser(null);
    setToken(null);
  };

  const value = {
    user,
    token,
    isAuthenticated: Boolean(user && token),
    isAdmin: user?.role === 'ROLE_ADMIN',
    isUser: user?.role === 'ROLE_USER',
    isLoadingAuth,
    isLoginModalOpen,
    setIsLoginModalOpen,
    login,
    register,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook de conveniencia para acceder al contexto de autenticación
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser utilizado dentro de un AuthProvider');
  }
  return context;
}

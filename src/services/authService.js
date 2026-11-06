import { httpClient } from '../api/httpClient';

const TOKEN_KEY = 'ecommerce_auth_token';
const USER_KEY = 'ecommerce_auth_user';

/**
 * Servicio de Autenticación conectado a los endpoints reales de Spring Boot:
 * - POST /api/auth/login
 * - POST /api/auth/register
 * 
 * Gestiona la persistencia del JWT en localStorage y la sesión del usuario.
 */
export const authService = {
  /**
   * Autentica un usuario contra el backend Spring Boot.
   * Contrato del backend:
   * Body: { email, password }
   * Response: { token, tokenType, email, fullName, role }
   * 
   * @param {string} email 
   * @param {string} password 
   * @returns {Promise<{ user: { email: string, fullName: string, role: string }, token: string }>}
   */
  async login(email, password) {
    const cleanEmail = email.trim().toLowerCase();

    const response = await httpClient.post('/auth/login', {
      email: cleanEmail,
      password
    });

    if (!response || !response.token) {
      throw new Error('Respuesta de autenticación inválida del servidor.');
    }

    const userData = {
      email: response.email,
      fullName: response.fullName,
      role: response.role
    };

    this.saveSession(response.token, userData);

    return {
      token: response.token,
      user: userData
    };
  },

  /**
   * Registra un nuevo usuario en la base de datos a través de Spring Boot.
   * Contrato del backend:
   * Body: { fullName, email, password, role? }
   * Response: { token, tokenType, email, fullName, role }
   * 
   * @param {{ fullName: string, email: string, password: string, role?: string }} registerData 
   * @returns {Promise<{ user: { email: string, fullName: string, role: string }, token: string }>}
   */
  async register({ fullName, email, password, role = 'ROLE_USER' }) {
    const response = await httpClient.post('/auth/register', {
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      password,
      role
    });

    if (!response || !response.token) {
      throw new Error('Error al completar el registro en el servidor.');
    }

    const userData = {
      email: response.email,
      fullName: response.fullName,
      role: response.role
    };

    this.saveSession(response.token, userData);

    return {
      token: response.token,
      user: userData
    };
  },

  /**
   * Persiste el token JWT y los datos de usuario en localStorage.
   * @param {string} token 
   * @param {object} user 
   */
  saveSession(token, user) {
    try {
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    } catch (e) {
      console.error('Error al persistir sesión en localStorage:', e);
    }
  },

  /**
   * Recupera el token JWT almacenado.
   * @returns {string|null}
   */
  getToken() {
    return localStorage.getItem(TOKEN_KEY);
  },

  /**
   * Recupera el objeto de usuario de la sesión actual.
   * @returns {{ email: string, fullName: string, role: string } | null}
   */
  getCurrentUser() {
    try {
      const data = localStorage.getItem(USER_KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  /**
   * Cierra la sesión activa eliminando las credenciales de almacenamiento.
   */
  logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }
};

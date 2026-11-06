/**
 * Cliente HTTP modular basado en la API nativa Fetch con soporte de interceptores.
 * Gestiona de forma centralizada la URL base, cabeceras JSON, inyección de Bearer Token
 * y normalización de excepciones HTTP tipadas.
 */

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081/api';
const TOKEN_KEY = 'ecommerce_auth_token';

export class HttpError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = 'HttpError';
    this.status = status;
    this.data = data;
  }
}

/**
 * Función genérica de petición HTTP con manejo centralizado de errores y cabeceras.
 * Inyecta automáticamente 'Authorization: Bearer <token>' si existe sesión activa.
 * 
 * @param {string} endpoint - Ruta relativa al BASE_URL (ej. '/products', '/auth/login')
 * @param {RequestInit} options - Opciones de la petición fetch
 * @returns {Promise<any>} Respuesta deserializada en JSON o vacío si es 204
 */
export async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  
  // Recuperar token JWT persistido en localStorage
  const token = localStorage.getItem(TOKEN_KEY);

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {})
  };

  const response = await fetch(url, {
    ...options,
    headers
  });

  if (response.status === 204) {
    return null;
  }

  const contentType = response.headers.get('content-type');
  const isJson = contentType && contentType.includes('application/json');
  const data = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    // Manejo específico para 401 (No autorizado) y 403 (Prohibido por RBAC)
    if (response.status === 401) {
      console.warn('Sesión no autorizada o token expirado en', endpoint);
    } else if (response.status === 403) {
      console.warn('Acceso denegado (requiere permisos ROLE_ADMIN) en', endpoint);
    }

    const errorMessage = (typeof data === 'object' && data.message) 
      ? data.message 
      : (typeof data === 'string' && data.length > 0 ? data : `Error HTTP ${response.status}`);
      
    throw new HttpError(errorMessage, response.status, data);
  }

  return data;
}

export const httpClient = {
  get: (endpoint, headers) => request(endpoint, { method: 'GET', headers }),
  post: (endpoint, body, headers) => request(endpoint, { method: 'POST', body: JSON.stringify(body), headers }),
  put: (endpoint, body, headers) => request(endpoint, { method: 'PUT', body: JSON.stringify(body), headers }),
  delete: (endpoint, headers) => request(endpoint, { method: 'DELETE', headers })
};

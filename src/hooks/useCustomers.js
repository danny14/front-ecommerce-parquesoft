import { useState, useEffect, useCallback } from 'react';
import { customerService } from '../services/customerService';

/**
 * Custom Hook para gestionar el estado y operaciones CRUD de Clientes.
 * Desacopla la lógica de estado y llamadas de red de los componentes de UI.
 * 
 * @returns {{
 *   customers: Array,
 *   isLoading: boolean,
 *   error: string|null,
 *   reload: () => Promise<void>,
 *   addCustomer: (data: object) => Promise<{ success: boolean, data?: object, error?: string }>,
 *   updateCustomer: (id: number|string, data: object) => Promise<{ success: boolean, data?: object, error?: string }>,
 *   removeCustomer: (id: number|string) => Promise<{ success: boolean, error?: string }>
 * }}
 */
export function useCustomers() {
  const [customers, setCustomers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Carga la lista de clientes desde el backend
   */
  const fetchCustomers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await customerService.getAll();
      setCustomers(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Error al cargar los clientes.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  /**
   * Agrega un nuevo cliente
   * @param {object} customerData 
   */
  const addCustomer = async (customerData) => {
    try {
      const created = await customerService.create(customerData);
      setCustomers(prev => [...prev, created]);
      return { success: true, data: created };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  /**
   * Actualiza los datos de un cliente existente
   * @param {number|string} id 
   * @param {object} customerData 
   */
  const updateCustomer = async (id, customerData) => {
    try {
      const updated = await customerService.update(id, customerData);
      setCustomers(prev => prev.map(c => (c.id === id ? updated : c)));
      return { success: true, data: updated };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  /**
   * Desactiva lógicamente un cliente
   * @param {number|string} id 
   */
  const removeCustomer = async (id) => {
    try {
      await customerService.delete(id);
      // Soft delete: reflejar estado inactivo en memoria
      setCustomers(prev =>
        prev.map(c => (c.id === id ? { ...c, active: false } : c))
      );
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  return {
    customers,
    isLoading,
    error,
    reload: fetchCustomers,
    addCustomer,
    updateCustomer,
    removeCustomer
  };
}

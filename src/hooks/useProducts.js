import { useState, useEffect, useCallback } from 'react';
import { productService } from '../services/productService';

/**
 * Custom Hook para gestionar el ciclo de vida, estado y mutaciones de productos.
 * Encapsula la orquestación asíncrona y aísla la capa de presentación de la infraestructura de red.
 * 
 * @returns {{
 *   products: Array,
 *   isLoading: boolean,
 *   error: string|null,
 *   reload: () => Promise<void>,
 *   addProduct: (data: object) => Promise<{ success: boolean, data?: object, error?: string }>,
 *   updateProduct: (id: number|string, data: object) => Promise<{ success: boolean, data?: object, error?: string }>,
 *   removeProduct: (id: number|string) => Promise<{ success: boolean, error?: string }>
 * }}
 */
export function useProducts() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Carga la lista completa de productos desde el backend
   */
  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await productService.getAll();
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Error al cargar los productos');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  /**
   * Crea un producto y actualiza la lista local de forma inmutable
   * @param {{ name: string, price: number, sku: string, stock: number }} productData 
   */
  const addProduct = async (productData) => {
    try {
      const created = await productService.create(productData);
      setProducts(prev => [...prev, created]);
      return { success: true, data: created };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  /**
   * Actualiza un producto existente
   * @param {number|string} id 
   * @param {object} productData 
   */
  const updateProduct = async (id, productData) => {
    try {
      const updated = await productService.update(id, productData);
      setProducts(prev => prev.map(p => (p.id === id ? updated : p)));
      return { success: true, data: updated };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  /**
   * Ejecuta borrado lógico y sincroniza el estado local
   * @param {number|string} id 
   */
  const removeProduct = async (id) => {
    try {
      await productService.delete(id);
      // Soft delete: actualizar el estado local a active: false
      setProducts(prev =>
        prev.map(p => (p.id === id ? { ...p, active: false } : p))
      );
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  return {
    products,
    isLoading,
    error,
    reload: fetchProducts,
    addProduct,
    updateProduct,
    removeProduct
  };
}

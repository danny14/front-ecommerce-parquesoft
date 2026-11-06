import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { orderService } from '../services/orderService';

const CART_STORAGE_KEY = 'ecommerce_cart_items';
const CartContext = createContext(null);

/**
 * Proveedor de Contexto para el Carrito de Compras y Flujo de Checkout.
 * Gestiona items, validación de stock, persistencia local y orquestación
 * del proceso de pago con verificación de sesión.
 */
export function CartProvider({ children }) {
  const { isAuthenticated, user, setIsLoginModalOpen } = useAuth();

  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Estados de modales y drawers
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  // Ítems específicos asignados para el checkout actual
  const [checkoutItems, setCheckoutItems] = useState([]);
  
  // Intención de compra pendiente (en caso de requerir inicio de sesión previo)
  const [pendingCheckout, setPendingCheckout] = useState(null);

  // Última orden creada para desplegar el comprobante de éxito
  const [lastCreatedOrder, setLastCreatedOrder] = useState(null);

  // Persistir carrito en localStorage
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error('Error al persistir carrito:', e);
    }
  }, [items]);

  // Si el usuario acaba de iniciar sesión y tenía una compra pendiente,
  // se abre automáticamente el modal de checkout sin fricción
  useEffect(() => {
    if (isAuthenticated && pendingCheckout) {
      setCheckoutItems(pendingCheckout);
      setPendingCheckout(null);
      setIsCheckoutOpen(true);
    }
  }, [isAuthenticated, pendingCheckout]);

  /**
   * Agrega un producto al carrito respetando el stock disponible.
   * @param {object} product 
   * @param {number} quantity 
   * @returns {{ success: boolean, message?: string }}
   */
  const addToCart = (product, quantity = 1) => {
    if (!product || product.stock <= 0) {
      return { success: false, message: 'El producto no cuenta con existencias disponibles.' };
    }

    const qtyToAdd = Math.max(1, parseInt(quantity, 10) || 1);

    setItems(prevItems => {
      const existingIndex = prevItems.findIndex(i => i.product.id === product.id);

      if (existingIndex > -1) {
        const existingItem = prevItems[existingIndex];
        const newTotalQty = existingItem.quantity + qtyToAdd;
        const validQty = Math.min(newTotalQty, product.stock);

        const updated = [...prevItems];
        updated[existingIndex] = {
          ...existingItem,
          product,
          quantity: validQty
        };
        return updated;
      } else {
        const initialQty = Math.min(qtyToAdd, product.stock);
        return [...prevItems, { product, quantity: initialQty }];
      }
    });

    return { success: true };
  };

  /**
   * Actualiza la cantidad de un ítem en el carrito.
   */
  const updateQuantity = (productId, newQuantity) => {
    const qty = parseInt(newQuantity, 10);
    if (isNaN(qty) || qty <= 0) {
      removeFromCart(productId);
      return;
    }

    setItems(prevItems =>
      prevItems.map(item => {
        if (item.product.id === productId) {
          const clampedQty = Math.min(qty, item.product.stock);
          return { ...item, quantity: clampedQty };
        }
        return item;
      })
    );
  };

  /**
   * Elimina un ítem del carrito.
   */
  const removeFromCart = (productId) => {
    setItems(prevItems => prevItems.filter(item => item.product.id !== productId));
  };

  /**
   * Vacía el carrito completo.
   */
  const clearCart = () => {
    setItems([]);
  };

  /**
   * Inicia el flujo de pago (Checkout).
   * Si no está autenticado, solicita login y guarda la intención de compra.
   * Si está autenticado, abre la pasarela de orden directamente.
   * 
   * @param {Array<{ product: object, quantity: number }>} [customItems] - Ítems a pagar (por defecto todo el carrito)
   */
  const proceedToCheckout = (customItems = null) => {
    const itemsToPay = customItems || items;

    if (!itemsToPay || itemsToPay.length === 0) {
      alert('Tu carrito está vacío. Agrega productos antes de proceder al pago.');
      return;
    }

    // Cerrar cajón de carrito
    setIsCartOpen(false);

    if (!isAuthenticated) {
      // Guardar intención de compra y abrir modal de login
      setPendingCheckout(itemsToPay);
      setIsLoginModalOpen(true);
    } else {
      // Usuario autenticado: abrir checkout directamente
      setCheckoutItems(itemsToPay);
      setIsCheckoutOpen(true);
    }
  };

  /**
   * Inicia la compra inmediata de un único producto (botón "Pagar Ahora" en tarjeta o detalle).
   * @param {object} product 
   * @param {number} quantity 
   */
  const buyNowSingleProduct = (product, quantity = 1) => {
    if (!product || product.stock <= 0) {
      alert('Este producto no tiene stock disponible.');
      return;
    }

    const singleItem = [{ product, quantity: Math.min(quantity, product.stock) }];
    proceedToCheckout(singleItem);
  };

  /**
   * Procesa y confirma la orden de compra.
   * @param {{ shippingAddress: object, paymentMethod: string }} checkoutDetails 
   */
  const finalizeOrder = async (checkoutDetails) => {
    if (!user) throw new Error('No hay una sesión activa de usuario.');

    const subtotal = checkoutItems.reduce(
      (acc, item) => acc + item.product.price * item.quantity,
      0
    );
    // Envío gratis en pedidos superiores a $50,000, de lo contrario $5,000
    const shippingCost = subtotal >= 50000 ? 0 : 5000;
    const total = subtotal + shippingCost;

    const orderPayload = {
      buyer: {
        fullName: user.fullName || 'Comprador Parquesoft',
        email: user.email
      },
      items: checkoutItems.map(i => ({
        id: i.product.id,
        name: i.product.name,
        sku: i.product.sku,
        price: i.product.price,
        quantity: i.quantity,
        subtotal: i.product.price * i.quantity
      })),
      shippingAddress: checkoutDetails.shippingAddress,
      paymentMethod: checkoutDetails.paymentMethod,
      subtotal,
      shippingCost,
      total
    };

    const createdOrder = await orderService.createOrder(orderPayload);

    // Si los ítems pagados eran del carrito, limpiar los ítems correspondientes
    const paidIds = new Set(checkoutItems.map(i => i.product.id));
    setItems(prev => prev.filter(i => !paidIds.has(i.product.id)));

    setLastCreatedOrder(createdOrder);
    setIsCheckoutOpen(false);
    setIsSuccessOpen(true);

    return createdOrder;
  };

  // Cálculos de totales
  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  const value = {
    items,
    isCartOpen,
    setIsCartOpen,
    isCheckoutOpen,
    setIsCheckoutOpen,
    isSuccessOpen,
    setIsSuccessOpen,
    isHistoryOpen,
    setIsHistoryOpen,
    checkoutItems,
    lastCreatedOrder,
    pendingCheckout,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    proceedToCheckout,
    buyNowSingleProduct,
    finalizeOrder,
    totalItems,
    subtotal
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe ser utilizado dentro de un CartProvider');
  }
  return context;
}

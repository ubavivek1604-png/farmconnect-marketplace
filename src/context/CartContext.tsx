import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Product } from '../types/index.ts';

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => { success: boolean; message?: string };
  updateQuantity: (productId: string, quantity: number) => { success: boolean; message?: string };
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  cartCount: number;
  subtotal: number;
  deliveryFee: number;
  totalAmount: number;
  groupedByFarmer: Record<string, { farmerName: string; farmCity?: string; items: CartItem[] }>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('farmconnect_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('farmconnect_cart', JSON.stringify(cart));
    } catch (e) {
      console.error('Failed to sync cart to storage:', e);
    }
  }, [cart]);

  const addToCart = (product: Product, quantity: number = 1): { success: boolean; message?: string } => {
    if (!product.isAvailable || product.quantity <= 0) {
      return { success: false, message: `${product.name} is currently out of stock.` };
    }

    const existingIndex = cart.findIndex(item => item.product.id === product.id);

    if (existingIndex > -1) {
      const currentQty = cart[existingIndex].quantity;
      const targetQty = currentQty + quantity;

      if (targetQty > product.quantity) {
        return {
          success: false,
          message: `Cannot add more. Maximum available stock is ${product.quantity} ${product.unit}.`
        };
      }

      const updated = [...cart];
      updated[existingIndex].quantity = targetQty;
      setCart(updated);
      return { success: true };
    } else {
      if (quantity > product.quantity) {
        return {
          success: false,
          message: `Only ${product.quantity} ${product.unit} available in farm inventory.`
        };
      }

      setCart([...cart, { product, quantity }]);
      return { success: true };
    }
  };

  const updateQuantity = (productId: string, quantity: number): { success: boolean; message?: string } => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return { success: true };
    }

    const item = cart.find(i => i.product.id === productId);
    if (!item) return { success: false, message: 'Item not in cart' };

    if (quantity > item.product.quantity) {
      return {
        success: false,
        message: `Only ${item.product.quantity} ${item.product.unit} available in stock.`
      };
    }

    setCart(cart.map(i => (i.product.id === productId ? { ...i, quantity } : i)));
    return { success: true };
  };

  const removeFromCart = (productId: string) => {
    setCart(cart.filter(i => i.product.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  const deliveryFee = subtotal > 0 ? (subtotal >= 500 ? 0 : 40) : 0;

  const totalAmount = subtotal + deliveryFee;

  // Group items by farmer for clear fulfillment breakdown
  const groupedByFarmer = cart.reduce<Record<string, { farmerName: string; farmCity?: string; items: CartItem[] }>>(
    (acc, item) => {
      const fId = item.product.farmerId;
      if (!acc[fId]) {
        acc[fId] = {
          farmerName: item.product.farmerName || 'Local Farm',
          farmCity: item.product.location?.city,
          items: []
        };
      }
      acc[fId].items.push(item);
      return acc;
    },
    {}
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        cartCount,
        subtotal,
        deliveryFee,
        totalAmount,
        groupedByFarmer
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

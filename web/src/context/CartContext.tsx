import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { Product } from '../types';

interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  webDiscount: number;
  offerDiscount: number;
  totalSaved: number;
  total: number;
  shippingCost: number;
  finalTotal: number;
  setShippingCost: (cost: number) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [shippingCost, setShippingCost] = useState(0);

  // Cargar carrito desde localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setItems(JSON.parse(savedCart));
    }
  }, []);

  // Guardar carrito en localStorage
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  const addItem = (product: Product, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.product.id === product.id
            ? { ...i, quantity: i.quantity + quantity }
            : i
        );
      }
      return [...prev, { product, quantity }];
    });
  };

  const removeItem = (productId: string) => {
    setItems((prev) => prev.filter((i) => i.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) {
      return;
    }
    setItems((prev) =>
      prev.map((i) =>
        i.product.id === productId ? { ...i, quantity } : i
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  // Calcular precio efectivo (offerPrice si existe, sino webPrice)
  const getEffectivePrice = (product: Product) => {
    return product.offerPrice ?? product.webPrice;
  };

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = items.reduce((sum, i) => sum + i.product.normalPrice * i.quantity, 0);
  const webDiscount = items.reduce(
    (sum, i) => sum + (i.product.normalPrice - i.product.webPrice) * i.quantity,
    0
  );
  const offerDiscount = items.reduce(
    (sum, i) => sum + ((i.product.webPrice ?? 0) - (i.product.offerPrice ?? 0)) * i.quantity,
    0
  );
  const totalSaved = webDiscount + offerDiscount;
  const total = items.reduce((sum, i) => sum + getEffectivePrice(i.product) * i.quantity, 0);
  const finalTotal = total + shippingCost;

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        subtotal,
        webDiscount,
        offerDiscount,
        totalSaved,
        total,
        shippingCost,
        finalTotal,
        setShippingCost,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

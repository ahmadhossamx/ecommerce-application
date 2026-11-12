import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('cart') || '[]');
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  const add = (product, qty = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.product === product._id);
      if (existing) {
        return prev.map((i) => (i.product === product._id ? { ...i, qty: i.qty + qty } : i));
      }
      return [...prev, { product: product._id, name: product.name, price: product.price, image: product.image, qty }];
    });
  };
  const remove = (productId) => setItems((prev) => prev.filter((i) => i.product !== productId));
  const clear = () => setItems([]);
  const total = useMemo(() => items.reduce((sum, i) => sum + i.price * i.qty, 0), [items]);

  return <CartContext.Provider value={{ items, add, remove, clear, total }}>{children}</CartContext.Provider>;
}

export function useCart() {
  return useContext(CartContext);
}

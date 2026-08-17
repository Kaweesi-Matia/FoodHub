import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

const CartContext = createContext(null);
const STORAGE_KEY = "foodhub_cart";

export function CartProvider({ children }) {
  const [restaurantId, setRestaurantId] = useState(null);
  const [restaurantName, setRestaurantName] = useState(null);
  const [items, setItems] = useState([]);

  // Persist cart to localStorage so a refresh doesn't lose it
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setRestaurantId(parsed.restaurantId || null);
        setRestaurantName(parsed.restaurantName || null);
        setItems(parsed.items || []);
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ restaurantId, restaurantName, items })
    );
  }, [restaurantId, restaurantName, items]);

  const addItem = (menuItem, restaurant) => {
    // Cart items must all come from the same restaurant
    if (restaurantId && restaurantId !== restaurant._id) {
      const confirmSwitch = window.confirm(
        `Your cart has items from ${restaurantName}. Start a new cart for ${restaurant.name}?`
      );
      if (!confirmSwitch) return;
      setItems([]);
    }

    setRestaurantId(restaurant._id);
    setRestaurantName(restaurant.name);

    setItems((prev) => {
      const existing = prev.find((i) => i.menuItem === menuItem._id);
      if (existing) {
        return prev.map((i) =>
          i.menuItem === menuItem._id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [
        ...prev,
        {
          menuItem: menuItem._id,
          name: menuItem.name,
          price: menuItem.price,
          image: menuItem.image,
          quantity: 1,
        },
      ];
    });
    toast.success(`Added ${menuItem.name} to cart`);
  };

  const updateQuantity = (menuItemId, quantity) => {
    if (quantity < 1) {
      removeItem(menuItemId);
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.menuItem === menuItemId ? { ...i, quantity } : i))
    );
  };

  const removeItem = (menuItemId) => {
    setItems((prev) => prev.filter((i) => i.menuItem !== menuItemId));
  };

  const clearCart = () => {
    setItems([]);
    setRestaurantId(null);
    setRestaurantName(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  const itemsCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        restaurantId,
        restaurantName,
        items,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
        itemsCount,
        subtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
};

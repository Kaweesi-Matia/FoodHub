import { Link, useNavigate } from "react-router-dom";
import { Minus, Plus, Trash2, ShoppingCart } from "lucide-react";
import { useCart } from "../context/CartContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import EmptyState from "../components/EmptyState.jsx";

export default function Cart() {
  const { items, restaurantName, updateQuantity, removeItem, subtotal } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <EmptyState
        icon={ShoppingCart}
        title="Your cart is empty"
        message="Browse restaurants and add some delicious food."
        action={
          <Link to="/" className="btn-primary mt-2">
            Browse restaurants
          </Link>
        }
      />
    );
  }

  const handleCheckout = () => {
    if (!user) {
      navigate("/login", { state: { from: { pathname: "/checkout" } } });
      return;
    }
    navigate("/checkout");
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-gray-900">Your cart</h1>
      <p className="mt-1 text-sm text-gray-500">Ordering from {restaurantName}</p>

      <div className="mt-6 space-y-3">
        {items.map((item) => (
          <div key={item.menuItem} className="card flex items-center gap-4 p-4">
            <img src={item.image} alt={item.name} className="h-16 w-16 rounded-lg object-cover" />
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium text-gray-900">{item.name}</p>
              <p className="text-sm text-gray-500">${item.price.toFixed(2)}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => updateQuantity(item.menuItem, item.quantity - 1)}
                className="rounded-full border border-gray-300 p-1 hover:bg-gray-100"
              >
                <Minus size={14} />
              </button>
              <span className="w-5 text-center text-sm font-medium">{item.quantity}</span>
              <button
                onClick={() => updateQuantity(item.menuItem, item.quantity + 1)}
                className="rounded-full border border-gray-300 p-1 hover:bg-gray-100"
              >
                <Plus size={14} />
              </button>
            </div>
            <button
              onClick={() => removeItem(item.menuItem)}
              className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-600"
            >
              <Trash2 size={18} />
            </button>
          </div>
        ))}
      </div>

      <div className="card mt-6 p-4">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>Subtotal</span>
          <span className="font-medium text-gray-900">${subtotal.toFixed(2)}</span>
        </div>
        <p className="mt-1 text-xs text-gray-400">Delivery fee and tax calculated at checkout</p>
      </div>

      <button onClick={handleCheckout} className="btn-primary mt-4 w-full">
        Proceed to checkout
      </button>
    </div>
  );
}

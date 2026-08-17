import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { ShoppingCart, User, Menu, X, LogOut, UtensilsCrossed } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { itemsCount } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    setMenuOpen(false);
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-40 border-b border-gray-100 bg-white/90 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2 text-xl font-extrabold text-primary-600">
          <UtensilsCrossed size={24} />
          FoodHub
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          <Link to="/" className="text-sm font-medium text-gray-700 hover:text-primary-600">
            Restaurants
          </Link>
          {user && (
            <Link to="/orders" className="text-sm font-medium text-gray-700 hover:text-primary-600">
              My Orders
            </Link>
          )}
          {(user?.role === "restaurantOwner" || user?.role === "admin") && (
            <Link to="/dashboard" className="text-sm font-medium text-gray-700 hover:text-primary-600">
              Dashboard
            </Link>
          )}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <Link to="/cart" className="relative rounded-lg p-2 hover:bg-gray-100">
            <ShoppingCart size={22} />
            {itemsCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary-600 text-xs font-bold text-white">
                {itemsCount}
              </span>
            )}
          </Link>

          {user ? (
            <div className="flex items-center gap-2">
              <Link to="/profile" className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium hover:bg-gray-100">
                <User size={18} />
                {user.name.split(" ")[0]}
              </Link>
              <button onClick={handleLogout} className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-red-600" title="Log out">
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="btn-outline">Log in</Link>
              <Link to="/register" className="btn-primary">Sign up</Link>
            </div>
          )}
        </div>

        <button className="p-2 md:hidden" onClick={() => setMenuOpen((o) => !o)}>
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {menuOpen && (
        <div className="border-t border-gray-100 px-4 pb-4 md:hidden">
          <div className="flex flex-col gap-1 pt-2">
            <Link to="/" onClick={() => setMenuOpen(false)} className="rounded-lg px-3 py-2 hover:bg-gray-100">Restaurants</Link>
            <Link to="/cart" onClick={() => setMenuOpen(false)} className="rounded-lg px-3 py-2 hover:bg-gray-100">Cart ({itemsCount})</Link>
            {user && (
              <>
                <Link to="/orders" onClick={() => setMenuOpen(false)} className="rounded-lg px-3 py-2 hover:bg-gray-100">My Orders</Link>
                <Link to="/profile" onClick={() => setMenuOpen(false)} className="rounded-lg px-3 py-2 hover:bg-gray-100">Profile</Link>
              </>
            )}
            {(user?.role === "restaurantOwner" || user?.role === "admin") && (
              <Link to="/dashboard" onClick={() => setMenuOpen(false)} className="rounded-lg px-3 py-2 hover:bg-gray-100">Dashboard</Link>
            )}
            {user ? (
              <button onClick={handleLogout} className="mt-1 rounded-lg px-3 py-2 text-left text-red-600 hover:bg-red-50">Log out</button>
            ) : (
              <div className="mt-2 flex gap-2">
                <Link to="/login" onClick={() => setMenuOpen(false)} className="btn-outline flex-1">Log in</Link>
                <Link to="/register" onClick={() => setMenuOpen(false)} className="btn-primary flex-1">Sign up</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

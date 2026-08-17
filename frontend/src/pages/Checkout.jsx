import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useCart } from "../context/CartContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { fetchRestaurantById } from "../api/restaurantApi.js";
import { createOrder } from "../api/orderApi.js";
import Loader from "../components/Loader.jsx";

export default function Checkout() {
  const { items, restaurantId, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [restaurant, setRestaurant] = useState(null);
  const [address, setAddress] = useState({ street: "", city: "", postalCode: "", instructions: "" });
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [placing, setPlacing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!restaurantId || items.length === 0) {
      navigate("/cart");
      return;
    }
    (async () => {
      try {
        const res = await fetchRestaurantById(restaurantId);
        setRestaurant(res.data);
        const defaultAddr = user?.addresses?.find((a) => a.isDefault) || user?.addresses?.[0];
        if (defaultAddr) {
          setAddress({
            street: defaultAddr.street,
            city: defaultAddr.city,
            postalCode: defaultAddr.postalCode || "",
            instructions: "",
          });
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [restaurantId, items.length, navigate, user]);

  if (loading) return <Loader label="Preparing checkout..." />;
  if (!restaurant) return null;

  const deliveryFee = restaurant.deliveryFee;
  const taxPrice = Number((subtotal * 0.05).toFixed(2));
  const totalPrice = Number((subtotal + deliveryFee + taxPrice).toFixed(2));

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!address.street || !address.city) {
      toast.error("Please provide a delivery street and city");
      return;
    }
    setPlacing(true);
    try {
      const res = await createOrder({
        restaurantId,
        items,
        deliveryAddress: address,
        paymentMethod,
      });
      clearCart();
      toast.success("Order placed successfully!");
      navigate(`/orders/${res.data._id}`);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>

      <form onSubmit={handlePlaceOrder} className="mt-6 space-y-6">
        <div className="card p-5">
          <h2 className="font-semibold text-gray-900">Delivery address</h2>
          <div className="mt-3 space-y-3">
            <input
              className="input"
              placeholder="Street address"
              value={address.street}
              onChange={(e) => setAddress({ ...address, street: e.target.value })}
              required
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                className="input"
                placeholder="City"
                value={address.city}
                onChange={(e) => setAddress({ ...address, city: e.target.value })}
                required
              />
              <input
                className="input"
                placeholder="Postal code (optional)"
                value={address.postalCode}
                onChange={(e) => setAddress({ ...address, postalCode: e.target.value })}
              />
            </div>
            <textarea
              className="input"
              placeholder="Delivery instructions (optional)"
              rows={2}
              value={address.instructions}
              onChange={(e) => setAddress({ ...address, instructions: e.target.value })}
            />
          </div>
        </div>

        <div className="card p-5">
          <h2 className="font-semibold text-gray-900">Payment method</h2>
          <div className="mt-3 space-y-2">
            {[
              { value: "cash", label: "Cash on delivery" },
              { value: "mobileMoney", label: "Mobile money" },
              { value: "card", label: "Card" },
            ].map((opt) => (
              <label
                key={opt.value}
                className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 ${
                  paymentMethod === opt.value ? "border-primary-600 bg-primary-50" : "border-gray-200"
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value={opt.value}
                  checked={paymentMethod === opt.value}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <span className="text-sm font-medium">{opt.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="card p-5">
          <h2 className="font-semibold text-gray-900">Order summary</h2>
          <div className="mt-3 space-y-1.5 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Delivery fee</span>
              <span>${deliveryFee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Tax</span>
              <span>${taxPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between border-t border-gray-100 pt-1.5 font-semibold text-gray-900">
              <span>Total</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <button type="submit" disabled={placing} className="btn-primary w-full">
          {placing ? "Placing order..." : `Place order · $${totalPrice.toFixed(2)}`}
        </button>
      </form>
    </div>
  );
}

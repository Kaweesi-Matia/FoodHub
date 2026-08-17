import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { MapPin, CreditCard } from "lucide-react";
import { fetchOrderById, cancelOrder } from "../api/orderApi.js";
import { createReview } from "../api/reviewApi.js";
import OrderStatusBadge from "../components/OrderStatusBadge.jsx";
import StarRating from "../components/StarRating.jsx";
import Loader from "../components/Loader.jsx";
import EmptyState from "../components/EmptyState.jsx";

const STEPS = ["pending", "confirmed", "preparing", "outForDelivery", "delivered"];

export default function OrderDetails() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const loadOrder = async () => {
    try {
      const res = await fetchOrderById(id);
      setOrder(res.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleCancel = async () => {
    if (!window.confirm("Cancel this order?")) return;
    try {
      await cancelOrder(id);
      toast.success("Order cancelled");
      loadOrder();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleReview = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error("Please select a star rating");
      return;
    }
    try {
      await createReview({ orderId: id, rating, comment });
      toast.success("Thanks for your review!");
      setReviewSubmitted(true);
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (loading) return <Loader label="Loading order..." />;
  if (error) return <EmptyState title="Couldn't load this order" message={error} />;
  if (!order) return null;

  const currentStepIndex = STEPS.indexOf(order.status);
  const isCancelled = order.status === "cancelled";

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Order #{order._id.slice(-6).toUpperCase()}</h1>
        <OrderStatusBadge status={order.status} />
      </div>
      <p className="mt-1 text-sm text-gray-500">{order.restaurant?.name}</p>

      {/* Progress tracker */}
      {!isCancelled && (
        <div className="card mt-6 p-5">
          <div className="flex items-center justify-between">
            {STEPS.map((step, idx) => (
              <div key={step} className="flex flex-1 flex-col items-center">
                <div
                  className={`h-3 w-3 rounded-full ${
                    idx <= currentStepIndex ? "bg-primary-600" : "bg-gray-200"
                  }`}
                />
                {idx < STEPS.length - 1 && (
                  <div
                    className={`h-0.5 w-full ${idx < currentStepIndex ? "bg-primary-600" : "bg-gray-200"}`}
                  />
                )}
              </div>
            ))}
          </div>
          <p className="mt-3 text-center text-sm font-medium text-gray-700">
            {order.status === "delivered" ? "Delivered — enjoy your meal!" : `Status: ${order.status}`}
          </p>
        </div>
      )}

      {/* Items */}
      <div className="card mt-4 divide-y divide-gray-100 p-5">
        {order.items.map((item) => (
          <div key={item.menuItem} className="flex justify-between py-2 text-sm">
            <span>
              {item.quantity} × {item.name}
            </span>
            <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
        <div className="flex justify-between pt-2 text-sm text-gray-600">
          <span>Delivery fee</span>
          <span>${order.deliveryFee.toFixed(2)}</span>
        </div>
        <div className="flex justify-between pt-2 text-sm text-gray-600">
          <span>Tax</span>
          <span>${order.taxPrice.toFixed(2)}</span>
        </div>
        <div className="flex justify-between pt-2 font-bold text-gray-900">
          <span>Total</span>
          <span>${order.totalPrice.toFixed(2)}</span>
        </div>
      </div>

      <div className="card mt-4 space-y-2 p-5 text-sm text-gray-600">
        <p className="flex items-center gap-2">
          <MapPin size={16} /> {order.deliveryAddress.street}, {order.deliveryAddress.city}
        </p>
        <p className="flex items-center gap-2">
          <CreditCard size={16} /> {order.paymentMethod}
        </p>
      </div>

      {["pending", "confirmed"].includes(order.status) && (
        <button onClick={handleCancel} className="btn-danger mt-4 w-full">
          Cancel order
        </button>
      )}

      {order.status === "delivered" && !reviewSubmitted && (
        <form onSubmit={handleReview} className="card mt-4 space-y-3 p-5">
          <h2 className="font-semibold text-gray-900">Rate your order</h2>
          <StarRating value={rating} onChange={setRating} />
          <textarea
            className="input"
            placeholder="Share your experience (optional)"
            rows={3}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <button type="submit" className="btn-primary w-full">
            Submit review
          </button>
        </form>
      )}
    </div>
  );
}

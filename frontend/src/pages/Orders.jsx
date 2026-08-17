import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PackageSearch } from "lucide-react";
import { fetchMyOrders } from "../api/orderApi.js";
import OrderStatusBadge from "../components/OrderStatusBadge.jsx";
import Loader from "../components/Loader.jsx";
import EmptyState from "../components/EmptyState.jsx";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetchMyOrders();
        setOrders(res.data);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <Loader label="Loading your orders..." />;

  if (orders.length === 0) {
    return (
      <EmptyState
        icon={PackageSearch}
        title="No orders yet"
        message="Once you place an order, it will show up here."
        action={
          <Link to="/" className="btn-primary mt-2">
            Browse restaurants
          </Link>
        }
      />
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-gray-900">My orders</h1>

      <div className="mt-6 space-y-3">
        {orders.map((order) => (
          <Link
            key={order._id}
            to={`/orders/${order._id}`}
            className="card flex items-center gap-4 p-4 hover:shadow-md"
          >
            <img
              src={order.restaurant?.coverImage}
              alt={order.restaurant?.name}
              className="h-14 w-14 rounded-lg object-cover"
            />
            <div className="min-w-0 flex-1">
              <p className="font-medium text-gray-900">{order.restaurant?.name}</p>
              <p className="text-sm text-gray-500">
                {order.items.length} item{order.items.length > 1 ? "s" : ""} · $
                {order.totalPrice.toFixed(2)}
              </p>
              <p className="text-xs text-gray-400">
                {new Date(order.createdAt).toLocaleDateString(undefined, {
                  day: "numeric",
                  month: "short",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
            <OrderStatusBadge status={order.status} />
          </Link>
        ))}
      </div>
    </div>
  );
}

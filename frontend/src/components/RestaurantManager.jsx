import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Plus, Trash2, Pencil } from "lucide-react";
import {
  fetchRestaurantMenu,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  updateRestaurant,
} from "../api/restaurantApi.js";
import { fetchRestaurantOrders, updateOrderStatus } from "../api/orderApi.js";
import OrderStatusBadge from "./OrderStatusBadge.jsx";
import Loader from "./Loader.jsx";

const NEXT_STATUS = {
  pending: "confirmed",
  confirmed: "preparing",
  preparing: "outForDelivery",
  outForDelivery: "delivered",
};

const emptyItemForm = { name: "", description: "", price: "", category: "", isVegetarian: false };

export default function RestaurantManager({ restaurantId }) {
  const [tab, setTab] = useState("orders");
  const [orders, setOrders] = useState([]);
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [itemForm, setItemForm] = useState(emptyItemForm);
  const [editingId, setEditingId] = useState(null);
  const [savingItem, setSavingItem] = useState(false);
  const [isOpen, setIsOpen] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const [ordersRes, menuRes] = await Promise.all([
        fetchRestaurantOrders(restaurantId),
        fetchRestaurantMenu(restaurantId),
      ]);
      setOrders(ordersRes.data);
      setMenu(menuRes.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    setEditingId(null);
    setItemForm(emptyItemForm);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [restaurantId]);

  const handleAdvanceStatus = async (order) => {
    const next = NEXT_STATUS[order.status];
    if (!next) return;
    try {
      await updateOrderStatus(order._id, next);
      toast.success(`Order marked as ${next}`);
      load();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleToggleOpen = async () => {
    try {
      await updateRestaurant(restaurantId, { isOpen: !isOpen });
      setIsOpen((o) => !o);
      toast.success(`Restaurant is now ${!isOpen ? "open" : "closed"}`);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleItemSubmit = async (e) => {
    e.preventDefault();
    setSavingItem(true);
    const payload = { ...itemForm, price: Number(itemForm.price), restaurant: restaurantId };
    try {
      if (editingId) {
        await updateMenuItem(editingId, payload);
        toast.success("Menu item updated");
      } else {
        await createMenuItem(payload);
        toast.success("Menu item added");
      }
      setItemForm(emptyItemForm);
      setEditingId(null);
      load();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSavingItem(false);
    }
  };

  const handleEditItem = (item) => {
    setEditingId(item._id);
    setItemForm({
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category,
      isVegetarian: item.isVegetarian,
    });
  };

  const handleDeleteItem = async (id) => {
    if (!window.confirm("Delete this menu item?")) return;
    try {
      await deleteMenuItem(id);
      toast.success("Menu item removed");
      load();
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (loading) return <Loader label="Loading restaurant data..." />;

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          {["orders", "menu"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`rounded-lg px-4 py-2 text-sm font-medium capitalize ${
                tab === t ? "bg-primary-600 text-white" : "bg-gray-100 text-gray-600"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        <button onClick={handleToggleOpen} className="btn-outline !py-1.5 !text-sm">
          {isOpen ? "Close restaurant" : "Reopen restaurant"}
        </button>
      </div>

      {tab === "orders" && (
        <div className="mt-4 space-y-3">
          {orders.length === 0 ? (
            <p className="py-8 text-center text-sm text-gray-500">No orders yet</p>
          ) : (
            orders.map((order) => (
              <div key={order._id} className="card p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{order.user?.name}</p>
                    <p className="text-xs text-gray-500">{order.user?.phone}</p>
                  </div>
                  <OrderStatusBadge status={order.status} />
                </div>
                <ul className="mt-2 text-sm text-gray-600">
                  {order.items.map((i) => (
                    <li key={i.menuItem}>
                      {i.quantity} × {i.name}
                    </li>
                  ))}
                </ul>
                <div className="mt-2 flex items-center justify-between">
                  <span className="font-semibold text-gray-900">${order.totalPrice.toFixed(2)}</span>
                  {NEXT_STATUS[order.status] && (
                    <button onClick={() => handleAdvanceStatus(order)} className="btn-primary !py-1.5 !text-sm">
                      Mark as {NEXT_STATUS[order.status]}
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {tab === "menu" && (
        <div className="mt-4">
          <form onSubmit={handleItemSubmit} className="card space-y-3 p-4">
            <h3 className="font-semibold text-gray-900">
              {editingId ? "Edit menu item" : "Add menu item"}
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <input className="input" placeholder="Name" required
                value={itemForm.name} onChange={(e) => setItemForm({ ...itemForm, name: e.target.value })} />
              <input className="input" placeholder="Category" required
                value={itemForm.category} onChange={(e) => setItemForm({ ...itemForm, category: e.target.value })} />
            </div>
            <textarea className="input" placeholder="Description" rows={2}
              value={itemForm.description} onChange={(e) => setItemForm({ ...itemForm, description: e.target.value })} />
            <div className="flex items-center gap-4">
              <input type="number" step="0.01" min="0" className="input w-32" placeholder="Price" required
                value={itemForm.price} onChange={(e) => setItemForm({ ...itemForm, price: e.target.value })} />
              <label className="flex items-center gap-2 text-sm text-gray-600">
                <input type="checkbox" checked={itemForm.isVegetarian}
                  onChange={(e) => setItemForm({ ...itemForm, isVegetarian: e.target.checked })} />
                Vegetarian
              </label>
            </div>
            <div className="flex gap-2">
              <button type="submit" disabled={savingItem} className="btn-primary">
                <Plus size={16} /> {editingId ? "Save changes" : "Add item"}
              </button>
              {editingId && (
                <button type="button" className="btn-outline" onClick={() => { setEditingId(null); setItemForm(emptyItemForm); }}>
                  Cancel
                </button>
              )}
            </div>
          </form>

          <div className="mt-4 space-y-2">
            {menu.map((item) => (
              <div key={item._id} className="card flex items-center justify-between p-3">
                <div>
                  <p className="text-sm font-medium text-gray-900">{item.name}</p>
                  <p className="text-xs text-gray-500">{item.category} · ${item.price.toFixed(2)}</p>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => handleEditItem(item)} className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700">
                    <Pencil size={16} />
                  </button>
                  <button onClick={() => handleDeleteItem(item._id)} className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-600">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

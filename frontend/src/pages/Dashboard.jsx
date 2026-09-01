import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Plus, Store } from "lucide-react";
import { fetchMyRestaurants, createRestaurant } from "../api/restaurantApi.js";
import RestaurantManager from "../components/RestaurantManager.jsx";
import Loader from "../components/Loader.jsx";
import EmptyState from "../components/EmptyState.jsx";

export default function Dashboard() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeId, setActiveId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", description: "", street: "", city: "" });
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  const loadRestaurants = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetchMyRestaurants();
      setRestaurants(res.data);
      if (res.data.length > 0) setActiveId((prev) => prev || res.data[0]._id);
    } catch (err) {
      setError(err.message || "Could not load restaurants");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRestaurants();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      const res = await createRestaurant({
        name: form.name,
        description: form.description,
        address: { street: form.street, city: form.city },
      });
      toast.success("Restaurant created — pending admin approval");
      setForm({ name: "", description: "", street: "", city: "" });
      setShowForm(false);
      await loadRestaurants();
      setActiveId(res.data._id);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setCreating(false);
    }
  };

  if (loading) return <Loader label="Loading your dashboard..." />;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Restaurant dashboard</h1>
        <button onClick={() => setShowForm((s) => !s)} className="btn-outline">
          <Plus size={16} /> New restaurant
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="card mt-4 space-y-3 p-5">
          <input className="input" placeholder="Restaurant name" required
            value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <textarea className="input" placeholder="Description" required rows={2}
            value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <div className="grid grid-cols-2 gap-3">
            <input className="input" placeholder="Street" required
              value={form.street} onChange={(e) => setForm({ ...form, street: e.target.value })} />
            <input className="input" placeholder="City" required
              value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
          </div>
          <button type="submit" disabled={creating} className="btn-primary">
            {creating ? "Creating..." : "Create restaurant"}
          </button>
        </form>
      )}

      {error ? (
        <EmptyState title="Couldn't load restaurants" message={error} />
      ) : restaurants.length === 0 ? (
        <EmptyState
          icon={Store}
          title="No restaurants yet"
          message="Create your first restaurant to start receiving orders."
        />
      ) : (
        <>
          <div className="mt-6 flex gap-2 overflow-x-auto pb-1">
            {restaurants.map((r) => (
              <button
                key={r._id}
                onClick={() => setActiveId(r._id)}
                className={`whitespace-nowrap rounded-full border px-4 py-1.5 text-sm font-medium ${
                  activeId === r._id
                    ? "border-primary-600 bg-primary-600 text-white"
                    : "border-gray-200 text-gray-600 hover:bg-gray-100"
                }`}
              >
                {r.name} {!r.isApproved && "(pending)"}
              </button>
            ))}
          </div>

          {activeId && <RestaurantManager restaurantId={activeId} />}
        </>
      )}
    </div>
  );
}

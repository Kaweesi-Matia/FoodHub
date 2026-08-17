import { useEffect, useState, useCallback } from "react";
import { Search, UtensilsCrossed } from "lucide-react";
import { fetchRestaurants } from "../api/restaurantApi.js";
import RestaurantCard from "../components/RestaurantCard.jsx";
import Loader from "../components/Loader.jsx";
import EmptyState from "../components/EmptyState.jsx";

const CUISINES = ["Ugandan", "Grill", "Pizza", "Chinese", "Indian", "Fast Food", "Vegetarian"];

export default function Home() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [cuisine, setCuisine] = useState("");
  const [error, setError] = useState("");

  const loadRestaurants = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = {};
      if (search) params.search = search;
      if (cuisine) params.cuisine = cuisine;
      const res = await fetchRestaurants(params);
      setRestaurants(res.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [search, cuisine]);

  useEffect(() => {
    const timeout = setTimeout(loadRestaurants, 300); // debounce search input
    return () => clearTimeout(timeout);
  }, [loadRestaurants]);

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-700 py-16 text-white">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="text-3xl font-extrabold sm:text-5xl">Craving something good?</h1>
          <p className="mx-auto mt-3 max-w-xl text-primary-100">
            Order from the best local restaurants, delivered fast to your door.
          </p>

          <div className="mx-auto mt-8 flex max-w-xl items-center gap-2 rounded-xl bg-white p-2 shadow-lg">
            <Search size={20} className="ml-2 shrink-0 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search restaurants or cuisines..."
              className="w-full border-none py-2 text-gray-900 focus:outline-none focus:ring-0"
            />
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Cuisine filter chips */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setCuisine("")}
            className={`badge border ${
              cuisine === "" ? "border-primary-600 bg-primary-600 text-white" : "border-gray-200 text-gray-600"
            }`}
          >
            All
          </button>
          {CUISINES.map((c) => (
            <button
              key={c}
              onClick={() => setCuisine(c)}
              className={`badge border ${
                cuisine === c ? "border-primary-600 bg-primary-600 text-white" : "border-gray-200 text-gray-600"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <h2 className="mt-6 text-xl font-bold text-gray-900">
          {search || cuisine ? "Search results" : "Popular near you"}
        </h2>

        {loading ? (
          <Loader label="Finding great food..." />
        ) : error ? (
          <EmptyState title="Something went wrong" message={error} />
        ) : restaurants.length === 0 ? (
          <EmptyState
            icon={UtensilsCrossed}
            title="No restaurants found"
            message="Try a different search term or cuisine."
          />
        ) : (
          <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {restaurants.map((r) => (
              <RestaurantCard key={r._id} restaurant={r} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

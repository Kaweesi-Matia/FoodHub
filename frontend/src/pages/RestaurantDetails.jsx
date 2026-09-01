import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Star, Clock, Bike, MapPin } from "lucide-react";
import { fetchRestaurantById, fetchRestaurantMenu } from "../api/restaurantApi.js";
import { fetchRestaurantReviews } from "../api/reviewApi.js";
import { useCart } from "../context/CartContext.jsx";
import MenuItemCard from "../components/MenuItemCard.jsx";
import StarRating from "../components/StarRating.jsx";
import Loader from "../components/Loader.jsx";
import EmptyState from "../components/EmptyState.jsx";

export default function RestaurantDetails() {
  const { id } = useParams();
  const { addItem } = useCart();

  const [restaurant, setRestaurant] = useState(null);
  const [menu, setMenu] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError("");
      try {
        const [restaurantRes, menuRes, reviewsRes] = await Promise.allSettled([
          fetchRestaurantById(id),
          fetchRestaurantMenu(id),
          fetchRestaurantReviews(id),
        ]);
        if (restaurantRes.status !== "fulfilled") {
          throw restaurantRes.reason;
        }
        setRestaurant(restaurantRes.value.data);
        setMenu(menuRes.status === "fulfilled" ? menuRes.value.data : []);
        setReviews(reviewsRes.status === "fulfilled" ? reviewsRes.value.data : []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) return <Loader label="Loading restaurant..." />;
  if (error) return <EmptyState title="Couldn't load this restaurant" message={error} />;
  if (!restaurant) return null;

  const categories = ["All", ...new Set(menu.map((m) => m.category))];
  const visibleItems =
    activeCategory === "All" ? menu : menu.filter((m) => m.category === activeCategory);

  return (
    <div>
      <div className="h-56 w-full bg-gray-200 sm:h-72">
        <img src={restaurant.coverImage} alt={restaurant.name} className="h-full w-full object-cover" />
      </div>

      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-extrabold text-gray-900 sm:text-3xl">{restaurant.name}</h1>
        <p className="mt-1 text-gray-600">{restaurant.description}</p>

        <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-gray-600">
          <span className="flex items-center gap-1 font-medium text-gray-900">
            <Star size={16} className="fill-amber-400 text-amber-400" />
            {restaurant.rating > 0 ? restaurant.rating.toFixed(1) : "New"} ({restaurant.numReviews} reviews)
          </span>
          <span className="flex items-center gap-1">
            <Clock size={16} /> {restaurant.estimatedDeliveryTime}
          </span>
          <span className="flex items-center gap-1">
            <Bike size={16} /> ${restaurant.deliveryFee.toFixed(2)} delivery
          </span>
          <span className="flex items-center gap-1">
            <MapPin size={16} /> {restaurant.address.street}, {restaurant.address.city}
          </span>
        </div>

        {/* Category tabs */}
        <div className="mt-6 flex gap-2 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`whitespace-nowrap rounded-full border px-4 py-1.5 text-sm font-medium ${
                activeCategory === cat
                  ? "border-primary-600 bg-primary-600 text-white"
                  : "border-gray-200 text-gray-600 hover:bg-gray-100"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="mt-4 space-y-3">
          {visibleItems.length === 0 ? (
            <EmptyState title="No items in this category" />
          ) : (
            visibleItems.map((item) => (
              <MenuItemCard key={item._id} item={item} onAdd={(i) => addItem(i, restaurant)} />
            ))
          )}
        </div>

        {/* Reviews */}
        <div className="mt-10">
          <h2 className="text-lg font-bold text-gray-900">Reviews</h2>
          {reviews.length === 0 ? (
            <p className="mt-2 text-sm text-gray-500">No reviews yet — be the first to order and review!</p>
          ) : (
            <div className="mt-4 space-y-4">
              {reviews.map((rev) => (
                <div key={rev._id} className="card p-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900">{rev.user?.name || "Anonymous"}</span>
                    <StarRating value={rev.rating} readOnly size={16} />
                  </div>
                  {rev.comment && <p className="mt-1 text-sm text-gray-600">{rev.comment}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Sticky "view cart" bar shows on mobile once cart has items — Cart page link */}
      <Link
        to="/cart"
        className="fixed inset-x-4 bottom-4 z-30 hidden rounded-xl bg-primary-600 py-3 text-center font-semibold text-white shadow-lg sm:block sm:hidden"
      >
        View cart
      </Link>
    </div>
  );
}

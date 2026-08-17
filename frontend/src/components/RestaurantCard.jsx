import { Link } from "react-router-dom";
import { Star, Clock, Bike } from "lucide-react";

export default function RestaurantCard({ restaurant }) {
  return (
    <Link
      to={`/restaurants/${restaurant._id}`}
      className="card group overflow-hidden transition-shadow hover:shadow-md"
    >
      <div className="relative h-40 w-full overflow-hidden bg-gray-100">
        <img
          src={restaurant.coverImage}
          alt={restaurant.name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        {!restaurant.isOpen && (
          <span className="absolute inset-0 flex items-center justify-center bg-black/50 text-sm font-semibold text-white">
            Currently closed
          </span>
        )}
        {restaurant.isFeatured && (
          <span className="badge absolute left-2 top-2 bg-primary-600 text-white">Featured</span>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-gray-900 line-clamp-2">{restaurant.name}</h3>
          <span className="flex shrink-0 items-center gap-1 text-sm font-medium text-gray-700">
            <Star size={14} className="fill-amber-400 text-amber-400" />
            {restaurant.rating > 0 ? restaurant.rating.toFixed(1) : "New"}
          </span>
        </div>

        <p className="mt-1 text-sm text-gray-500 line-clamp-2">
          {restaurant.cuisine?.join(" · ") || "Various cuisines"}
        </p>

        <div className="mt-3 flex items-center gap-4 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <Clock size={14} /> {restaurant.estimatedDeliveryTime}
          </span>
          <span className="flex items-center gap-1">
            <Bike size={14} /> ${restaurant.deliveryFee?.toFixed(2)} delivery
          </span>
        </div>
      </div>
    </Link>
  );
}

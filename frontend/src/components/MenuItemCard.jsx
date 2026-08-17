import { Plus, Leaf } from "lucide-react";

export default function MenuItemCard({ item, onAdd }) {
  return (
    <div className="card flex items-center gap-4 p-4">
      <img
        src={item.image}
        alt={item.name}
        className="h-20 w-20 shrink-0 rounded-lg object-cover"
        loading="lazy"
      />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h4 className="truncate font-medium text-gray-900">{item.name}</h4>
          {item.isVegetarian && <Leaf size={14} className="shrink-0 text-green-600" />}
        </div>
        {item.description && (
          <p className="mt-0.5 line-clamp-2 text-sm text-gray-500">{item.description}</p>
        )}
        <p className="mt-1 font-semibold text-gray-900">${item.price.toFixed(2)}</p>
      </div>
      <button
        onClick={() => onAdd(item)}
        disabled={!item.isAvailable}
        className="btn-primary shrink-0 !px-3 !py-2"
        title={item.isAvailable ? "Add to cart" : "Currently unavailable"}
      >
        <Plus size={18} />
      </button>
    </div>
  );
}

import { UtensilsCrossed } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-gray-100 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2 text-lg font-bold text-primary-600">
            <UtensilsCrossed size={20} />
            FoodHub
          </div>
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} FoodHub. © 2026 FoodHub. Built with MERN stack.
          </p>
        </div>
      </div>
    </footer>
  );
}

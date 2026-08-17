import { Link } from "react-router-dom";
import { UtensilsCrossed } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <UtensilsCrossed size={48} className="text-gray-300" />
      <h1 className="mt-4 text-4xl font-extrabold text-gray-900">404</h1>
      <p className="mt-2 text-gray-500">The page you're looking for doesn't exist.</p>
      <Link to="/" className="btn-primary mt-6">
        Back to home
      </Link>
    </div>
  );
}

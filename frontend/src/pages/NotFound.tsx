import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const ROLE_HOME: Record<string, string> = {
  ADMIN: "/admin/dashboard",
  NORMAL_USER: "/stores",
  STORE_OWNER: "/owner/dashboard",
};

const NotFound = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4">
      <div className="text-center max-w-md">
        {/* SVG illustration */}
        <svg
          className="w-32 h-32 mx-auto text-gray-200 dark:text-gray-800 mb-6"
          viewBox="0 0 200 200"
          fill="none"
          aria-hidden="true"
        >
          <circle cx="100" cy="100" r="90" fill="currentColor" />
          <text x="100" y="115" textAnchor="middle" fontSize="64" fontWeight="bold"
            fill="#9ca3af">404</text>
        </svg>

        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Page not found
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <button
          onClick={() => navigate(user ? (ROLE_HOME[user.role] ?? "/stores") : "/login")}
          className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors"
        >
          Go Home
        </button>
      </div>
    </div>
  );
};

export default NotFound;

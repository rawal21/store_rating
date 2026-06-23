import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import LockIcon from "@/assets/svgs/LockIcon";

const ROLE_HOME: Record<string, string> = {
  ADMIN: "/admin/dashboard",
  NORMAL_USER: "/stores",
  STORE_OWNER: "/owner/dashboard",
};

const Unauthorized = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const goHome = () => navigate(user ? (ROLE_HOME[user.role] ?? "/stores") : "/login");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4">
      <div className="text-center max-w-md">
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-red-100 dark:bg-red-900/30 rounded-full text-red-500">
            <LockIcon className="w-10 h-10" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Access Denied</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          You don't have permission to view this page.
        </p>
        <button
          onClick={goHome}
          className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors"
        >
          Go to Home
        </button>
      </div>
    </div>
  );
};

export default Unauthorized;

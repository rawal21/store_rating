import { Outlet } from "react-router-dom";
import StoreIcon from "@/assets/svgs/StoreIcon";

const AuthLayout = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-blue-100 dark:from-gray-950 dark:to-gray-900 px-4 py-12">
      <div className="w-full max-w-md">
        {/* Brand */}
        <div className="flex flex-col items-center mb-8">
          <div className="p-3 bg-primary-600 rounded-2xl text-white shadow-lg mb-3">
            <StoreIcon className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Store Rating</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Rate and discover great stores</p>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;

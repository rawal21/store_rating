import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { loginSchema, type LoginFormData } from "@/utils/validations";
import { authApi } from "@/api/auth.api";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/useToast";
import { getErrorMessage } from "@/utils/apiError";

const ROLE_HOME: Record<string, string> = {
  ADMIN: "/admin/dashboard",
  NORMAL_USER: "/stores",
  STORE_OWNER: "/owner/dashboard",
};

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn } = useAuth();
  const toast = useToast();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);
    try {
      const res = await authApi.login(data);
      const payload = res.data.data;
      signIn(payload);
      toast.success(`Welcome back, ${payload.user.name.split(" ")[0]}!`);
      const from = (location.state as any)?.from?.pathname;
      navigate(from ?? ROLE_HOME[payload.user.role] ?? "/stores", { replace: true });
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Sign in</h2>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        Don't have an account?{" "}
        <Link to="/register" className="text-primary-600 hover:underline font-medium">
          Register
        </Link>
      </p>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Email
          </label>
          <input
            type="email"
            autoComplete="email"
            {...register("email")}
            className={`w-full px-3 py-2.5 rounded-lg border bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm outline-none transition-colors
              focus:ring-2 focus:ring-primary-500 focus:border-transparent
              ${errors.email ? "border-red-400" : "border-gray-300 dark:border-gray-600"}`}
            placeholder="you@example.com"
          />
          {errors.email && (
            <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Password
          </label>
          <input
            type="password"
            autoComplete="current-password"
            {...register("password")}
            className={`w-full px-3 py-2.5 rounded-lg border bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm outline-none transition-colors
              focus:ring-2 focus:ring-primary-500 focus:border-transparent
              ${errors.password ? "border-red-400" : "border-gray-300 dark:border-gray-600"}`}
            placeholder="••••••••"
          />
          {errors.password && (
            <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 px-4 bg-primary-600 hover:bg-primary-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          {loading && (
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          )}
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </>
  );
};

export default Login;

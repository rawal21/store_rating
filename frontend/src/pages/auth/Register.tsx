import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { registerSchema, type RegisterFormData } from "@/utils/validations";
import { authApi } from "@/api/auth.api";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/useToast";
import { getErrorMessage } from "@/utils/apiError";

const Register = () => {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const toast = useToast();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({ resolver: zodResolver(registerSchema) });

  const onSubmit = async (data: RegisterFormData) => {
    setLoading(true);
    try {
      const res = await authApi.register(data);
      const payload = res.data.data;
      signIn(payload);
      toast.success("Account created successfully!");
      navigate("/stores", { replace: true });
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const fields: Array<{
    name: keyof RegisterFormData;
    label: string;
    type: string;
    placeholder: string;
    autoComplete: string;
  }> = [
    { name: "name", label: "Full Name", type: "text", placeholder: "John Alexander Doe Smith", autoComplete: "name" },
    { name: "email", label: "Email", type: "email", placeholder: "you@example.com", autoComplete: "email" },
    { name: "address", label: "Address", type: "text", placeholder: "123 Main Street, City", autoComplete: "street-address" },
    { name: "password", label: "Password", type: "password", placeholder: "••••••••", autoComplete: "new-password" },
  ];

  return (
    <>
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Create an account</h2>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        Already have an account?{" "}
        <Link to="/login" className="text-primary-600 hover:underline font-medium">
          Sign in
        </Link>
      </p>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        {fields.map((f) => (
          <div key={f.name}>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {f.label}
            </label>
            <input
              type={f.type}
              autoComplete={f.autoComplete}
              {...register(f.name)}
              className={`w-full px-3 py-2.5 rounded-lg border bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm outline-none transition-colors
                focus:ring-2 focus:ring-primary-500 focus:border-transparent
                ${errors[f.name] ? "border-red-400" : "border-gray-300 dark:border-gray-600"}`}
              placeholder={f.placeholder}
            />
            {errors[f.name] && (
              <p className="mt-1 text-xs text-red-500">{errors[f.name]?.message}</p>
            )}
          </div>
        ))}

        <p className="text-xs text-gray-400 dark:text-gray-500">
          Password: 8-16 chars, must include uppercase and special character.
        </p>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 px-4 bg-primary-600 hover:bg-primary-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          {loading && (
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          )}
          {loading ? "Creating account..." : "Create account"}
        </button>
      </form>
    </>
  );
};

export default Register;

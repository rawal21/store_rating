import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePageTitle } from "@/hooks/usePageTitle";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/useToast";
import { usersApi } from "@/api/users.api";
import { updatePasswordSchema, type UpdatePasswordFormData } from "@/utils/validations";
import { getErrorMessage } from "@/utils/apiError";
import { getRoleLabel, ROLE_COLORS } from "@/utils/roleLabel";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import StarRating from "@/components/shared/StarRating";

const Profile = () => {
  usePageTitle("Profile");
  const { user } = useAuth();
  const toast = useToast();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UpdatePasswordFormData>({
    resolver: zodResolver(updatePasswordSchema),
  });

  const onSubmit = async (data: UpdatePasswordFormData) => {
    try {
      await usersApi.updatePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      toast.success("Password updated successfully");
      reset();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-xl space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">Profile</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Your account details</p>
      </div>

      {/* Info card */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-5 space-y-3">
        <div className="flex items-start justify-between">
          <div>
            <p className="font-semibold text-gray-900 dark:text-white">{user.name}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
          </div>
          <Badge label={getRoleLabel(user.role)} className={ROLE_COLORS[user.role]} />
        </div>
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">Address</p>
          <p className="text-sm text-gray-700 dark:text-gray-300">{user.address}</p>
        </div>
        {/* Show average rating for store owners */}
        {user.role === "STORE_OWNER" && user.averageRating !== undefined && (
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Store Rating</p>
            <div className="flex items-center gap-2">
              <StarRating value={user.averageRating} readOnly size={18} />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {user.averageRating.toFixed(1)}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Update password */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-5">
        <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-4">
          Change Password
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
          <Input
            label="Current Password"
            type="password"
            autoComplete="current-password"
            error={errors.currentPassword?.message}
            {...register("currentPassword")}
          />
          <Input
            label="New Password"
            type="password"
            autoComplete="new-password"
            error={errors.newPassword?.message}
            {...register("newPassword")}
          />
          <Input
            label="Confirm New Password"
            type="password"
            autoComplete="new-password"
            error={errors.confirmPassword?.message}
            {...register("confirmPassword")}
          />
          <p className="text-xs text-gray-400">
            8-16 characters, must include uppercase and special character.
          </p>
          <Button type="submit" loading={isSubmitting}>
            Update Password
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Profile;

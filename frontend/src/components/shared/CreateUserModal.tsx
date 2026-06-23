import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { createUserSchema, type CreateUserFormData } from "@/utils/validations";
import { usersApi } from "@/api/users.api";
import { useToast } from "@/hooks/useToast";
import { getErrorMessage } from "@/utils/apiError";

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const ROLES = [
  { value: "NORMAL_USER",  label: "Normal User" },
  { value: "STORE_OWNER",  label: "Store Owner" },
  { value: "ADMIN",        label: "System Administrator" },
];

const CreateUserModal = ({ open, onClose, onSuccess }: Props) => {
  const toast = useToast();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateUserFormData>({ resolver: zodResolver(createUserSchema) });

  const onSubmit = async (data: CreateUserFormData) => {
    try {
      await usersApi.create(data);
      toast.success("User created successfully");
      reset();
      onSuccess();
      onClose();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Create User" maxWidth="30rem">
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        <Input label="Full Name"  type="text"     error={errors.name?.message}    {...register("name")} />
        <Input label="Email"      type="email"    error={errors.email?.message}   {...register("email")} />
        <Input label="Address"    type="text"     error={errors.address?.message} {...register("address")} />
        <Input label="Password"   type="password" error={errors.password?.message} {...register("password")} />

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Role
          </label>
          <select
            {...register("role")}
            defaultValue="NORMAL_USER"
            className="w-full px-3 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-primary-500"
          >
            {ROLES.map((r) => (
              <option key={r.value} value={r.value}>{r.label}</option>
            ))}
          </select>
          {errors.role && <p className="mt-1 text-xs text-red-500">{errors.role.message}</p>}
        </div>

        <p className="text-xs text-gray-400">
          Password: 8-16 chars, uppercase + special character required.
        </p>

        <div className="flex justify-end gap-2 pt-1">
          <Button variant="secondary" size="sm" type="button" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button size="sm" type="submit" loading={isSubmitting}>
            Create User
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateUserModal;

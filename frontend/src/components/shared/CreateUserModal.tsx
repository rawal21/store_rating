import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Select from "@/components/ui/Select";
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
    control,
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

        {/* Custom dropdown for role */}
        <Controller
          name="role"
          control={control}
          defaultValue="NORMAL_USER"
          render={({ field }) => (
            <Select
              label="Role"
              options={ROLES}
              value={field.value}
              onChange={field.onChange}
              error={errors.role?.message}
            />
          )}
        />

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

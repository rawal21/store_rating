import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { createStoreSchema, type CreateStoreFormData } from "@/utils/validations";
import { storesApi } from "@/api/stores.api";
import { usersApi } from "@/api/users.api";
import { useToast } from "@/hooks/useToast";
import { getErrorMessage } from "@/utils/apiError";
import type { IUser } from "@/types";

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const CreateStoreModal = ({ open, onClose, onSuccess }: Props) => {
  const toast = useToast();
  const [owners, setOwners] = useState<IUser[]>([]);

  // Load STORE_OWNER users for the owner selector
  useEffect(() => {
    if (!open) return;
    usersApi.getAll({ role: "STORE_OWNER" })
      .then((r) => setOwners(r.data.data))
      .catch(() => setOwners([]));
  }, [open]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateStoreFormData>({ resolver: zodResolver(createStoreSchema) });

  const onSubmit = async (data: CreateStoreFormData) => {
    try {
      await storesApi.create({
        name: data.name,
        email: data.email,
        address: data.address,
        ownerId: data.ownerId || null,
      });
      toast.success("Store created successfully");
      reset();
      onSuccess();
      onClose();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Create Store" maxWidth="30rem">
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        <Input label="Store Name" type="text"  error={errors.name?.message}    {...register("name")} />
        <Input label="Email"      type="email" error={errors.email?.message}   {...register("email")} />
        <Input label="Address"    type="text"  error={errors.address?.message} {...register("address")} />

        {/* Owner selector */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Owner <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <select
            {...register("ownerId")}
            className="w-full px-3 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">No owner assigned</option>
            {owners.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name} ({u.email})
              </option>
            ))}
          </select>
          {errors.ownerId && <p className="mt-1 text-xs text-red-500">{errors.ownerId.message}</p>}
        </div>

        <div className="flex justify-end gap-2 pt-1">
          <Button variant="secondary" size="sm" type="button" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button size="sm" type="submit" loading={isSubmitting}>
            Create Store
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateStoreModal;

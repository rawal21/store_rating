import { useEffect, useMemo, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Select, { type SelectOption } from "@/components/ui/Select";

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
  const [ownersLoading, setOwnersLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CreateStoreFormData>({
    resolver: zodResolver(createStoreSchema),
    defaultValues: {
      name: "",
      email: "",
      address: "",
      ownerId: "",
    },
  });

  // Load owners when modal opens
  useEffect(() => {
    if (!open) return;

    setOwnersLoading(true);

    usersApi
      .getAll({ role: "STORE_OWNER", limit: 100 })
      .then((res) => setOwners(res.data.data.data))
      .catch(() => setOwners([]))
      .finally(() => setOwnersLoading(false));
  }, [open]);

  const selectedOwnerId = watch("ownerId");

  // Auto-fill email when owner changes
  useEffect(() => {
    if (!selectedOwnerId) return;

    const selectedOwner = owners.find(
      (owner) => owner.id === selectedOwnerId
    );

    if (selectedOwner?.email) {
      setValue("email", selectedOwner.email, {
        shouldValidate: true,
      });
    }
  }, [selectedOwnerId, owners, setValue]);

  const ownerOptions: SelectOption[] = useMemo(
    () =>
      owners.map((owner) => ({
        value: owner.id,
        label: `${owner.name} (${owner.email})`,
      })),
    [owners]
  );

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
    <Modal
      open={open}
      onClose={onClose}
      title="Create Store"
      maxWidth="30rem"
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="space-y-4"
      >
        <Input
          label="Store Name"
          type="text"
          error={errors.name?.message}
          {...register("name")}
        />

        <Controller
          name="ownerId"
          control={control}
          render={({ field }) => (
            <Select
              label="Store Owner"
              options={ownerOptions}
              value={field.value ?? ""}
              onChange={field.onChange}
              error={errors.ownerId?.message}
              loading={ownersLoading}
              placeholder={
                ownersLoading
                  ? "Loading owners..."
                  : "Select store owner"
              }
            />
          )}
        />

        <Input
          label="Email"
          type="email"
          error={errors.email?.message}
          {...register("email")}
          disabled 
          
        />

        <Input
          label="Address"
          type="text"
          error={errors.address?.message}
          {...register("address")}
        />

        <div className="flex justify-end gap-2 pt-1">
          <Button
            variant="secondary"
            size="sm"
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>

          <Button
            size="sm"
            type="submit"
            loading={isSubmitting}
          >
            Create Store
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateStoreModal;
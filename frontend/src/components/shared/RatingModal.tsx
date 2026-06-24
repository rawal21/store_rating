import { useState, useEffect } from "react";
import Modal from "@/components/ui/Modal";
import StarRating from "./StarRating";
import Button from "@/components/ui/Button";
import { useRating } from "@/hooks/useRating";

interface RatingModalProps {
  open: boolean;
  onClose: () => void;
  storeName: string;
  storeId: string;
  existingRatingId?: string | null; // set → edit mode
  existingValue?: number;
  onSuccess: () => void;
}

const RatingModal = ({
  open,
  onClose,
  storeName,
  storeId,
  existingRatingId,
  existingValue = 0,
  onSuccess,
}: RatingModalProps) => {
  const [value, setValue] = useState(existingValue);

  // Reset stars every time modal opens with fresh data
  useEffect(() => {
    if (open) setValue(existingValue);
  }, [open, existingValue]);

  const { submitRating, editRating, loading } = useRating(() => {
    onSuccess();
    onClose();
  });

  const isEdit = !!existingRatingId;

  const handleSubmit = async () => {
    if (!value) return;
    if (isEdit && existingRatingId) {
      await editRating(existingRatingId, value);
    } else {
      await submitRating(storeId, value);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? "Update your rating" : "Rate this store"}
      maxWidth="22rem"
    >
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{storeName}</p>

      <div className="flex justify-center mb-6">
        <StarRating value={value} onChange={setValue} size={36} />
      </div>

      {value === 0 && (
        <p className="text-xs text-center text-gray-400 mb-4">Select a star to rate</p>
      )}

      <div className="flex gap-2 justify-end">
        <Button variant="secondary" size="sm" onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button size="sm" onClick={handleSubmit} disabled={value === 0} loading={loading}>
          {isEdit ? "Update" : "Submit"}
        </Button>
      </div>
    </Modal>
  );
};

export default RatingModal;

import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  confirmLabel?: string;
  loading?: boolean;
}

const ConfirmDialog = ({
  open,
  onClose,
  onConfirm,
  title = "Confirm Action",
  message = "Are you sure you want to continue? This action cannot be undone.",
  confirmLabel = "Confirm",
  loading = false,
}: ConfirmDialogProps) => (
  <Modal open={open} onClose={onClose} title={title} maxWidth="24rem">
    <p className="text-sm text-gray-600 dark:text-gray-400 mb-5">{message}</p>
    <div className="flex justify-end gap-2">
      <Button variant="secondary" size="sm" onClick={onClose} disabled={loading}>
        Cancel
      </Button>
      <Button variant="danger" size="sm" onClick={onConfirm} loading={loading}>
        {confirmLabel}
      </Button>
    </div>
  </Modal>
);

export default ConfirmDialog;

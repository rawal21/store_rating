import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from "@headlessui/react";
import styles from "./Select.module.css";

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  label?: string;
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}

const ChevronDownIcon = ({ open }: { open: boolean }) => (
  <svg
    className={[styles.chevron, open ? styles.chevronOpen : ""].join(" ")}
    viewBox="0 0 20 20"
    fill="currentColor"
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
      clipRule="evenodd"
    />
  </svg>
);

const CheckIcon = () => (
  <svg className={styles.checkIcon} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    <path
      fillRule="evenodd"
      d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
      clipRule="evenodd"
    />
  </svg>
);

/**
 * Custom accessible dropdown built on Headless UI Listbox.
 * Options panel is positioned absolutely inside the wrapper — no portal —
 * so it renders correctly inside modals and stacking contexts.
 */
const Select = ({
  label,
  options,
  value,
  onChange,
  placeholder = "Select an option",
  error,
  disabled = false,
  loading = false,
  className = "",
}: SelectProps) => {
  const selected = options.find((o) => o.value === value);
  const inputId = label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className={`${styles.wrapper} ${className}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          {label}
        </label>
      )}

      <Listbox value={value} onChange={onChange} disabled={disabled || loading}>
        {({ open }) => (
          <div className="relative">
            <ListboxButton
              id={inputId}
              className={[
                styles.trigger,
                error ? styles.error : "",
                loading ? styles.triggerLoading : "",
              ].join(" ")}
              aria-invalid={!!error}
              aria-describedby={error ? `${inputId}-error` : undefined}
            >
              {/* Left side — spinner while loading, label when ready */}
              {loading ? (
                <span className={styles.loadingRow}>
                  <span className={styles.spinner} aria-hidden="true" />
                  <span className="text-gray-400">Loading…</span>
                </span>
              ) : (
                <span className={selected?.value ? "text-gray-900 dark:text-white" : "text-gray-400"}>
                  {selected && selected.value !== "" ? selected.label : placeholder}
                </span>
              )}

              {/* Chevron — hidden while loading */}
              {!loading && <ChevronDownIcon open={open} />}
            </ListboxButton>

            <ListboxOptions className={styles.options}>
              {options.map((opt) => (
                <ListboxOption
                  key={opt.value}
                  value={opt.value}
                  className={({ focus, selected: sel }) =>
                    [
                      styles.option,
                      focus ? styles.optionFocused : "",
                      sel ? styles.optionSelected : "",
                    ].join(" ")
                  }
                >
                  {({ selected: sel }) => (
                    <>
                      <span>{opt.label}</span>
                      {sel && opt.value !== "" && <CheckIcon />}
                    </>
                  )}
                </ListboxOption>
              ))}
            </ListboxOptions>
          </div>
        )}
      </Listbox>

      {error && (
        <p id={`${inputId}-error`} className={styles.errorMsg} role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

export default Select;

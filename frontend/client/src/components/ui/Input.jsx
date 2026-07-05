import { forwardRef } from "react";

const Input = forwardRef(({ label, error, hint, className = "", ...props }, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-stone">
          {label}
        </label>
      )}
      <input
        ref={ref}
        className={`input-field ${error ? "!border-red-400 focus:!ring-red-100" : ""} ${className}`}
        {...props}
      />
      {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
      {hint && !error && <p className="mt-1.5 text-xs text-stone">{hint}</p>}
    </div>
  );
});

Input.displayName = "Input";
export default Input;

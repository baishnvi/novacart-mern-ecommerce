import { Minus, Plus } from "lucide-react";

const QuantityStepper = ({ quantity, onIncrease, onDecrease, max = 99, size = "md" }) => {
  const isCompact = size === "sm";

  return (
    <div
      className={`inline-flex items-center rounded-full border border-ink/12 dark:border-cream/15 ${
        isCompact ? "h-9" : "h-11"
      }`}
    >
      <button
        type="button"
        onClick={onDecrease}
        disabled={quantity <= 1}
        className="flex h-full w-9 items-center justify-center text-ink transition-colors hover:bg-ink/5 disabled:opacity-30 dark:text-cream dark:hover:bg-cream/10"
        aria-label="Decrease quantity"
      >
        <Minus size={14} />
      </button>
      <span className="w-8 text-center text-sm font-medium tabular-nums">{quantity}</span>
      <button
        type="button"
        onClick={onIncrease}
        disabled={quantity >= max}
        className="flex h-full w-9 items-center justify-center text-ink transition-colors hover:bg-ink/5 disabled:opacity-30 dark:text-cream dark:hover:bg-cream/10"
        aria-label="Increase quantity"
      >
        <Plus size={14} />
      </button>
    </div>
  );
};

export default QuantityStepper;

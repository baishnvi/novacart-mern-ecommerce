const toneClasses = {
  gold: "bg-gold/15 text-gold-dark",
  ink: "bg-ink text-ivory dark:bg-cream dark:text-ink",
  success: "bg-emerald-100 text-emerald-700",
  warning: "bg-amber-100 text-amber-700",
  danger: "bg-red-100 text-red-600",
  neutral: "bg-ink/5 text-stone dark:bg-cream/10",
};

const Badge = ({ children, tone = "neutral", className = "" }) => {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide ${toneClasses[tone]} ${className}`}
    >
      {children}
    </span>
  );
};

export default Badge;

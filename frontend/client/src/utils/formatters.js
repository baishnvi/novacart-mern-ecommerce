export const formatCurrency = (amount = 0, currency = "USD") => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
};

export const formatDate = (date) => {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(date));
};

export const truncate = (text = "", length = 100) => {
  if (text.length <= length) return text;
  return text.slice(0, length).trim() + "...";
};

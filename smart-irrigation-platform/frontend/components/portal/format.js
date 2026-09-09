export const formatNumber = (value) => new Intl.NumberFormat("en-IN", { maximumFractionDigits: 1 }).format(Number(value) || 0);

export const formatCurrency = (value, currency = "INR") =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);

export const formatDate = (value, options = { month: "short", day: "numeric" }) => {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "—" : new Intl.DateTimeFormat("en-IN", options).format(date);
};

export const formatDateTime = (value) =>
  formatDate(value, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });

export const relativeDue = (value) => {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const target = new Date(value);
  target.setHours(0, 0, 0, 0);
  const difference = Math.round((target - start) / 86400000);
  if (difference === 0) return "Today";
  if (difference === 1) return "Tomorrow";
  if (difference === -1) return "Yesterday";
  if (difference < 0) return String(Math.abs(difference)) + " days overdue";
  return "In " + String(difference) + " days";
};

export const toneForSeverity = (severity) => ({
  critical: "danger",
  high: "danger",
  medium: "warning",
  low: "info",
}[severity] || "neutral");

export const toneForCrop = (status) => ({
  healthy: "success",
  watch: "warning",
  attention: "danger",
}[status] || "neutral");

"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

export function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

export function Button({ children, className, variant = "primary", type = "button", ...props }) {
  return (
    <button type={type} className={cn("btn", `btn-${variant}`, className)} {...props}>
      {children}
    </button>
  );
}

export function IconButton({ label, className, children, ...props }) {
  return (
    <button className={cn("icon-btn", className)} aria-label={label} title={label} {...props}>
      {children}
    </button>
  );
}

const statusClasses = {
  success: "status-good",
  good: "status-good",
  info: "status-info",
  warning: "status-warn",
  danger: "status-danger",
  neutral: "bg-[var(--surface-soft)] text-[var(--muted)]",
};

export function StatusChip({ children, tone = "neutral", className }) {
  return <span className={cn("chip", statusClasses[tone] || statusClasses.neutral, className)}>{children}</span>;
}

export function ProgressBar({ value, className, color = "var(--moss)" }) {
  const safeValue = Math.max(0, Math.min(100, Number(value) || 0));
  return (
    <div className={cn("h-2 overflow-hidden rounded-full bg-[var(--line)]", className)}>
      <div
        className="h-full rounded-full transition-all duration-500"
        style={{ width: `${safeValue}%`, background: color }}
        aria-label={`${safeValue}%`}
      />
    </div>
  );
}

export function SectionHeader({ title, subtitle, action }) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h2 className="section-title">{title}</h2>
        {subtitle ? <p className="mt-1 text-sm muted">{subtitle}</p> : null}
      </div>
      {action}
    </div>
  );
}

export function MetricCard({ icon: Icon, label, value, change, tone = "green", detail, onClick }) {
  const tones = {
    green: "bg-emerald-500/12 text-emerald-700 dark:text-emerald-300",
    blue: "bg-blue-500/12 text-blue-700 dark:text-blue-300",
    amber: "bg-amber-400/15 text-amber-700 dark:text-amber-300",
    coral: "bg-rose-500/12 text-rose-700 dark:text-rose-300",
  };
  const Component = onClick ? "button" : "div";
  return (
    <Component
      onClick={onClick}
      className={cn(
        "card card-hover min-w-0 p-4 text-left sm:p-5",
        onClick && "w-full focus:outline-none focus:ring-4 focus:ring-emerald-500/15"
      )}
    >
      <div className="mb-5 flex items-start justify-between gap-3">
        <span className={cn("grid h-10 w-10 place-items-center rounded-xl", tones[tone])}>{Icon ? <Icon size={19} /> : null}</span>
        {change ? <StatusChip tone={change.tone || "success"}>{change.label}</StatusChip> : null}
      </div>
      <p className="text-xs font-semibold uppercase tracking-[0.08em] muted">{label}</p>
      <p className="metric-value mt-2">{value}</p>
      {detail ? <p className="mt-2 text-xs muted">{detail}</p> : null}
    </Component>
  );
}

export function Modal({ open, onClose, title, description, children, size = "max-w-lg" }) {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[70] grid place-items-end bg-slate-950/35 p-3 backdrop-blur-[2px] sm:place-items-center sm:p-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) onClose?.();
          }}
          role="presentation"
        >
          <motion.section
            role="dialog"
            aria-modal="true"
            aria-label={title}
            className={cn("w-full overflow-hidden rounded-[1.35rem] border border-[var(--line)] bg-[var(--surface-solid)] shadow-2xl", size)}
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ duration: 0.18 }}
          >
            <header className="flex items-start justify-between gap-4 border-b border-[var(--line)] px-5 py-4 sm:px-6">
              <div>
                <h2 className="text-lg font-extrabold tracking-tight">{title}</h2>
                {description ? <p className="mt-1 text-sm muted">{description}</p> : null}
              </div>
              <IconButton label="Close dialog" onClick={onClose}><X size={18} /></IconButton>
            </header>
            <div className="max-h-[76vh] overflow-y-auto p-5 sm:p-6">{children}</div>
          </motion.section>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="card grid min-h-64 place-items-center p-7 text-center">
      <div>
        {Icon ? <span className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"><Icon size={23} /></span> : null}
        <h3 className="font-extrabold">{title}</h3>
        <p className="mx-auto mt-2 max-w-sm text-sm muted">{description}</p>
        {action ? <div className="mt-5">{action}</div> : null}
      </div>
    </div>
  );
}

export function LoadingCard({ rows = 3 }) {
  return (
    <div className="card animate-pulse p-5">
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="mb-3 h-4 rounded bg-[var(--line)] last:mb-0" style={{ width: `${92 - index * 15}%` }} />
      ))}
    </div>
  );
}

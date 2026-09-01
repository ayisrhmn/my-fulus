import { type ButtonHTMLAttributes } from "react";

type Variant = "primary" | "ghost" | "danger";

const variants: Record<Variant, string> = {
  primary: "bg-primary text-primary-fg",
  ghost: "bg-surface text-text",
  danger: "bg-danger text-white",
};

export function Button({
  variant = "primary",
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return (
    <button
      className={`h-11 rounded-[var(--radius)] border-[length:var(--border-w)] border-border px-4 text-[15px] font-medium shadow-[var(--shadow-retro)] transition-transform active:translate-x-[2px] active:translate-y-[2px] active:shadow-none disabled:opacity-60 disabled:active:translate-x-0 disabled:active:translate-y-0 ${variants[variant]} ${className}`}
      {...props}
    />
  );
}

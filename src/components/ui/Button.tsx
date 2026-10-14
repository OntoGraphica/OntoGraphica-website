import type { ReactNode } from "react";
import { ArrowRightIcon } from "@phosphor-icons/react/dist/csr/ArrowRight";
import { Link } from "react-router";

export type ButtonVariant = "primary" | "light" | "outline" | "candidate" | "brand";

const base =
  "group inline-flex min-h-12 items-center justify-center gap-2.5 whitespace-nowrap rounded-control px-5 text-[0.95rem] font-medium tracking-[-0.005em] transition-[background-color,border-color,color,transform,box-shadow] duration-300 ease-[var(--ease-out-quint)] active:scale-[0.98] motion-reduce:active:scale-100 disabled:cursor-not-allowed disabled:opacity-60";

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-accent text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.18),0_10px_30px_-10px_rgb(45_99_227/0.7)] hover:bg-accent-hover hover:shadow-[inset_0_1px_0_rgb(255_255_255/0.22),0_14px_40px_-10px_rgb(45_99_227/0.85)]",
  light: "bg-fg text-bg hover:bg-white",
  outline: "border border-line-strong text-fg hover:border-fg-muted hover:bg-white/[0.04]",
  candidate: "bg-candidate text-[#0b0b0c] hover:bg-candidate-soft",
  // Ontographica red as a tint, so it sits inside the glass header instead of on top of it.
  brand: "border border-brand/45 bg-brand-wash text-fg hover:border-brand/70 hover:bg-brand/20",
};

export function buttonClasses(variant: ButtonVariant = "primary", className = "") {
  return `${base} ${variants[variant]} ${className}`;
}

/** Phosphor arrow at bold weight: at 16px that matches the ~1.4px stroke of the 30px light icons. */
export function Arrow({ className = "" }: { className?: string }) {
  return (
    <ArrowRightIcon
      aria-hidden="true"
      weight="bold"
      className={`h-4 w-4 shrink-0 transition-transform duration-300 ease-[var(--ease-out-quint)] group-hover:translate-x-1 motion-reduce:transition-none ${className}`}
    />
  );
}

function SmartLink({ to, className, children }: { to: string; className: string; children: ReactNode }) {
  if (to.startsWith("#")) {
    return (
      <a href={to} className={className}>
        {children}
      </a>
    );
  }
  return (
    <Link to={to} className={className}>
      {children}
    </Link>
  );
}

type ButtonLinkProps = { to: string; variant?: ButtonVariant; arrow?: boolean; className?: string; children: ReactNode };

/** A link styled as a button. One filled button per view; pair it with a TextLink. */
export function ButtonLink({ to, variant = "primary", arrow = false, className = "", children }: ButtonLinkProps) {
  return (
    <SmartLink to={to} className={buttonClasses(variant, className)}>
      {children}
      {arrow && <Arrow />}
    </SmartLink>
  );
}

type TextLinkProps = { to: string; children: ReactNode; className?: string; tone?: "fg" | "accent" | "candidate" };

const textTones = { fg: "text-fg", accent: "text-accent-soft", candidate: "text-candidate-soft" };

/** Quiet arrow link for the secondary action. */
export function TextLink({ to, children, className = "", tone = "fg" }: TextLinkProps) {
  return (
    <SmartLink
      to={to}
      className={`group inline-flex min-h-11 items-center gap-2 font-medium ${textTones[tone]} underline decoration-transparent underline-offset-[6px] transition-[text-decoration-color] duration-300 hover:decoration-current ${className}`}
    >
      {children}
      <Arrow />
    </SmartLink>
  );
}

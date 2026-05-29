import * as React from "react";
import Link from "next/link";
import { Icon } from "./Icon";

type Variant = "primary" | "teal" | "outline" | "ghost" | "light";
type Size = "sm" | "md" | "lg";

type CommonProps = {
  children: React.ReactNode;
  variant?: Variant;
  size?: Size;
  full?: boolean;
  icon?: string;
  className?: string;
  style?: React.CSSProperties;
};

function classes(variant: Variant, size: Size, full?: boolean, extra?: string) {
  return ["btn", `btn-${variant}`, `btn-${size}`, full ? "btn-full" : "", extra || ""]
    .filter(Boolean)
    .join(" ");
}

function inner(children: React.ReactNode, icon: string | undefined, size: Size) {
  return (
    <>
      {children}
      {icon && <Icon name={icon} size={size === "sm" ? 15 : 17} sw={2.2} />}
    </>
  );
}

// Link button (server component, real <a href> for SEO).
export function BtnLink({
  href,
  children,
  variant = "primary",
  size = "md",
  full,
  icon,
  className,
  style,
}: CommonProps & { href: string }) {
  return (
    <Link href={href} className={classes(variant, size, full, className)} style={style}>
      {inner(children, icon, size)}
    </Link>
  );
}

// Plain non-interactive styled button container (server). For interactive
// client buttons, components add their own onClick wrappers.
export function Btn({
  children,
  variant = "primary",
  size = "md",
  full,
  icon,
  className,
  style,
  type = "button",
  ...rest
}: CommonProps & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button type={type} className={classes(variant, size, full, className)} style={style} {...rest}>
      {inner(children, icon, size)}
    </button>
  );
}

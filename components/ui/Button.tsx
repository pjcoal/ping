import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";

type Variant = "primary" | "secondary" | "ghost";
type Size = "md" | "sm";

type CommonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
};

type ButtonProps = CommonProps &
  Omit<ComponentPropsWithoutRef<"button">, keyof CommonProps> & {
    href?: undefined;
  };

type LinkProps = CommonProps &
  Omit<ComponentPropsWithoutRef<typeof Link>, keyof CommonProps> & {
    href: string;
  };

function classes(variant: Variant, size: Size, className: string) {
  return [
    "btn",
    variant === "primary" && "btn-primary",
    variant === "secondary" && "btn-secondary",
    variant === "ghost" && "btn-ghost",
    size === "sm" && "btn-sm",
    className,
  ]
    .filter(Boolean)
    .join(" ");
}

// Polymorphic button: renders a <Link> when `href` is passed, otherwise a
// <button>. Both share the same visual system (see .btn* in globals.css) so
// every primary/secondary/ghost action across the site looks and behaves
// identically — same hover lift, focus ring, and disabled state.
export default function Button(props: ButtonProps | LinkProps) {
  const { variant = "primary", size = "md", className = "", children, ...rest } = props;

  if ("href" in props && props.href !== undefined) {
    const { href, ...linkRest } = rest as Omit<LinkProps, keyof CommonProps>;
    return (
      <Link href={href} className={classes(variant, size, className)} {...linkRest}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes(variant, size, className)} {...(rest as ComponentPropsWithoutRef<"button">)}>
      {children}
    </button>
  );
}

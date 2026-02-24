"use client";

import { forwardRef, type ButtonHTMLAttributes, type AnchorHTMLAttributes } from "react";
import Link from "next/link";

type Variant = "primary" | "secondary" | "watch" | "ghost";

const VARIANT_CLASS: Record<Variant, string> = {
  primary: "btn-primary",
  secondary: "btn-secondary",
  watch: "btn-watch",
  ghost: "btn-ghost",
};

/* ── Shared props ── */
interface BaseProps {
  variant?: Variant;
  /** Extra classes appended after the variant class */
  className?: string;
  children: React.ReactNode;
}

/* ── Button element ── */
type ButtonProps = BaseProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children"> & {
    href?: undefined;
  };

/* ── Anchor / Link element ── */
type LinkProps = BaseProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "className" | "children"> & {
    href: string;
    /** Open in new tab */
    external?: boolean;
  };

type Props = ButtonProps | LinkProps;

function isLink(props: Props): props is LinkProps {
  return typeof (props as LinkProps).href === "string";
}

/**
 * Unified button component.
 *
 * Renders as:
 * - `<Link>` for internal hrefs (starts with `/`)
 * - `<a>` for external hrefs
 * - `<button>` otherwise
 */
export const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, Props>(
  function Button(props, ref) {
    const { variant = "primary", className = "", children, ...rest } = props;
    const cls = `${VARIANT_CLASS[variant]}${className ? ` ${className}` : ""}`;

    if (isLink(props)) {
      const linkProps = props as LinkProps;
      const { href, external } = linkProps;
      // Strip non-HTML props before spreading onto the element
      const anchorRest = Object.fromEntries(
        Object.entries(rest).filter(([k]) => k !== 'href' && k !== 'external'),
      );

      if (external || href.startsWith("mailto:") || href.startsWith("http")) {
        return (
          <a
            ref={ref as React.Ref<HTMLAnchorElement>}
            href={href}
            className={cls}
            {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            {...anchorRest}
          >
            {children}
          </a>
        );
      }

      return (
        <Link
          ref={ref as React.Ref<HTMLAnchorElement>}
          href={href}
          className={cls}
          {...anchorRest}
        >
          {children}
        </Link>
      );
    }

    return (
      <button ref={ref as React.Ref<HTMLButtonElement>} className={cls} {...(rest as Omit<ButtonProps, 'variant' | 'className' | 'children'>)}>
        {children}
      </button>
    );
  },
);

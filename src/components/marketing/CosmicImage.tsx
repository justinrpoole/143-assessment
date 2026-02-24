import Image from "next/image";

interface CosmicImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  maxWidth?: string;
  variant?: "hero" | "section" | "decorative" | "product";
  priority?: boolean;
  className?: string;
}

const VARIANT_STYLES: Record<
  NonNullable<CosmicImageProps["variant"]>,
  { wrapper: React.CSSProperties; image: string }
> = {
  hero: {
    wrapper: {},
    image: "rounded-2xl",
  },
  section: {
    wrapper: {
      border: "1px solid rgba(248,208,17,0.15)",
      boxShadow: "0 0 30px rgba(248,208,17,0.06)",
      borderRadius: 16,
      overflow: "hidden",
    },
    image: "rounded-2xl",
  },
  decorative: {
    wrapper: { opacity: 0.6 },
    image: "rounded-xl",
  },
  product: {
    wrapper: {
      border: "1px solid rgba(248,208,17,0.2)",
      boxShadow: "0 0 40px rgba(248,208,17,0.08)",
      borderRadius: 16,
      overflow: "hidden",
      background: "var(--surface-glass, rgba(255,255,255,0.04))",
    },
    image: "rounded-2xl",
  },
};

export default function CosmicImage({
  src,
  alt,
  width,
  height,
  maxWidth = "100%",
  variant = "section",
  priority = false,
  className = "",
}: CosmicImageProps) {
  const styles = VARIANT_STYLES[variant];
  const isDecorative = variant === "decorative";

  return (
    <div
      className={`mx-auto ${className}`}
      style={{ maxWidth, ...styles.wrapper }}
      {...(isDecorative ? { "aria-hidden": true } : {})}
    >
      <Image
        src={src}
        alt={isDecorative ? "" : alt}
        width={width}
        height={height}
        className={`w-full h-auto ${styles.image}`}
        priority={priority}
        sizes={`(max-width: 768px) 100vw, ${maxWidth}`}
      />
    </div>
  );
}

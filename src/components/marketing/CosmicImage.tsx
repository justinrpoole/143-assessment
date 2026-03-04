import Image from "next/image";

interface CosmicImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  maxWidth?: string;
  variant?: "hero" | "section" | "decorative" | "product" | "hero-bg";
  priority?: boolean;
  className?: string;
  /** Base64 blur placeholder for blur-up effect */
  blurDataURL?: string;
}

const VARIANT_STYLES: Record<
  NonNullable<CosmicImageProps["variant"]>,
  { wrapper: React.CSSProperties; image: string }
> = {
  hero: {
    wrapper: {},
    image: "rounded-2xl",
  },
  "hero-bg": {
    wrapper: {
      position: "absolute" as const,
      inset: 0,
      opacity: 0.15,
      overflow: "hidden",
      maskImage: "linear-gradient(to bottom, black 40%, transparent 100%)",
      WebkitMaskImage: "linear-gradient(to bottom, black 40%, transparent 100%)",
    },
    image: "",
  },
  section: {
    wrapper: {
      border: "1px solid color-mix(in srgb, var(--gold-primary) 15%, transparent)",
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
      border: "1px solid color-mix(in srgb, var(--gold-primary) 20%, transparent)",
      borderRadius: 16,
      overflow: "hidden",
      background: "var(--surface-glass, color-mix(in srgb, var(--text-body) 4%, transparent))",
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
  blurDataURL,
}: CosmicImageProps) {
  const styles = VARIANT_STYLES[variant];
  const isDecorative = variant === "decorative" || variant === "hero-bg";
  const blurProps = blurDataURL
    ? { placeholder: "blur" as const, blurDataURL }
    : {};

  if (variant === "hero-bg") {
    return (
      <div
        className={className}
        style={styles.wrapper}
        aria-hidden
      >
        <Image
          src={src}
          alt=""
          fill
          className="object-cover"
          priority={priority}
          sizes="100vw"
          {...blurProps}
        />
      </div>
    );
  }

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
        {...blurProps}
      />
    </div>
  );
}

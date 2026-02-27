import { rayRamp, resolveRay } from '@/lib/ui/ray-colors';

interface RayBadgeProps {
  /** Ray identifier: "R1"-"R9" or ray name like "Presence" */
  ray: string;
  /** Override display text (defaults to ray label) */
  text?: string;
  /** Size variant */
  size?: 'sm' | 'md';
}

/**
 * Small pill/chip that shows a ray name in its color.
 * <RayBadge ray="R3" /> renders "Presence" in purple with purple bgTint background.
 */
export default function RayBadge({ ray, text, size = 'sm' }: RayBadgeProps) {
  const ramp = rayRamp(ray);
  const info = resolveRay(ray);

  const fontSize = size === 'sm' ? '10px' : '11px';
  const padding = size === 'sm' ? '2px 8px' : '3px 10px';

  return (
    <span
      className="inline-flex items-center rounded-full font-semibold whitespace-nowrap"
      style={{
        fontSize,
        padding,
        color: ramp.full,
        background: ramp.badgeBg,
        border: `1px solid ${ramp.border}`,
      }}
    >
      {text ?? info.label}
    </span>
  );
}

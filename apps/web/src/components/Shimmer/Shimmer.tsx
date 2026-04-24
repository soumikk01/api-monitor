import styles from './Shimmer.module.scss';

/* ── Individual bone ─────────────────────────────────────────────────── */
interface ShimmerProps {
  width?: string | number;
  height?: number;
  borderRadius?: number;
  className?: string;
  style?: React.CSSProperties;
  /** Stagger delay index 1–5 (adds animation-delay so bones don't sweep in sync) */
  delay?: 1 | 2 | 3 | 4 | 5;
}

export function Shimmer({
  width = '100%',
  height = 20,
  borderRadius = 8,
  className,
  style,
  delay,
}: ShimmerProps) {
  const delayClass = delay ? styles[`d${delay}`] : '';
  return (
    <div
      className={`${styles.shimmer} ${delayClass} ${className ?? ''}`}
      style={{ width, height, borderRadius, ...style }}
    />
  );
}

/* ── Vertical stack ──────────────────────────────────────────────────── */
interface ShimmerBlockProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function ShimmerBlock({ children, className, style }: ShimmerBlockProps) {
  return (
    <div className={`${styles.shimmerPage} ${styles.shimmerBlock} ${className ?? ''}`} style={style}>
      {children}
    </div>
  );
}

/* ── Horizontal row ──────────────────────────────────────────────────── */
export function ShimmerRow({ children, className, style }: ShimmerBlockProps) {
  return (
    <div className={`${styles.shimmerRow} ${className ?? ''}`} style={style}>
      {children}
    </div>
  );
}

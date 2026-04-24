import styles from './ButtonLogoSpinner.module.scss';

export default function ButtonLogoSpinner({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={`${styles.logoSvg} ${className || ''}`}>
      <polygon 
        className={styles.hexagon}
        points="10,1 19,6 19,14 10,19 1,14 1,6" 
        stroke="currentColor" 
        strokeWidth="1.5" 
        fill="none"
      />
      <circle 
        className={styles.circle}
        cx="10" 
        cy="10" 
        r="3" 
        fill="currentColor"
      />
    </svg>
  );
}

import Link from "next/link";
import styles from "./Navigation.module.scss";

export function Navigation() {
  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <Link href="/">API Monitor</Link>
        </div>
        <div className={styles.links}>
          <Link href="/" className={styles.link}>Dashboard</Link>
          <Link href="/manage" className={styles.link}>Manage Endpoints</Link>
          <Link href="/status" className={styles.link} target="_blank">Status Page ↗</Link>
        </div>
      </div>
    </nav>
  );
}

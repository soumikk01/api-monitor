import styles from "./StatusPage.module.scss";

export default function StatusPage() {
  return (
    <div className={styles.container}>
      <main className={styles.content}>
        <div className={styles.header}>
          <div className={styles.brand}>Apio</div>
          <p className={styles.subtitle}>All Systems Operational</p>
        </div>

        <div className={styles.timeline}>
          <div className={styles.timelineItem}>
            <div className={styles.timelineDate}>Today</div>
            <div className={styles.timelineText}>No incidents reported today.</div>
          </div>
          <div className={styles.timelineItem}>
            <div className={styles.timelineDate}>Yesterday</div>
            <div className={styles.timelineText}>No incidents reported.</div>
          </div>
        </div>

        <div className={styles.panel}>
          <div className={styles.serviceRow}>
            <span>Authentication API</span>
            <span className={styles.statusOk}>Operational</span>
          </div>
          <div className={styles.serviceRow}>
            <span>Payment Gateway</span>
            <span className={styles.statusOk}>Operational</span>
          </div>
          <div className={styles.serviceRow}>
            <span>User Profile Service</span>
            <span className={styles.statusOk}>Operational</span>
          </div>
        </div>
      </main>
    </div>
  );
}


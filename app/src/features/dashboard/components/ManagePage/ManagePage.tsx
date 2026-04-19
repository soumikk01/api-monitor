import styles from "./manage.module.scss";

export default function ManageEndpoints() {
  return (
    <div className={styles.container}>
      <main className={styles.content}>
        <div className={styles.header}>
          <h1 className={styles.title}>Manage Endpoints</h1>
          <p className={styles.subtitle}>Configure which APIs are monitored across your infrastructure.</p>
        </div>

        <div className={styles.panel}>
          <div className={styles.toolbar}>
            <button className={styles.btnPrimary}>+ Add New Endpoint</button>
          </div>

          <table className={styles.table}>
            <thead>
              <tr>
                <th>Service Name</th>
                <th>URL</th>
                <th>Interval</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Authentication API</td>
                <td className={styles.codeRow}>https://api.example.com/auth</td>
                <td>1m</td>
                <td>
                  <button className={styles.btnGhost}>Edit</button>
                  <button className={styles.btnDanger}>Delete</button>
                </td>
              </tr>
              <tr>
                <td>Payment Gateway</td>
                <td className={styles.codeRow}>https://pay.example.com/health</td>
                <td>5m</td>
                <td>
                  <button className={styles.btnGhost}>Edit</button>
                  <button className={styles.btnDanger}>Delete</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

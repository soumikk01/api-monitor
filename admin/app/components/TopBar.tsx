'use client';

interface TopBarProps {
  title?: string;
}

export default function TopBar({ title }: TopBarProps) {
  return (
    <header className="admin-topbar">
      <div className="topbar-search">
        <span className="topbar-search-icon" style={{ fontSize: '14px' }}>🔍</span>
        <input placeholder="Search users, projects, endpoints…" />
      </div>

      <div className="topbar-right">
        {/* Notification bell */}
        <button className="topbar-btn" title="Notifications">
          🔔
          <span className="topbar-dot" />
        </button>

        {/* Refresh */}
        <button
          className="topbar-btn"
          title="Refresh"
          onClick={() => window.location.reload()}
        >
          ↻
        </button>

        {/* Current page label */}
        {title && (
          <span style={{
            fontSize: '13px',
            fontWeight: 600,
            color: 'var(--text-secondary)',
            padding: '0 8px',
          }}>
            {title}
          </span>
        )}
      </div>
    </header>
  );
}

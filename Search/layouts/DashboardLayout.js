import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const NAV_ITEMS = [
  { path: '/dashboard', label: 'Dashboard', icon: '📊' },
  { path: '/squad-builder', label: 'Squad Builder', icon: '⚽' },
  { path: '/recommendations', label: 'Recommendations', icon: '💡' },
  { path: '/chemistry', label: 'Chemistry', icon: '⚡' },
  { path: '/simulation', label: 'Simulation', icon: '🎮' },
  { path: '/growth', label: 'Growth Prediction', icon: '📈' },
  { path: '/assistant', label: 'AI Assistant', icon: '🤖' },
  { path: '/analytics', label: 'Analytics', icon: '🔬' },
  { path: '/settings', label: 'Settings', icon: '⚙️' }
];

export function DashboardLayout({ children }) {
  const location = useLocation();

  return (
    <div className="app-container">
      <aside className="sidebar">
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)', fontWeight: 'bold', fontSize: '1.1rem', color: 'var(--primary)' }}>
          SCORE MATCH <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>SQUAD OPTIMIZER</span>
        </div>
        <nav style={{ display: 'flex', flexDirection: 'column', padding: '1rem 0', gap: '0.25rem' }}>
          {NAV_ITEMS.map(item => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem 1.5rem',
                  color: active ? 'var(--primary)' : 'var(--text-muted)',
                  backgroundColor: active ? 'rgba(16, 185, 129, 0.1)' : 'transparent',
                  borderLeft: active ? '3px solid var(--primary)' : '3px solid transparent',
                  fontWeight: active ? '600' : '400'
                }}
              >
                <span>{item.icon}</span>
                <span className="nav-label">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      <main className="main-content">
        {children}
      </main>
    </div>
  );
}
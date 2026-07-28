import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';

export function MainLayout() {
  const location = useLocation();

  const navLinks = [
    { path: '/chemistry', label: 'Chemistry' },
    { path: '/simulation', label: 'Match Simulator' },
    { path: '/growth', label: 'Growth' },
    { path: '/assistant', label: 'AI Assistant' },
    { path: '/validation', label: 'Validation' },
    { path: '/settings', label: 'Settings' },
  ];

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: 'transparent',
      color: '#eef3ee',
      fontFamily: 'Inter, sans-serif',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Floodlight Stadium Header */}
      <header style={{
        height: '74px',
        backgroundColor: 'rgba(15, 43, 34, 0.9)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(238, 243, 238, 0.12)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 2rem',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)'
      }}>
        {/* Brand with circular scoreboard badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #f4b23e 0%, #d99322 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'Anton, sans-serif',
            fontSize: '1.25rem',
            color: '#0a1410',
            border: '2px solid rgba(238, 243, 238, 0.3)',
            boxShadow: '0 0 15px rgba(244, 178, 62, 0.4)'
          }}>
            SM
          </div>
          <div>
            <span style={{ fontFamily: 'Anton, sans-serif', fontSize: '1.35rem', letterSpacing: '0.08em', display: 'block', lineHeight: '1', color: '#eef3ee' }}>
              SCORE MATCH <span style={{ color: '#f4b23e' }}>PRO</span>
            </span>
            <span style={{ fontSize: '0.65rem', color: '#9fb0a8', letterSpacing: '1.5px', fontWeight: '700', textTransform: 'uppercase' }}>
              Tactical Pitch Engine
            </span>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path || (link.path === '/chemistry' && location.pathname === '/');
            return (
              <Link
                key={link.path}
                to={link.path}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '6px',
                  textDecoration: 'none',
                  fontSize: '0.85rem',
                  fontWeight: '600',
                  letterSpacing: '0.03em',
                  backgroundColor: isActive ? '#f4b23e' : 'transparent',
                  color: isActive ? '#0a1410' : '#9fb0a8',
                  border: isActive ? '1px solid #f4b23e' : '1px solid transparent',
                  transition: 'all 0.2s ease',
                  whiteSpace: 'nowrap',
                  boxShadow: isActive ? '0 0 12px rgba(244, 178, 62, 0.4)' : 'none'
                }}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </header>

      {/* Main Container Area */}
      <main style={{ 
        flex: 1, 
        maxWidth: '1300px', 
        width: '100%', 
        margin: '0 auto', 
        padding: '2.5rem 2rem', 
        boxSizing: 'border-box' 
      }}>
        <Outlet />
      </main>

      {/* Footer */}
      <footer style={{
        padding: '1.5rem 2rem',
        backgroundColor: '#0a1410',
        borderTop: '1px solid rgba(238, 243, 238, 0.08)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: '0.8rem',
        color: '#9fb0a8'
      }}>
        <span>Score Match Tactical Suite &bull; Floodlight Edition</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#4fcf98', boxShadow: '0 0 8px #4fcf98' }}></span>
          <span style={{ color: '#eef3ee', fontWeight: '600', letterSpacing: '0.05em' }}>PITCH ONLINE</span>
        </div>
      </footer>
    </div>
  );
}

export default MainLayout;
import React from 'react';
import { motion } from 'framer-motion';

const Settings = ({ onBack, currentTheme, onToggleTheme }) => {
  return (
    <div className="dashboard-container" style={{ paddingBottom: '40px' }}>
      <header style={{ 
        width: '100%', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '24px'
      }}>
        <button 
          onClick={onBack}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-primary)',
            fontSize: '1.2rem',
            cursor: 'pointer',
            padding: '8px',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <span className="material-symbols-outlined">arrow_back_ios</span>
        </button>
        <h1 style={{ fontSize: '1.1rem', margin: 0, fontFamily: 'var(--font-heading)', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Settings</h1>
        <div style={{ width: '40px' }}></div> {/* Spacer */}
      </header>

      <section className="card-white" style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '24px',
        border: '1px solid var(--border-color)',
        borderRadius: '12px',
        padding: '24px'
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center' 
        }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: 'var(--font-heading)' }}>Theme Appearance</h3>
            <p style={{ 
              fontSize: '0.75rem', 
              color: 'var(--text-secondary)',
              marginTop: '4px',
              fontFamily: 'var(--font-main)'
            }}>
              Switch between light and dark clinical interface
            </p>
          </div>
          
          <button
            onClick={onToggleTheme}
            style={{
              padding: '8px 16px',
              borderRadius: '20px',
              border: '1px solid var(--border-color)',
              background: 'var(--bg-color)',
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-main)',
              fontSize: '0.9rem',
              fontWeight: '500',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.2s ease'
            }}
          >
            {currentTheme === 'dark' ? '🌙 Dark' : '☀️ Light'}
          </button>
        </div>

        <div style={{ 
          height: '1px', 
          background: 'var(--border-color)', 
          width: '100%' 
        }}></div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <h3 style={{ margin: 0, fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: 'var(--font-heading)' }}>BioDossier Access</h3>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-main)' }}>
            Authenticated as <strong>Guest_Sigma_72</strong>
          </p>
        </div>
      </section>

      <footer style={{ marginTop: 'auto', textAlign: 'center', width: '100%' }}>
        <p className="mono-text" style={{ fontSize: '0.7rem' }}>
          Baseline Hackathon v1.0.0
        </p>
      </footer>
    </div>
  );
};

export default Settings;

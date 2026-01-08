import React, { useEffect } from 'react';
import { Box, Database, Cpu, Zap, Shield, Target, Radar, Eye, Globe, Lock } from 'lucide-react';
import { C, sp } from '../styles/designSystem';

/**
 * PlatformCard - Individual platform card with icon and label
 */
const PlatformCard = ({ icon: Icon, label, subtitle }) => {
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <div
      onClick={() => {/* Non-functional */}}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        padding: sp.md,
        borderRadius: 8,
        border: `1px solid ${C.neutral[200]}`,
        background: isHovered ? C.neutral[50] : 'white',
        cursor: 'pointer',
        transition: 'all 0.15s',
        display: 'flex',
        flexDirection: 'column',
        gap: sp.xs
      }}
    >
      <Icon style={{ width: 20, height: 20, color: C.brand[500] }} />
      <div style={{ fontSize: '14px', fontWeight: 600, color: C.neutral[900] }}>
        {label}
      </div>
      {subtitle && (
        <div style={{ fontSize: '12px', color: C.neutral[500] }}>
          {subtitle}
        </div>
      )}
    </div>
  );
};

/**
 * PlatformSwitcher - Dropdown panel showing available platforms
 * Displays Industry Agnostic Solutions, Purpose-Built Platforms, and User's Favorites
 */
const PlatformSwitcher = ({ isOpen, onClose }) => {
  // Close on ESC key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      return () => document.removeEventListener('keydown', handleEsc);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 998,
          background: 'rgba(0, 0, 0, 0.3)'
        }}
      />

      {/* Dropdown panel */}
      <div style={{
        position: 'fixed',
        top: 64,  // Below navbar (56px + 8px spacing)
        left: '50%',
        transform: 'translateX(-50%)',
        width: 720,
        maxHeight: '80vh',
        background: 'white',
        borderRadius: 8,
        boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
        zIndex: 999,
        overflowY: 'auto',
        padding: sp.lg
      }}>
        {/* Industry Agnostic Solutions */}
        <div style={{ marginBottom: sp.lg }}>
          <h3 style={{
            fontSize: '14px',
            fontWeight: 600,
            color: C.neutral[700],
            marginBottom: sp.md,
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            Industry Agnostic Solutions
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: sp.md
          }}>
            <PlatformCard icon={Box} label="ProModel.ai" />
            <PlatformCard icon={Database} label="ConductorOS" />
            <PlatformCard icon={Cpu} label="VANE" />
            <PlatformCard icon={Zap} label="veriScan" />
          </div>
        </div>

        {/* Purpose-Built Platforms */}
        <div style={{ marginBottom: sp.lg }}>
          <h3 style={{
            fontSize: '14px',
            fontWeight: 600,
            color: C.neutral[700],
            marginBottom: sp.md,
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            Purpose-Built Platforms
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: sp.md
          }}>
            <PlatformCard icon={Shield} label="Army Synchronization Toolset" />
            <PlatformCard icon={Target} label="Decision Support Tool" />
            <PlatformCard icon={Radar} label="GFIM-OE" />
            <PlatformCard icon={Eye} label="UAE: TALON" />
            <PlatformCard icon={Globe} label="ISC" />
            <PlatformCard icon={Lock} label="ORION" />
          </div>
        </div>

        {/* User's Favorite Pages */}
        <div style={{
          paddingTop: sp.lg,
          borderTop: `1px solid ${C.neutral[200]}`
        }}>
          <h3 style={{
            fontSize: '14px',
            fontWeight: 600,
            color: C.neutral[700],
            marginBottom: sp.md,
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            User's Favorite Pages
          </h3>
          <p style={{
            fontSize: '12px',
            color: C.neutral[500],
            margin: 0
          }}>
            (Platform Name): {'{'}pageName{'}'}, {'{'}taskName{'}'}
          </p>
        </div>
      </div>
    </>
  );
};

export default PlatformSwitcher;

import React, { useEffect } from 'react';
import { X, LayoutDashboard, Users, Settings, FileText, HelpCircle } from 'lucide-react';
import { C, sp } from '../styles/designSystem';

/**
 * MenuItem - Individual menu item with icon and label
 */
const MenuItem = ({ icon, label }) => {
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: sp.md,
        padding: sp.md,
        borderRadius: 6,
        cursor: 'pointer',
        transition: 'background 0.15s',
        marginBottom: sp.xs,
        background: isHovered ? C.neutral[100] : 'transparent',
        color: C.neutral[700]
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {React.cloneElement(icon, {
        style: { width: 20, height: 20, color: C.neutral[600] }
      })}
      <span style={{ fontSize: '14px', fontWeight: 500 }}>
        {label}
      </span>
    </div>
  );
};

/**
 * HamburgerMenu - Slide-out navigation panel
 * Opens from left, overlays all content with backdrop
 */
const HamburgerMenu = ({ isOpen, onClose }) => {
  // ESC key listener
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
      {/* Backdrop overlay */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          zIndex: 1002,
          transition: 'opacity 0.3s',
          opacity: isOpen ? 1 : 0
        }}
      />

      {/* Slide panel */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        bottom: 0,
        width: 280,
        background: 'white',
        zIndex: 1002,
        boxShadow: '4px 0 12px rgba(0,0,0,0.15)',
        overflowY: 'auto',
        padding: sp.lg,
        transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 0.3s ease-in-out'
      }}>
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            width: 36,
            height: 36,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: C.neutral[100],
            border: 'none',
            borderRadius: 6,
            cursor: 'pointer',
            marginBottom: sp.lg,
            transition: 'background 0.15s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = C.neutral[200]}
          onMouseLeave={(e) => e.currentTarget.style.background = C.neutral[100]}
          aria-label="Close menu"
        >
          <X style={{ width: 20, height: 20, color: C.neutral[600] }} />
        </button>

        {/* Menu header */}
        <div style={{
          marginBottom: sp.lg,
          paddingBottom: sp.md,
          borderBottom: `1px solid ${C.neutral[200]}`
        }}>
          <h2 style={{
            fontSize: '18px',
            fontWeight: 600,
            color: C.neutral[900],
            margin: 0,
            marginBottom: sp.xs
          }}>
            Navigation
          </h2>
          <p style={{
            fontSize: '12px',
            color: C.neutral[500],
            margin: 0
          }}>
            Main menu
          </p>
        </div>

        {/* Dummy navigation links */}
        <nav>
          <MenuItem icon={<LayoutDashboard />} label="Dashboard" />
          <MenuItem icon={<Users />} label="Team" />
          <MenuItem icon={<Settings />} label="Settings" />
          <MenuItem icon={<FileText />} label="Documentation" />
          <MenuItem icon={<HelpCircle />} label="Help & Support" />
        </nav>

        {/* Footer */}
        <div style={{
          marginTop: sp.xl,
          paddingTop: sp.xl,
          borderTop: `1px solid ${C.neutral[200]}`
        }}>
          <p style={{
            fontSize: '12px',
            color: C.neutral[400],
            margin: 0,
            textAlign: 'center'
          }}>
            Menu items coming soon
          </p>
        </div>
      </div>
    </>
  );
};

export default HamburgerMenu;

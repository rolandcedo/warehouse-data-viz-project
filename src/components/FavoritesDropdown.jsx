import React, { useEffect } from 'react';
import { Star } from 'lucide-react';
import { C, sp } from '../styles/designSystem';

/**
 * FavoritesDropdown - Dropdown panel showing user's favorited pages
 * Currently displays empty state placeholder
 */
const FavoritesDropdown = ({ isOpen, onClose }) => {
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
        top: 64,
        right: 280,  // Positioned near favorites button area
        width: 320,
        maxHeight: 400,
        background: 'white',
        borderRadius: 8,
        boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
        zIndex: 999,
        overflowY: 'auto',
        padding: sp.lg
      }}>
        <h3 style={{
          fontSize: '16px',
          fontWeight: 600,
          color: C.neutral[900],
          marginBottom: sp.md,
          margin: 0
        }}>
          Favorite Pages
        </h3>

        {/* Empty state */}
        <div style={{
          padding: `${sp.xl} 0`,
          textAlign: 'center'
        }}>
          <Star style={{
            width: 40,
            height: 40,
            color: C.neutral[300],
            marginBottom: sp.md
          }} />
          <p style={{
            fontSize: '14px',
            color: C.neutral[500],
            margin: 0
          }}>
            No favorites yet. Click the star icon to add the current page.
          </p>
        </div>
      </div>
    </>
  );
};

export default FavoritesDropdown;

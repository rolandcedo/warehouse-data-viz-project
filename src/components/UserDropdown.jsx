import React, { useEffect } from 'react';
import { Radio, Zap } from 'lucide-react';
import { C, sp } from '../styles/designSystem';

/**
 * UserDropdown - Dropdown menu for user settings (EOS/EOD and View Mode)
 * Positioned at top-right, below the GlobalNavbar user avatar
 */
const UserDropdown = ({
  isOpen,
  onClose,
  endTimeMode,
  setEndTimeMode,
  viewMode,
  setViewMode
}) => {
  // ESC key handler (follows FavoritesDropdown pattern)
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

      {/* Panel */}
      <div style={{
        position: 'fixed',
        top: 64,
        right: 40,
        width: 280,
        background: 'white',
        borderRadius: 8,
        boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
        zIndex: 999,
        padding: sp.lg
      }}>
        {/* EOS/EOD Section */}
        <div style={{ marginBottom: sp.lg }}>
          <label style={{
            fontSize: '12px',
            fontFamily: 'Roboto, sans-serif',
            fontWeight: 600,
            color: C.neutral[700],
            display: 'block',
            marginBottom: sp.sm
          }}>
            End Time Mode
          </label>
          <div style={{
            display: 'flex',
            gap: sp.xs,
            padding: '4px',
            background: C.neutral[100],
            borderRadius: 6
          }}>
            <button
              onClick={() => setEndTimeMode('eos')}
              style={{
                flex: 1,
                padding: '6px 12px',
                fontSize: '12px',
                fontFamily: 'Roboto, sans-serif',
                fontWeight: 500,
                border: 'none',
                borderRadius: 4,
                cursor: 'pointer',
                background: endTimeMode === 'eos' ? 'white' : 'transparent',
                color: endTimeMode === 'eos' ? C.brand[600] : C.neutral[500],
                boxShadow: endTimeMode === 'eos' ? '0 1px 2px rgba(0,0,0,0.1)' : 'none',
                transition: 'all 0.15s'
              }}
            >
              EOS
            </button>
            <button
              onClick={() => setEndTimeMode('eod')}
              style={{
                flex: 1,
                padding: '6px 12px',
                fontSize: '12px',
                fontFamily: 'Roboto, sans-serif',
                fontWeight: 500,
                border: 'none',
                borderRadius: 4,
                cursor: 'pointer',
                background: endTimeMode === 'eod' ? 'white' : 'transparent',
                color: endTimeMode === 'eod' ? C.brand[600] : C.neutral[500],
                boxShadow: endTimeMode === 'eod' ? '0 1px 2px rgba(0,0,0,0.1)' : 'none',
                transition: 'all 0.15s'
              }}
            >
              EOD
            </button>
          </div>
        </div>

        {/* View Mode Section */}
        <div>
          <label style={{
            fontSize: '12px',
            fontFamily: 'Roboto, sans-serif',
            fontWeight: 600,
            color: C.neutral[700],
            display: 'block',
            marginBottom: sp.sm
          }}>
            View Mode
          </label>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: sp.xs
          }}>
            <button
              onClick={() => setViewMode('live')}
              style={{
                padding: '10px 12px',
                fontSize: '13px',
                fontFamily: 'Roboto, sans-serif',
                fontWeight: 500,
                border: `1px solid ${viewMode === 'live' ? C.brand[300] : C.neutral[200]}`,
                borderRadius: 6,
                cursor: 'pointer',
                background: viewMode === 'live' ? C.brand[50] : 'white',
                color: viewMode === 'live' ? C.brand[700] : C.neutral[700],
                display: 'flex',
                alignItems: 'center',
                gap: sp.sm,
                textAlign: 'left',
                transition: 'all 0.15s'
              }}
            >
              <Radio style={{ width: 14, height: 14 }} />
              Live
            </button>
            <button
              onClick={() => setViewMode('live-plan')}
              style={{
                padding: '10px 12px',
                fontSize: '13px',
                fontFamily: 'Roboto, sans-serif',
                fontWeight: 500,
                border: `1px solid ${viewMode === 'live-plan' ? C.success[300] : C.neutral[200]}`,
                borderRadius: 6,
                cursor: 'pointer',
                background: viewMode === 'live-plan' ? C.success[50] : 'white',
                color: viewMode === 'live-plan' ? C.success[700] : C.neutral[700],
                display: 'flex',
                alignItems: 'center',
                gap: sp.sm,
                textAlign: 'left',
                transition: 'all 0.15s'
              }}
            >
              <Zap style={{ width: 14, height: 14 }} />
              Live + Plan
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserDropdown;

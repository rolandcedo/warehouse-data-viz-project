import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { C, sp, typography } from '../styles/designSystem';

/**
 * FacilityHeader - Fixed header for Facility Overview level
 * Contains breadcrumb, logo, title, and Facility Actions dropdown
 */
const FacilityHeader = ({ facilityName = 'Acme Distribution' }) => {
  return (
    <div style={{
      flexShrink: 0,
      background: 'white',
      borderBottom: `1px solid ${C.neutral[200]}`
    }}>
      {/* Breadcrumb */}
      <div style={{ padding: `${sp.md} ${sp.lg} ${sp.sm} ${sp.lg}` }}>
        <span style={{ fontSize: '12px', color: C.neutral[600] }}>
          🏠 Facility Overview
        </span>
      </div>

      {/* Logo + Title + Actions Row */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: sp.md,
        padding: `${sp.sm} ${sp.lg} ${sp.md} ${sp.lg}`
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: sp.md, flex: 1 }}>
          <img
            src="/facility-logo.png"
            alt="Facility Logo"
            style={{ width: 40, height: 40, borderRadius: 4, objectFit: 'contain' }}
          />
          <h1 style={{ ...typography.h1Large(), color: C.neutral[900], margin: 0 }}>
            {facilityName} Overview
          </h1>
        </div>
        <FacilityActionsDropdown />
      </div>
    </div>
  );
};

const FacilityActionsDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: sp.sm,
          padding: `${sp.sm} ${sp.md}`,
          background: C.brand[500],
          color: 'white',
          border: 'none',
          borderRadius: 6,
          fontSize: '14px',
          fontWeight: 500,
          cursor: 'pointer'
        }}
      >
        Facility Actions
        <ChevronDown style={{ width: 14, height: 14 }} />
      </button>

      {isOpen && (
        <>
          <div style={{ position: 'fixed', inset: 0, zIndex: 998 }} onClick={() => setIsOpen(false)} />
          <div style={{
            position: 'absolute',
            top: '100%',
            right: 0,
            marginTop: sp.xs,
            minWidth: 200,
            background: 'white',
            border: `1px solid ${C.neutral[200]}`,
            borderRadius: 8,
            boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
            zIndex: 999
          }}>
            <div style={{ padding: sp.md, cursor: 'pointer' }}>Placeholder Action 1</div>
            <div style={{ padding: sp.md, cursor: 'pointer' }}>Placeholder Action 2</div>
            <div style={{ padding: sp.md, cursor: 'pointer' }}>Placeholder Action 3</div>
          </div>
        </>
      )}
    </div>
  );
};

export default FacilityHeader;

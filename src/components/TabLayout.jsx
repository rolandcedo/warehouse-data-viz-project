import React from 'react';
import { C, sp } from '../styles/designSystem';

/**
 * TabLayout - Vertical tab navigation with content area
 * Used for the Contextual Sidepanel to show tabs alongside content
 */
const TabLayout = ({ tabs, activeTab, onTabChange, children }) => {
  return (
    <div style={{
      display: 'flex',
      height: '100%',
      overflow: 'hidden'
    }}>
      {/* Vertical Tab Sidebar */}
      <div style={{
        width: 50,
        flexShrink: 0,
        background: 'white',
        borderRight: `1px solid ${C.neutral[300]}`,
        overflow: 'auto',
        paddingTop: sp.sm
      }}>
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              title={tab.label}
              style={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: sp.md,
                marginBottom: 2,
                border: 'none',
                borderLeft: isActive ? `3px solid ${C.brand[500]}` : '3px solid transparent',
                background: isActive ? C.brand[50] : 'transparent',
                cursor: 'pointer',
                transition: 'all 0.15s',
                outline: 'none'
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = C.neutral[100];
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = 'transparent';
                }
              }}
            >
              <Icon style={{
                width: 18,
                height: 18,
                color: isActive ? C.brand[600] : C.neutral[500]
              }} />
            </button>
          );
        })}
      </div>

      {/* Tab Content Area */}
      <div style={{
        flex: 1,
        overflow: 'hidden',
        background: 'white',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {children}
      </div>
    </div>
  );
};

export default TabLayout;

import React from 'react';
import { Menu, Star, Plus, Settings, Bell, ChevronDown } from 'lucide-react';
import { C, sp, typography } from '../styles/designSystem';
import PlatformSwitcher from './PlatformSwitcher';
import FavoritesDropdown from './FavoritesDropdown';
import UserDropdown from './UserDropdown';
import { useTimeContext } from '../context/TimeContext';

/**
 * GlobalNavbar - Fixed top navigation bar
 * Positioned above all application content with dark theme
 */
const GlobalNavbar = ({ onMenuToggle, isMenuOpen }) => {
  const [isPlatformSwitcherOpen, setIsPlatformSwitcherOpen] = React.useState(false);
  const [isFavoritesOpen, setIsFavoritesOpen] = React.useState(false);
  const [isStarFilled, setIsStarFilled] = React.useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = React.useState(false);
  const { endTimeMode, setEndTimeMode, viewMode, setViewMode } = useTimeContext();

  const buttonStyle = {
    width: 38,
    height: 38,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'transparent',
    border: 'none',
    borderRadius: 6,
    cursor: 'pointer',
    color: C.neutral[300],
    transition: 'all 0.15s',
    outline: 'none'
  };

  return (
    <>
    <nav style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      height: 56,
      background: C.neutral[900],
      borderBottom: `1px solid ${C.neutral[900]}`,
      zIndex: 1001,
      display: 'flex',
      alignItems: 'center',
      paddingLeft: sp.md,
      paddingRight: sp.md,
      gap: sp.md,
      boxShadow: '0 2px 8px rgba(0,0,0,0.12)'
    }}>
      {/* Hamburger menu button */}
      <button
        onClick={onMenuToggle}
        style={buttonStyle}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = C.neutral[800];
          e.currentTarget.style.color = C.neutral[50];
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'transparent';
          e.currentTarget.style.color = C.neutral[300];
        }}
        aria-label="Toggle menu"
      >
        <Menu style={{ width: 18, height: 18 }} />
      </button>

      {/* Logo/branding with hexagon + platform switcher */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: sp.sm,
        marginLeft: sp.sm
      }}>
        <img
          src="/ProModel-ai-Logo.png"
          alt="ProModel.ai Logo"
          style={{ width: 24, height: 24, objectFit: 'contain' }}
        />

        <button
          onClick={() => setIsPlatformSwitcherOpen(!isPlatformSwitcherOpen)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: sp.xs,
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            padding: `${sp.xs} ${sp.sm}`,
            borderRadius: 6,
            transition: 'background 0.15s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = C.neutral[800]}
          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
          aria-label="Switch platform"
        >
          <h1 style={{
            ...typography.h1Large(),
            color: C.neutral[50],
            letterSpacing: '-0.02em',
            margin: 0,
            fontFamily: 'Orbitron, sans-serif'
          }}>
            ProModel.ai
          </h1>
          <ChevronDown style={{ width: 16, height: 16, color: C.neutral[300] }} />
        </button>
      </div>

      {/* Spacer to push right icons to the end */}
      <div style={{ flex: 1 }} />

      {/* Right utility icons */}
      {/* Favorites two-button combo with separate borders */}
      <div style={{
        display: 'flex',
        gap: 2
      }}>
        {/* Star button - favorite current page */}
        <button
          onClick={() => {
            setIsStarFilled(!isStarFilled);
            // Visual feedback only for now
          }}
          style={{
            width: 36,
            height: 36,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'transparent',
            border: `1px solid ${C.neutral[700]}`,
            borderRadius: '6px 0 0 6px',
            cursor: 'pointer',
            color: C.neutral[300],
            transition: 'all 0.15s',
            outline: 'none'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = C.neutral[800];
            e.currentTarget.style.color = C.neutral[50];
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.color = C.neutral[300];
          }}
          aria-label="Favorite current page"
        >
          <Star
            style={{
              width: 18,
              height: 18,
              fill: isStarFilled ? C.yellow[400] : 'none'
            }}
          />
        </button>

        {/* Dropdown button - show favorites list */}
        <button
          onClick={() => setIsFavoritesOpen(!isFavoritesOpen)}
          style={{
            width: 36,
            height: 36,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'transparent',
            border: `1px solid ${C.neutral[700]}`,
            borderRadius: '0 6px 6px 0',
            cursor: 'pointer',
            color: C.neutral[300],
            transition: 'all 0.15s',
            outline: 'none'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = C.neutral[800];
            e.currentTarget.style.color = C.neutral[50];
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.color = C.neutral[300];
          }}
          aria-label="View favorites"
        >
          <ChevronDown style={{ width: 18, height: 18 }} />
        </button>
      </div>

      <button
        style={buttonStyle}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = C.neutral[800];
          e.currentTarget.style.color = C.neutral[50];
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'transparent';
          e.currentTarget.style.color = C.neutral[300];
        }}
        aria-label="Create new"
      >
        <Plus style={{ width: 18, height: 18 }} />
      </button>

      <button
        style={buttonStyle}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = C.neutral[800];
          e.currentTarget.style.color = C.neutral[50];
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'transparent';
          e.currentTarget.style.color = C.neutral[300];
        }}
        aria-label="Settings"
      >
        <Settings style={{ width: 18, height: 18 }} />
      </button>

      <button
        style={buttonStyle}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = C.neutral[800];
          e.currentTarget.style.color = C.neutral[50];
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'transparent';
          e.currentTarget.style.color = C.neutral[300];
        }}
        aria-label="Notifications"
      >
        <Bell style={{ width: 18, height: 18 }} />
      </button>

      {/* User avatar */}
      <button
        onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
        style={{
          width: 36,
          height: 36,
          borderRadius: '50%',
          background: C.brand[500],
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: '14px',
          fontWeight: 600,
          marginLeft: sp.xs,
          cursor: 'pointer',
          border: 'none',
          padding: 0
        }}
        aria-label="User menu"
      >
        DA
      </button>
    </nav>

    {/* Platform Switcher Dropdown */}
    <PlatformSwitcher
      isOpen={isPlatformSwitcherOpen}
      onClose={() => setIsPlatformSwitcherOpen(false)}
    />

    {/* Favorites Dropdown */}
    <FavoritesDropdown
      isOpen={isFavoritesOpen}
      onClose={() => setIsFavoritesOpen(false)}
    />

    {/* User Dropdown */}
    <UserDropdown
      isOpen={isUserDropdownOpen}
      onClose={() => setIsUserDropdownOpen(false)}
      endTimeMode={endTimeMode}
      setEndTimeMode={setEndTimeMode}
      viewMode={viewMode}
      setViewMode={setViewMode}
    />
    </>
  );
};

export default GlobalNavbar;

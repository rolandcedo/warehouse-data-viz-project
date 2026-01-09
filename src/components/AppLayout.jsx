import React, { useRef, useCallback } from 'react';
import TimeScrubber from './TimeScrubber';
import ResizeHandle from './ResizeHandle';
import { sp, C } from '../styles/designSystem';

/**
 * AppLayout - Global 4-zone layout structure with resizable panels
 * - LLM sidebar extends full height (when expanded)
 * - TimeScrubber pushed right when LLM expanded
 * - Resizable Contextual Sidepanel
 */
const AppLayout = ({
  llmSidebar,                    // LLM sidebar component (collapsible)
  showLLMSidebar = false,        // LLM sidebar expanded state
  llmWidth,                      // Current LLM width in pixels (null = default)
  leftNav,                       // Left navigation component (52px sidebar)
  children,                      // Main content area (center canvas)
  sidepanelContent,              // Right contextual panel content
  showSidepanel = true,          // Always true for now (can add toggle later)
  sidepanelWidth,                // Current sidepanel width (null = default 50%)
  onSidepanelWidthChange,        // Callback to update sidepanel width
  style                          // Additional styles (e.g., marginTop for navbar)
}) => {
  const sidepanelRef = useRef(null);
  const containerRef = useRef(null);

  // Handle sidepanel resize - drag from LEFT edge
  const handleSidepanelResize = useCallback((deltaX) => {
    if (!containerRef.current || !onSidepanelWidthChange) return;

    const containerWidth = containerRef.current.offsetWidth;
    const llmActualWidth = showLLMSidebar ? (llmWidth || window.innerWidth * 0.2) : 48;
    const availableWidth = containerWidth - llmActualWidth - (leftNav ? 52 : 0);

    // Get current width or calculate from default 50%
    const currentWidth = sidepanelWidth || (availableWidth * 0.5);

    // New width (subtract deltaX because dragging left edge)
    const newWidth = currentWidth - deltaX;

    // Constraints
    const MIN_WIDTH = 400;
    const MAX_WIDTH_PERCENT = 70;
    const maxWidth = availableWidth * (MAX_WIDTH_PERCENT / 100);

    // Constrain and update
    const constrainedWidth = Math.max(MIN_WIDTH, Math.min(newWidth, maxWidth));
    onSidepanelWidthChange(constrainedWidth);
  }, [sidepanelWidth, llmWidth, showLLMSidebar, leftNav, onSidepanelWidthChange]);

  return (
    <div
      ref={containerRef}
      style={{
        display: 'flex',
        flexDirection: 'row',
        height: style?.marginTop ? `calc(100vh - ${style.marginTop}px)` : '100vh',
        overflow: 'hidden',
        background: C.neutral[900],
        ...style
      }}
    >
      {/* LLM Sidebar - Full height at root level */}
      {llmSidebar}

      {/* Rest of layout: TimeScrubber + Main content */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        overflow: 'hidden'
      }}>
        {/* 30K ft: Global Header Bar - TimeScrubber */}
        <div style={{
          width: '100%',
          flexShrink: 0,
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          zIndex: 100
        }}>
          <TimeScrubber />
        </div>

        {/* Main Layout: Left Nav + Content + Sidepanel */}
        <div style={{
          display: 'flex',
          flexDirection: 'row',
          flex: 1,
          overflow: 'hidden'
        }}>
          {/* Left Navigation (52px) */}
          {leftNav && (
            <div style={{
              width: 52,
              flexShrink: 0,
              background: C.neutral[100],
              borderRight: `1px solid ${C.neutral[200]}`,
              overflow: 'auto'
            }}>
              {leftNav}
            </div>
          )}

          {/* 20K ft: Main Content Area (Canvas/Visualize) */}
          <div style={{
            flex: sidepanelWidth ? '1 1 0' : '1 1 0',
            minWidth: 0,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'auto',
            padding: sp.lg,
            background: C.neutral[50]
          }} data-scroll-container>
            {children}
          </div>

          {/* 10K ft: Contextual Sidepanel (Analyze & Optimize) */}
          {showSidepanel && (
            <div
              ref={sidepanelRef}
              style={{
                flex: sidepanelWidth ? `0 0 ${sidepanelWidth}px` : '1 1 0',
                minWidth: 400,
                display: 'flex',
                flexDirection: 'column',
                borderLeft: `1px solid ${C.neutral[200]}`,
                background: 'white',
                overflow: 'hidden',
                position: 'relative'
              }}
            >
              {/* Resize handle on LEFT edge */}
              <ResizeHandle
                onResize={handleSidepanelResize}
                direction="vertical"
                position="left"
              />

              {sidepanelContent || <DefaultSidepanelContent />}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Default sidepanel content when nothing is selected
const DefaultSidepanelContent = () => (
  <div style={{ padding: sp.lg }}>
    <h3 style={{ fontSize: '16px', fontWeight: 500, marginBottom: sp.md, color: C.neutral[800] }}>
      Analysis & Insights
    </h3>
    <p style={{ fontSize: '14px', color: C.neutral[600], margin: 0 }}>
      Select an element to view details and recommendations.
    </p>
  </div>
);

export default AppLayout;

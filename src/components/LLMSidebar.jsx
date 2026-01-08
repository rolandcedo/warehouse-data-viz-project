import React, { useState, useRef, useCallback } from 'react';
import { MessageCircle, Star, Settings, HelpCircle, Plus, Sliders } from 'lucide-react';
import { C, sp } from '../styles/designSystem';
import SageAvatar from './SageAvatar';
import ResizeHandle from './ResizeHandle';

/**
 * LLMSidebar - Icon-based collapsible AI chat sidebar
 * Features vertical icon bar with brand colors and collapsible drawer
 */
const LLMSidebar = ({ isExpanded, onToggle, chatHistory = [], onSelectChat, onNewChat, favorites = [], width, onWidthChange }) => {
  const [activeDrawer, setActiveDrawer] = useState(null);
  const containerRef = useRef(null);

  // Handle drawer resize
  const handleResize = useCallback((deltaX) => {
    if (!onWidthChange) return;

    // Get current width or default (1/5 of viewport)
    const currentWidth = width || window.innerWidth * 0.2;

    // New width (add deltaX because we're dragging from the right edge)
    const newWidth = currentWidth + deltaX;

    // Constraints
    const MIN_WIDTH = 280;
    const MAX_WIDTH = window.innerWidth * 0.5;

    // Constrain and update
    const constrainedWidth = Math.max(MIN_WIDTH, Math.min(newWidth, MAX_WIDTH));
    onWidthChange(constrainedWidth);
  }, [width, onWidthChange]);

  const iconButtonStyle = (isActive) => ({
    width: 50,
    height: 50,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: isActive ? C.neutral[800] : 'transparent',
    border: 'none',
    cursor: 'pointer',
    transition: 'background 0.15s',
    color: isActive ? C.brand[400] : C.neutral[400],
    position: 'relative',
    flexShrink: 0
  });

  const handleIconClick = (drawerName) => {
    if (drawerName === 'new-chat') {
      // Toggle chat: if already showing chat, close it; otherwise open it
      if (activeDrawer === 'chat' && isExpanded) {
        setActiveDrawer(null);
        onToggle(); // Close sidebar
      } else {
        setActiveDrawer('chat');
        if (!isExpanded) {
          onToggle(); // Open sidebar
        }
        onNewChat?.();
      }
    } else {
      const newDrawer = activeDrawer === drawerName ? null : drawerName;
      setActiveDrawer(newDrawer);

      // Toggle sidebar based on drawer state
      if (newDrawer && !isExpanded) {
        onToggle();
      } else if (!newDrawer && isExpanded) {
        onToggle();
      }
    }
  };

  return (
    <div style={{
      display: 'flex',
      height: '100%',
      background: C.neutral[900],
      flexShrink: 0
    }}>
      {/* Icon column - always visible */}
      <div style={{
        width: 50,
        height: '100%',
        background: C.neutral[900],
        borderRight: `1px solid ${C.neutral[900]}`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: sp.md,
        paddingBottom: sp.md,
        flexShrink: 0
      }}>
        {/* New Chat - Sage Avatar */}
        <button
          onClick={() => handleIconClick('new-chat')}
          style={iconButtonStyle(false)}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = C.neutral[800];
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
          }}
          title="New Chat"
        >
          <SageAvatar size={28} />
        </button>

        {/* Chat History */}
        <button
          onClick={() => handleIconClick('history')}
          style={iconButtonStyle(activeDrawer === 'history')}
          onMouseEnter={(e) => {
            if (activeDrawer !== 'history') {
              e.currentTarget.style.background = C.neutral[800];
            }
          }}
          onMouseLeave={(e) => {
            if (activeDrawer !== 'history') {
              e.currentTarget.style.background = 'transparent';
            }
          }}
          title="Chat History"
        >
          <MessageCircle style={{ width: 20, height: 20 }} />
          {chatHistory.length > 0 && (
            <div style={{
              position: 'absolute',
              top: 8,
              right: 8,
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: C.brand[500]
            }} />
          )}
        </button>

        {/* Favorites */}
        <button
          onClick={() => handleIconClick('favorites')}
          style={iconButtonStyle(activeDrawer === 'favorites')}
          onMouseEnter={(e) => {
            if (activeDrawer !== 'favorites') {
              e.currentTarget.style.background = C.neutral[800];
            }
          }}
          onMouseLeave={(e) => {
            if (activeDrawer !== 'favorites') {
              e.currentTarget.style.background = 'transparent';
            }
          }}
          title="Favorites"
        >
          <Star style={{ width: 20, height: 20 }} />
        </button>

        {/* Spacer to push help and settings to bottom */}
        <div style={{ flex: 1 }} />

        {/* Help */}
        <button
          onClick={() => handleIconClick('help')}
          style={iconButtonStyle(activeDrawer === 'help')}
          onMouseEnter={(e) => {
            if (activeDrawer !== 'help') {
              e.currentTarget.style.background = C.neutral[800];
            }
          }}
          onMouseLeave={(e) => {
            if (activeDrawer !== 'help') {
              e.currentTarget.style.background = 'transparent';
            }
          }}
          title="Help"
        >
          <HelpCircle style={{ width: 20, height: 20 }} />
        </button>

        {/* Settings (bottom) */}
        <button
          onClick={() => handleIconClick('settings')}
          style={iconButtonStyle(activeDrawer === 'settings')}
          onMouseEnter={(e) => {
            if (activeDrawer !== 'settings') {
              e.currentTarget.style.background = C.neutral[800];
            }
          }}
          onMouseLeave={(e) => {
            if (activeDrawer !== 'settings') {
              e.currentTarget.style.background = 'transparent';
            }
          }}
          title="AI Settings"
        >
          <Settings style={{ width: 20, height: 20 }} />
        </button>
      </div>

      {/* Expandable drawer content */}
      {isExpanded && activeDrawer && (
        <div
          ref={containerRef}
          style={{
            width: width || window.innerWidth * 0.2,
            height: '100%',
            background: C.neutral[800],
            borderRight: `1px solid ${C.neutral[900]}`,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            flexShrink: 0,
            position: 'relative'
          }}
        >
          {/* Resize handle on RIGHT edge */}
          <ResizeHandle
            onResize={handleResize}
            direction="vertical"
            position="right"
          />

          {activeDrawer === 'chat' && (
            <ChatDrawer />
          )}
          {activeDrawer === 'history' && (
            <ChatHistoryDrawer
              chatHistory={chatHistory}
              onSelectChat={onSelectChat}
            />
          )}
          {activeDrawer === 'favorites' && (
            <FavoritesDrawer
              favorites={favorites}
              onSelectChat={onSelectChat}
            />
          )}
          {activeDrawer === 'settings' && (
            <SettingsDrawer />
          )}
          {activeDrawer === 'help' && (
            <HelpDrawer />
          )}
        </div>
      )}
    </div>
  );
};

/**
 * ChatDrawer - Main chat interface
 */
const ChatDrawer = () => {
  const [inputValue, setInputValue] = React.useState('');
  const charLimit = 128000;
  const charCount = inputValue.length;

  const exampleMessages = [
    {
      role: 'user',
      content: 'What are the top priorities for optimizing warehouse operations today?'
    },
    {
      role: 'assistant',
      content: 'Based on current metrics, here are the top 3 priorities:\n\n1. **Inbound Zone Congestion** - Zone Z01 is at 127% capacity\n2. **Staff Allocation** - Day shift is understaffed by 8 workers\n3. **Equipment Utilization** - Forklifts FL-003 and FL-007 need maintenance\n\nWould you like me to create an action plan for any of these?'
    }
  ];

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      overflow: 'hidden'
    }}>
      {/* Header without icons */}
      <div style={{
        padding: sp.md,
        borderBottom: `1px solid ${C.neutral[800]}`
      }}>
        <h3 style={{
          fontSize: '14px',
          fontWeight: 600,
          color: C.neutral[50],
          margin: 0
        }}>
          Ask Sage Anything...
        </h3>
      </div>

      {/* Chat messages area */}
      <div style={{
        flex: 1,
        overflow: 'auto',
        padding: sp.md,
        display: 'flex',
        flexDirection: 'column',
        gap: sp.md
      }}>
        {exampleMessages.map((msg, idx) => (
          <div
            key={idx}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: sp.xs,
              padding: sp.md,
              borderRadius: 8,
              background: msg.role === 'user' ? C.brand[500] : C.neutral[200],
              alignSelf: 'stretch'
            }}
          >
            <div style={{
              fontSize: '11px',
              fontWeight: 600,
              color: msg.role === 'user' ? 'white' : C.neutral[700],
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              {msg.role === 'user' ? 'You' : 'Assistant'}
            </div>
            <div style={{
              fontSize: '13px',
              color: msg.role === 'user' ? 'white' : C.neutral[800],
              lineHeight: 1.5,
              whiteSpace: 'pre-wrap'
            }}>
              {msg.content}
            </div>
          </div>
        ))}
      </div>

      {/* Input area */}
      <div style={{
        padding: sp.md,
        borderTop: `1px solid ${C.neutral[800]}`
      }}>
        {/* Input box without icons */}
        <div style={{
          background: C.neutral[700],
          borderRadius: 8,
          padding: sp.sm,
          marginBottom: sp.sm
        }}>
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask Sage Anything..."
            style={{
              width: '100%',
              minHeight: 60,
              padding: sp.sm,
              background: 'transparent',
              border: 'none',
              color: C.neutral[200],
              fontSize: '13px',
              fontFamily: 'inherit',
              resize: 'none',
              outline: 'none'
            }}
          />
        </div>

        {/* Bottom row: Action buttons and character count */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          {/* Left: Action buttons */}
          <div style={{
            display: 'flex',
            gap: sp.sm
          }}>
            <button
              style={{
                width: 32,
                height: 32,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'transparent',
                border: `1px solid ${C.neutral[700]}`,
                borderRadius: 4,
                cursor: 'pointer',
                color: C.neutral[400]
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = C.neutral[800];
                e.currentTarget.style.borderColor = C.neutral[600];
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.borderColor = C.neutral[700];
              }}
              title="New chat"
            >
              <Plus style={{ width: 16, height: 16 }} />
            </button>
            <button
              style={{
                width: 32,
                height: 32,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'transparent',
                border: `1px solid ${C.neutral[700]}`,
                borderRadius: 4,
                cursor: 'pointer',
                color: C.neutral[400]
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = C.neutral[800];
                e.currentTarget.style.borderColor = C.neutral[600];
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.borderColor = C.neutral[700];
              }}
              title="Settings"
            >
              <Sliders style={{ width: 16, height: 16 }} />
            </button>
          </div>

          {/* Right: Character count */}
          <div style={{
            color: C.neutral[400],
            fontSize: '12px'
          }}>
            {charCount} / {charLimit.toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * ChatHistoryDrawer - Shows list of previous chat sessions
 */
const ChatHistoryDrawer = ({ chatHistory, onSelectChat }) => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      overflow: 'hidden'
    }}>
      {/* Header */}
      <div style={{
        padding: sp.md,
        borderBottom: `1px solid ${C.neutral[800]}`
      }}>
        <h3 style={{
          fontSize: '14px',
          fontWeight: 600,
          color: C.neutral[50],
          margin: 0
        }}>
          Chat History
        </h3>
      </div>

      {/* Chat list */}
      <div style={{
        flex: 1,
        overflow: 'auto',
        padding: sp.sm
      }}>
        {chatHistory.length === 0 ? (
          <div style={{
            padding: sp.lg,
            textAlign: 'center',
            color: C.neutral[500],
            fontSize: '13px'
          }}>
            No previous chats
          </div>
        ) : (
          chatHistory.map((chat, index) => (
            <button
              key={chat.id || index}
              onClick={() => onSelectChat?.(chat)}
              style={{
                width: '100%',
                padding: sp.md,
                marginBottom: sp.xs,
                background: 'transparent',
                border: `1px solid ${C.neutral[800]}`,
                borderRadius: 6,
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.15s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = C.neutral[800];
                e.currentTarget.style.borderColor = C.brand[500];
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.borderColor = C.neutral[800];
              }}
            >
              <div style={{
                fontSize: '13px',
                fontWeight: 500,
                color: C.neutral[200],
                marginBottom: 4,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}>
                {chat.title || 'Untitled Chat'}
              </div>
              <div style={{
                fontSize: '11px',
                color: C.neutral[500]
              }}>
                {chat.timestamp || 'Recent'}
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
};

/**
 * FavoritesDrawer - Shows favorited chats
 */
const FavoritesDrawer = ({ favorites, onSelectChat }) => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      overflow: 'hidden'
    }}>
      {/* Header */}
      <div style={{
        padding: sp.md,
        borderBottom: `1px solid ${C.neutral[800]}`
      }}>
        <h3 style={{
          fontSize: '14px',
          fontWeight: 600,
          color: C.neutral[50],
          margin: 0
        }}>
          Favorites
        </h3>
      </div>

      {/* Favorites list */}
      <div style={{
        flex: 1,
        overflow: 'auto',
        padding: sp.sm
      }}>
        {favorites.length === 0 ? (
          <div style={{
            padding: sp.lg,
            textAlign: 'center',
            color: C.neutral[500],
            fontSize: '13px'
          }}>
            No favorite chats yet
          </div>
        ) : (
          favorites.map((chat, index) => (
            <button
              key={chat.id || index}
              onClick={() => onSelectChat?.(chat)}
              style={{
                width: '100%',
                padding: sp.md,
                marginBottom: sp.xs,
                background: 'transparent',
                border: `1px solid ${C.neutral[800]}`,
                borderRadius: 6,
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.15s',
                display: 'flex',
                alignItems: 'center',
                gap: sp.sm
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = C.neutral[800];
                e.currentTarget.style.borderColor = C.brand[500];
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.borderColor = C.neutral[800];
              }}
            >
              <Star style={{ width: 14, height: 14, color: C.yellow[400], fill: C.yellow[400], flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontSize: '13px',
                  fontWeight: 500,
                  color: C.neutral[200],
                  marginBottom: 4,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}>
                  {chat.title || 'Untitled Chat'}
                </div>
                <div style={{
                  fontSize: '11px',
                  color: C.neutral[500]
                }}>
                  {chat.timestamp || 'Recent'}
                </div>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
};

/**
 * SettingsDrawer - AI settings panel
 */
const SettingsDrawer = () => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      overflow: 'hidden'
    }}>
      {/* Header */}
      <div style={{
        padding: sp.md,
        borderBottom: `1px solid ${C.neutral[800]}`
      }}>
        <h3 style={{
          fontSize: '14px',
          fontWeight: 600,
          color: C.neutral[50],
          margin: 0
        }}>
          AI Settings
        </h3>
      </div>

      {/* Settings content */}
      <div style={{
        flex: 1,
        overflow: 'auto',
        padding: sp.md
      }}>
        <div style={{
          color: C.neutral[400],
          fontSize: '13px',
          textAlign: 'center',
          paddingTop: sp.lg
        }}>
          Settings panel coming soon
        </div>
      </div>
    </div>
  );
};

/**
 * HelpDrawer - Help and documentation panel
 */
const HelpDrawer = () => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      overflow: 'hidden'
    }}>
      {/* Header */}
      <div style={{
        padding: sp.md,
        borderBottom: `1px solid ${C.neutral[800]}`
      }}>
        <h3 style={{
          fontSize: '14px',
          fontWeight: 600,
          color: C.neutral[50],
          margin: 0
        }}>
          Help & Documentation
        </h3>
      </div>

      {/* Help content */}
      <div style={{
        flex: 1,
        overflow: 'auto',
        padding: sp.md
      }}>
        <div style={{
          color: C.neutral[300],
          fontSize: '13px',
          lineHeight: 1.6
        }}>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>

          <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>

          <h4 style={{ color: C.neutral[50], fontSize: '14px', fontWeight: 600, marginTop: sp.lg, marginBottom: sp.sm }}>Getting Started</h4>
          <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.</p>

          <h4 style={{ color: C.neutral[50], fontSize: '14px', fontWeight: 600, marginTop: sp.lg, marginBottom: sp.sm }}>Common Questions</h4>
          <p>Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.</p>
        </div>
      </div>
    </div>
  );
};

export default LLMSidebar;

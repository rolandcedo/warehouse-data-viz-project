# LLM Sidebar Component

## Overview

The LLM Sidebar is a brand-colored, icon-based collapsible sidebar for AI chat functionality. It features a vertical icon bar (always visible) and an expandable drawer for chat history, favorites, and settings.

## Components Created

### 1. AILogo.jsx
- BigBear.ai hexagon logo with two 4-pointed stars
- Customizable size and color
- Used as the "New Chat" icon

### 2. LLMSidebar.jsx (Refactored)
- Icon-based vertical sidebar with 4 main icons:
  1. **AI Logo** (top) - Opens new chat
  2. **Message Bubbles** - Opens chat history drawer
  3. **Star** - Opens favorites drawer
  4. **Settings** (bottom) - Opens AI settings drawer

## Visual Design

### Icon Bar
- Width: 50px (always visible)
- Background: `C.neutral[900]` (dark theme matching GlobalNavbar)
- Icons: Brand blue (`C.brand[400]`) in neutral gray (`C.neutral[400]`)
- Active state: Background `C.neutral[800]`, icon color `C.brand[400]`
- Hover: Background `C.neutral[800]`

### Expandable Drawer
- Width: 280px (when expanded)
- Background: `C.neutral[900]`
- Shows content based on active icon:
  - **Chat History**: List of previous chat sessions
  - **Favorites**: Starred/favorited chats
  - **Settings**: AI configuration panel (placeholder)

## Usage Example

```jsx
import React, { useState } from 'react';
import LLMSidebar from './components/LLMSidebar';

function App() {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [chatHistory, setChatHistory] = useState([
    { id: 1, title: 'Zone staffing analysis', timestamp: '2 hours ago' },
    { id: 2, title: 'Equipment maintenance plan', timestamp: 'Yesterday' }
  ]);
  const [favorites, setFavorites] = useState([
    { id: 3, title: 'Daily operations checklist', timestamp: 'Last week' }
  ]);

  const handleNewChat = () => {
    console.log('Starting new chat...');
    // Logic to start a new chat session
  };

  const handleSelectChat = (chat) => {
    console.log('Selected chat:', chat);
    // Logic to load selected chat
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <LLMSidebar
        isExpanded={isSidebarExpanded}
        onToggle={() => setIsSidebarExpanded(!isSidebarExpanded)}
        chatHistory={chatHistory}
        favorites={favorites}
        onNewChat={handleNewChat}
        onSelectChat={handleSelectChat}
      />

      {/* Main chat content area */}
      <div style={{ flex: 1 }}>
        {/* Your chat interface here */}
      </div>
    </div>
  );
}
```

## Props

### LLMSidebar

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isExpanded` | boolean | - | Controls whether the drawer is expanded |
| `onToggle` | function | - | Callback when drawer should toggle |
| `chatHistory` | array | `[]` | Array of chat objects with `{ id, title, timestamp }` |
| `favorites` | array | `[]` | Array of favorited chat objects |
| `onNewChat` | function | - | Callback when new chat button is clicked |
| `onSelectChat` | function | - | Callback when a chat is selected from history/favorites |

### AILogo

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | number | `24` | Size of the logo in pixels |
| `color` | string | `C.brand[500]` | Color of the logo and stars |

## Features

### Icon Interactions
- **New Chat (AI Logo)**: Triggers `onNewChat`, collapses drawer
- **Chat History**: Toggles history drawer, shows notification dot if chats exist
- **Favorites**: Toggles favorites drawer, shows starred chats
- **Settings**: Toggles settings panel (placeholder for future functionality)

### Chat List Items
- Hover states with brand blue border
- Truncated titles with ellipsis
- Timestamp display
- Favorites show filled star icon

### Responsive Behavior
- Icon bar always visible (50px width)
- Drawer expands to 280px when active
- Smooth transitions
- Auto-collapse when clicking "New Chat"

## Design Tokens Used

- **Colors**: `C.neutral[900]`, `C.neutral[800]`, `C.neutral[700]`, `C.brand[400]`, `C.brand[500]`, `C.yellow[400]`
- **Spacing**: `sp.xs`, `sp.sm`, `sp.md`, `sp.lg`
- **Typography**: 13px (chat titles), 11px (timestamps), 14px (headers)

## Integration Notes

1. The sidebar is designed to be placed inside the LLM chat interface container
2. It uses flexbox layout and should be placed alongside the main chat content area
3. The drawer state is controlled externally via `isExpanded` and `onToggle` props
4. Chat data is managed by the parent component and passed as props

## Future Enhancements

- Settings panel functionality
- Search within chat history
- Drag-and-drop to reorder favorites
- Keyboard shortcuts (Ctrl+N for new chat, etc.)
- Chat session management (delete, archive)

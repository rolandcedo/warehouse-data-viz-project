# Contextual Side Panel - Responsive Masonry Layout Pattern

## Overview

This document defines the standardized approach for implementing responsive masonry layouts across all Contextual Side Panel screens in the Warehouse Operations Dashboard. The pattern enables cards to dynamically arrange into 1, 2, or 3 columns based on container width, providing optimal use of available space.

## Core Architecture

### Container-Based Responsive Design

**Key Principle:** Use ResizeObserver to track the **container's actual width**, not window width.

**Why Container-Based:**
- Executive.jsx renders tab content inside a containerRef with `padding: sp.lg` (24px)
- Window width includes left navigation panel, which varies
- Container width accurately reflects available space for content
- Breakpoints trigger at correct thresholds regardless of window size

### Standard Breakpoints

```javascript
// Breakpoints based on container width (not window width)
const columnCount = containerWidth >= 2200 ? 3 : (containerWidth >= 992 ? 2 : 1);
```

- **< 992px:** 1 column (vertical stack)
- **992px - 2199px:** 2 columns (desktop, side-by-side)
- **≥ 2200px:** 3 columns (ultrawide displays)

### Spacing System

- **Column gap:** `sp.lg` (24px)
- **Card margin bottom:** `sp.lg` (24px)
- **Container padding:** `sp.lg` (24px) - provided by Executive.jsx

## Implementation Patterns

### Pattern A: Single-Level Tab Content (Most Common)

**Use for:** Facility-level tabs without internal sub-tabs

**Examples:** Work Content, Staffing, Zones, Asset Health (Equipment)

**Structure:**

```jsx
import React, { useState, useRef, useEffect } from 'react';
import { C, sp } from '../../styles/designSystem';

const TabContent = ({ ...props }) => {
  // Track container width for responsive masonry layout
  const containerRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    if (!containerRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        setContainerWidth(entry.contentRect.width);
      }
    });

    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  // Determine column count based on container width (not window width)
  const columnCount = containerWidth >= 2200 ? 3 : (containerWidth >= 992 ? 2 : 1);

  return (
    <>
      <Header icon={IconComponent} title="Tab Title" sub="Description" color={C.color[500]} />

      {/* Masonry Container - responsive columns */}
      <div ref={containerRef} style={{
        columnCount: columnCount,
        columnGap: sp.lg
      }}>

        {/* ===== CARD 1 ===== */}
        <div style={{
          breakInside: 'avoid',
          pageBreakInside: 'avoid',
          WebkitColumnBreakInside: 'avoid',
          marginBottom: sp.lg,
          display: 'inline-block',
          width: '100%'
        }}>
          <Card>
            {/* Card content */}
          </Card>
        </div>

        {/* ===== CARD 2 ===== */}
        <div style={{
          breakInside: 'avoid',
          pageBreakInside: 'avoid',
          WebkitColumnBreakInside: 'avoid',
          marginBottom: sp.lg,
          display: 'inline-block',
          width: '100%'
        }}>
          <Card>
            {/* Card content */}
          </Card>
        </div>

        {/* Additional cards follow same pattern */}

      </div>
    </>
  );
};

export default TabContent;
```

**Implemented Examples:**
- `/src/views/tabs/WorkTabContent.jsx`
- `/src/views/tabs/StaffTabContent.jsx`
- `/src/views/tabs/ZonesTabContent.jsx`
- `/src/views/tabs/EquipmentTabContent.jsx`

---

### Pattern B: Multi-Level Tab Content (Internal Sub-Tabs)

**Use for:** Tabs with internal sub-tab navigation

**Examples:** Schedule Overview (Staffing, Inbound, Outbound, Maintenance sub-tabs)

**Key Difference:** Single `containerRef` is shared across all sub-tabs since only ONE renders at a time

**Structure:**

```jsx
import React, { useState, useRef, useEffect } from 'react';
import { C, sp } from '../../styles/designSystem';

const TabContentWithSubTabs = ({ ...props }) => {
  // Sub-tab state
  const [activeSubTab, setActiveSubTab] = useState('subtab1');

  // Track container width for responsive masonry layout (shared across all sub-tabs)
  const containerRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    if (!containerRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        setContainerWidth(entry.contentRect.width);
      }
    });

    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  // Determine column count based on container width (not window width)
  const columnCount = containerWidth >= 2200 ? 3 : (containerWidth >= 992 ? 2 : 1);

  return (
    <>
      <Header icon={IconComponent} title="Tab Title" sub="Description" color={C.color[500]} />

      {/* Sub-tab Navigation */}
      <div style={{
        display: 'flex',
        gap: 0,
        marginBottom: sp.md,
        borderBottom: `1px solid ${C.neutral[200]}`
      }}>
        {[
          { id: 'subtab1', label: 'Sub-Tab 1', icon: Icon1, color: C.purple[500] },
          { id: 'subtab2', label: 'Sub-Tab 2', icon: Icon2, color: C.blueLight[500] },
          // ... more sub-tabs
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <div
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              style={{
                padding: `${sp.sm} ${sp.md}`,
                fontSize: '13px',
                fontWeight: 500,
                color: activeSubTab === tab.id ? C.neutral[900] : C.neutral[500],
                borderBottom: activeSubTab === tab.id ? `2px solid ${tab.color}` : '2px solid transparent',
                marginBottom: '-1px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: sp.xs,
                transition: 'all 0.15s'
              }}
            >
              <Icon style={{ width: 14, height: 14 }} />
              {tab.label}
            </div>
          );
        })}
      </div>

      {/* ===== SUB-TAB 1 ===== */}
      {activeSubTab === 'subtab1' && (
        <div ref={containerRef} style={{
          columnCount: columnCount,
          columnGap: sp.lg
        }}>

          {/* ===== CARD 1 ===== */}
          <div style={{
            breakInside: 'avoid',
            pageBreakInside: 'avoid',
            WebkitColumnBreakInside: 'avoid',
            marginBottom: sp.lg,
            display: 'inline-block',
            width: '100%'
          }}>
            <Card>
              {/* Card content */}
            </Card>
          </div>

          {/* Additional cards for sub-tab 1 */}

        </div>
      )}

      {/* ===== SUB-TAB 2 ===== */}
      {activeSubTab === 'subtab2' && (
        <div ref={containerRef} style={{
          columnCount: columnCount,
          columnGap: sp.lg
        }}>

          {/* Cards for sub-tab 2 */}

        </div>
      )}

      {/* Additional sub-tabs follow same pattern */}
    </>
  );
};

export default TabContentWithSubTabs;
```

**Why Single containerRef Works:**
- Only ONE sub-tab renders at a time (conditional rendering)
- React automatically reassigns ref when active sub-tab changes
- ResizeObserver tracks whichever masonry container is currently visible
- No ref conflicts or memory leaks

**Implemented Examples:**
- `/src/views/tabs/ScheduleTabContent.jsx`
  - Staffing sub-tab (6 cards)
  - Inbound sub-tab (4 cards)
  - Outbound sub-tab (4 cards)
  - Maintenance sub-tab (4 cards)

---

## Masonry Item Wrapper (Reusable)

Every Card, DataGrid, or content block must be wrapped with this pattern:

```jsx
<div style={{
  breakInside: 'avoid',
  pageBreakInside: 'avoid',
  WebkitColumnBreakInside: 'avoid',
  marginBottom: sp.lg,
  display: 'inline-block',
  width: '100%'
}}>
  <Card>{/* content */}</Card>
</div>
```

**Why Each Property is Required:**

- **`breakInside: 'avoid'`**: Standard CSS column breaking control
- **`pageBreakInside: 'avoid'`**: Fallback for older browsers
- **`WebkitColumnBreakInside: 'avoid'`**: Webkit-specific column breaking control
- **`marginBottom: sp.lg`**: Vertical spacing between cards (24px)
- **`display: 'inline-block'`**: Required for column breaking to work correctly
- **`width: '100%'`**: Ensures card spans full column width

---

## Architecture Diagrams

### Single-Level Tab Architecture

```
Executive.jsx (containerRef with padding: sp.lg)
├── TabContent Component
│   └── Fragment <>
│       ├── Header
│       └── Masonry Container <div ref={containerRef}>
│           ├── Masonry Item Wrapper (breakInside: avoid)
│           │   └── Card 1
│           ├── Masonry Item Wrapper
│           │   └── Card 2
│           ├── Masonry Item Wrapper
│           │   └── Card 3
│           └── ... (more cards)
```

**Padding Flow:**
- Executive.jsx containerRef: `padding: sp.lg` (24px) ✓
- Fragment `<>`: No DOM element, no padding ✓
- Masonry Container `<div>`: No padding ✓
- **Total:** Single 24px padding (correct)

---

### Multi-Level Tab Architecture

```
Executive.jsx (containerRef with padding: sp.lg)
├── TabContentWithSubTabs Component
│   ├── activeSubTab state
│   ├── containerRef (shared)
│   ├── containerWidth state (shared)
│   ├── ResizeObserver (shared)
│   └── Fragment <>
│       ├── Header
│       ├── Sub-Tab Navigation
│       │
│       ├── {activeSubTab === 'subtab1' && (
│       │   <Masonry Container ref={containerRef}>
│       │       ├── Masonry Item Wrapper
│       │       │   └── Card 1
│       │       └── ... (more cards)
│       │   </Masonry Container>
│       │   )}
│       │
│       ├── {activeSubTab === 'subtab2' && (
│       │   <Masonry Container ref={containerRef}>
│       │       └── ... (cards for subtab 2)
│       │   </Masonry Container>
│       │   )}
│       │
│       └── ... (more sub-tabs)
```

**Ref Assignment Flow:**
- User clicks Sub-Tab 1 → Sub-Tab 1's masonry container gets ref
- User clicks Sub-Tab 2 → Sub-Tab 2's masonry container gets ref
- Only ONE masonry container exists in DOM at any time
- ResizeObserver automatically tracks active container

---

## Why This Pattern Avoids Previous Pitfalls

### Problem 1: Double Padding (RESOLVED)

**What Went Wrong Initially:**
- Work Content tab had wrapper div with `padding: sp.lg` inside Executive's containerRef
- Result: Double padding (24px + 24px = 48px)
- Symptom: Width measurement was off, wrong column count triggered

**Solution:**
- Remove wrapper div
- Use Fragment `<>` which creates no DOM element
- Attach ref directly to masonry container
- Result: Single 24px padding, correct width measurements

### Problem 2: Window-Based Breakpoints (RESOLVED)

**What Went Wrong Initially:**
- Used `useWindowSize` hook with window.innerWidth
- Problem: Window width includes left navigation panel
- Result: Breakpoints triggered at wrong thresholds

**Solution:**
- Use ResizeObserver on container element
- Measure `entry.contentRect.width` (actual available width)
- Result: Breakpoints trigger correctly based on content area

### Problem 3: Wrong Breakpoint Values (RESOLVED)

**What Went Wrong Initially:**
- Used breakpoints like 1600px and 2200px
- Problem: Didn't match Executive Summary's actual behavior

**Solution:**
- Match Executive Summary exactly: 992px and 2200px
- Test with actual measurements from DevTools
- Result: All tabs have consistent responsive behavior

---

## Implementation Checklist

### For Single-Level Tabs (Pattern A)

- [ ] Add React imports: `import React, { useState, useRef, useEffect } from 'react';`
- [ ] Add containerRef: `const containerRef = useRef(null);`
- [ ] Add containerWidth state: `const [containerWidth, setContainerWidth] = useState(0);`
- [ ] Add ResizeObserver useEffect hook with cleanup
- [ ] Add column count calculation: `const columnCount = containerWidth >= 2200 ? 3 : (containerWidth >= 992 ? 2 : 1);`
- [ ] Replace any wrapper divs with Fragment `<>`
- [ ] Add masonry container div with `ref={containerRef}` after Header
- [ ] Wrap EVERY Card/DataGrid with masonry item wrapper
- [ ] Close masonry container div before closing Fragment `</>`
- [ ] Verify no double padding in DevTools
- [ ] Test responsive behavior at all breakpoints

### For Multi-Level Tabs (Pattern B)

- [ ] Add React imports: `import React, { useState, useRef, useEffect } from 'react';`
- [ ] Add containerRef: `const containerRef = useRef(null);` (single, shared)
- [ ] Add containerWidth state: `const [containerWidth, setContainerWidth] = useState(0);`
- [ ] Add ResizeObserver useEffect hook with cleanup
- [ ] Add column count calculation
- [ ] For EACH sub-tab:
  - [ ] Replace Fragment `<>` with masonry container div with `ref={containerRef}`
  - [ ] Wrap EVERY Card/DataGrid with masonry item wrapper
  - [ ] Close masonry container div before closing conditional `)}`
- [ ] Verify no double padding in DevTools
- [ ] Test sub-tab switching (should be seamless, no flicker)
- [ ] Test responsive behavior in each sub-tab

---

## Testing & Verification

### Visual Layout Test

1. Navigate to the tab in the Contextual Side Panel
2. **Expected:** Cards display in 2 columns side-by-side at desktop widths
3. **Verify:** Layout matches other facility-level tabs exactly
4. **Verify:** Scrollbar reaches far edge of sidepanel

### Responsive Breakpoint Test

**Narrow width (< 992px container width):**
- **Expected:** Cards stack in 1 column

**Desktop width (992px - 2199px):**
- **Expected:** Cards display in 2 columns

**Ultrawide (≥ 2200px):**
- **Expected:** Cards display in 3 columns

### DevTools Inspection

1. Open Chrome DevTools
2. Inspect the tab content area
3. **Check padding:** Should only see one layer of 24px padding (from Executive.jsx)
4. **Check nesting:** Tab content should have same depth as other tabs
5. **Check width:** Masonry container width should match other tabs (~1037px at desktop)
6. **Check ref:** containerRef should be attached to masonry container div

### Comparison Test

Open multiple tabs and compare:
- All should have same padding (24px)
- All should have same nesting depth
- All should have same column behavior at each width
- All should have same breakpoint transitions

---

## Implementation Workflow & Best Practices

### Systematic Approach for Large Files

When implementing masonry layout on large tab content files (>1000 lines):

**Step-by-Step Process:**

1. **Add Imports First** - Update the React import to include `useState, useRef, useEffect`
2. **Add Container Tracking** - Insert the containerRef and ResizeObserver logic after all useState declarations
3. **Wrap Cards Systematically** - Don't try to wrap all cards at once:
   - Start with the first card after the Header
   - Replace Fragment `<>` or opening div with masonry container
   - Wrap first card with masonry item wrapper
   - Find where first card closes
   - Wrap second card
   - Continue sequentially through all cards
   - Close masonry container before closing conditional/Fragment
4. **Verify as You Go** - For large files, verify structure after wrapping 2-3 cards to catch issues early

**Finding Card Boundaries:**

Use grep to map out card locations before starting:

```bash
# For single-level tabs
grep -n "^\s*<Card\|^\s*</Card>" path/to/file.jsx | head -20

# For sub-tabs, narrow by line range
sed -n '165,531p' path/to/file.jsx | grep -n "^\s*<Card\|^\s*</Card>"
```

This helps you understand:

- How many cards need wrapping
- Where each card starts and ends
- Whether cards have special props (like `style={{ borderLeft: ... }}`)

### Working with DataGrid Components

DataGrid components are wrapped the same way as Cards:

```jsx
<div style={{
  breakInside: 'avoid',
  pageBreakInside: 'avoid',
  WebkitColumnBreakInside: 'avoid',
  marginBottom: sp.lg,
  display: 'inline-block',
  width: '100%'
}}>
  <DataGrid
    title="..."
    subtitle="..."
    columns={columns}
    data={data}
    {...otherProps}
  />
</div>
```

**Important:** DataGrids often appear at the end of tab content - don't forget to wrap them!

### Handling Mapped Cards

When cards are generated via `.map()`:

```jsx
{/* ===== MAPPED CONTENT ===== */}
{zoneCategories.map((cat, catIdx) => (
  <div key={`wrapper-${cat.id}`} style={{
    breakInside: 'avoid',
    pageBreakInside: 'avoid',
    WebkitColumnBreakInside: 'avoid',
    marginBottom: sp.lg,
    display: 'inline-block',
    width: '100%'
  }}>
    <Card key={cat.id}>
      {/* mapped content */}
    </Card>
  </div>
))}
```

**Key Points:**

- Wrapper div goes OUTSIDE the map function
- Use unique key on wrapper (`wrapper-${id}`) and Card (existing key)
- Same masonry item wrapper styles apply

### Indentation Consistency

Maintain clean indentation for readability:

```jsx
<>
  <Header {...props} />

  <div ref={containerRef} style={{ columnCount, columnGap: sp.lg }}>

    <div style={{ breakInside: 'avoid', ... }}>
      <Card>
        {/* card content */}
      </Card>
    </div>

    <div style={{ breakInside: 'avoid', ... }}>
      <Card>
        {/* card content */}
      </Card>
    </div>

  </div>
</>
```

**Pattern:**

- Masonry container: 2 spaces from Fragment edge
- Masonry item wrapper: 4 spaces (inside container)
- Card: 6 spaces (inside wrapper)
- Card content: 8 spaces (original indentation preserved)

### AI Assistant Workflow for Implementation

**When to Use Task Agents:**

For very large files (>2000 lines, especially ScheduleTabContent.jsx at ~2100 lines):

1. **Do the setup yourself**: Add imports and containerRef/ResizeObserver logic manually
2. **Start the first few cards yourself**: Wrap 1-2 cards to establish the pattern
3. **Delegate completion to Task agent**: When the file is too large to efficiently edit card-by-card

**Example Task Agent Prompt:**

```text
Complete the masonry layout implementation for [TabName] remaining sub-tabs.

File: /path/to/file.jsx

I've already:
1. Added React imports (line X)
2. Added containerRef and ResizeObserver (lines X-Y)
3. Started [SubTab1] (lines X-Y, opened masonry container and first card wrapper)

Now complete [SubTab1, SubTab2, SubTab3] by:
- Close first Card wrapper after the Card closes
- Wrap remaining N Cards with masonry item wrapper pattern
- Close masonry container before closing conditional

[Provide the masonry item wrapper pattern code]

Complete all remaining sub-tabs systematically.
```

**Why This Works:**

- Large files may exceed context limits for sequential edits
- Task agent can read and edit the full file efficiently
- You provide the pattern, agent applies it systematically
- Reduces risk of losing progress in large files

**When NOT to Use Task Agent:**

- Small files (<500 lines)
- Simple tabs with only 3-5 cards
- When you can easily complete the task with 5-10 edits

---

## Common Issues & Troubleshooting

### Issue: Cards Not Arranging in Columns

**Symptom:** Cards stack vertically even at wide widths

**Possible Causes:**
1. Missing `ref={containerRef}` on masonry container
2. Missing masonry item wrapper with `breakInside: 'avoid'`
3. ResizeObserver not connected or not firing
4. containerWidth state stuck at 0

**Solution:**
- Verify ref is attached to correct div
- Check browser console for errors
- Add temporary `console.log(containerWidth, columnCount)` to debug
- Verify ResizeObserver cleanup in useEffect

### Issue: Wrong Column Count at Breakpoints

**Symptom:** 3 columns appear too early, or 2 columns appear too late

**Possible Causes:**
1. Using window width instead of container width
2. Wrong breakpoint values (not 992px/2200px)
3. Double padding consuming available width

**Solution:**
- Verify ResizeObserver measures `entry.contentRect.width`
- Check breakpoint values exactly match: `containerWidth >= 2200 ? 3 : (containerWidth >= 992 ? 2 : 1)`
- Inspect padding in DevTools (should only be 24px)

### Issue: Cards Break Across Columns

**Symptom:** Individual cards split between columns

**Possible Causes:**
1. Missing `breakInside: 'avoid'` property
2. Missing vendor-specific properties (`pageBreakInside`, `WebkitColumnBreakInside`)
3. Missing `display: 'inline-block'` on wrapper

**Solution:**
- Verify all three break properties are present
- Add `display: 'inline-block'` to masonry item wrapper
- Ensure wrapper has `width: '100%'`

### Issue: Sub-Tab Switching Flickers

**Symptom:** Layout jumps when switching between sub-tabs

**Possible Causes:**
1. Multiple containerRefs (one per sub-tab instead of shared)
2. ResizeObserver not cleaning up properly
3. Different masonry container structure between sub-tabs

**Solution:**
- Use single shared `containerRef` at component level
- Verify ResizeObserver cleanup: `return () => resizeObserver.disconnect();`
- Ensure all sub-tabs use identical masonry container structure

---

## Performance Considerations

### ResizeObserver Efficiency

**Best Practices:**
- Single ResizeObserver per component (not per card)
- Proper cleanup in useEffect to prevent memory leaks
- Only observe the masonry container, not individual cards

**Memory Management:**
```javascript
useEffect(() => {
  if (!containerRef.current) return;

  const resizeObserver = new ResizeObserver((entries) => {
    for (let entry of entries) {
      setContainerWidth(entry.contentRect.width);
    }
  });

  resizeObserver.observe(containerRef.current);

  // CRITICAL: Cleanup when component unmounts
  return () => resizeObserver.disconnect();
}, []);
```

### Render Optimization

- State updates from ResizeObserver are throttled by browser
- No need for additional throttling/debouncing
- Column count calculation is simple arithmetic (no performance cost)

---

## Design System Integration

### Spacing Tokens

```javascript
import { sp } from '../../styles/designSystem';

sp.lg  // 24px - used for columnGap and marginBottom
```

### Color Tokens

```javascript
import { C } from '../../styles/designSystem';

// Header colors should match tab theme
C.brand[500]      // Work Content
C.purple[500]     // Staffing
C.blueLight[500]  // Zones, Inbound
C.neutral[500]    // Equipment, Maintenance
C.orange[500]     // Outbound
C.greenLight[500] // Schedule
```

---

## Future Considerations

### Additional Breakpoints

If ultrawide displays (> 3000px) become common, consider adding a 4-column breakpoint:

```javascript
const columnCount =
  containerWidth >= 3000 ? 4 :
  containerWidth >= 2200 ? 3 :
  containerWidth >= 992 ? 2 :
  1;
```

### Container Queries (Future)

When CSS Container Queries gain broader browser support, consider migrating from ResizeObserver to native CSS:

```css
@container (min-width: 992px) {
  .masonry-container {
    column-count: 2;
  }
}

@container (min-width: 2200px) {
  .masonry-container {
    column-count: 3;
  }
}
```

### Accessibility

Current implementation maintains accessibility:
- ✅ Card tab order remains logical (top to bottom, left to right)
- ✅ Screen readers navigate cards in DOM order
- ✅ Keyboard navigation works correctly
- ✅ No JavaScript required for basic layout (CSS columns)

---

## Related Documentation

- **Design System:** `/src/styles/designSystem.js`
- **Executive Container:** `/src/views/Executive.jsx` (lines 1131-1134)
- **UI Components:** `/src/components/UI/`
- **Implementation Plan:** `/.claude/plans/modular-watching-liskov.md`

---

## Implementation Timeline & Lessons Learned

### Session 1: Foundation (Work Content Tab)

**Challenge:** Initial attempts used window-based breakpoints and wrong values

**Iteration 1:** useWindowSize hook with 1600px/2200px breakpoints ❌

- Problem: Window width includes navigation panel
- Symptom: Columns triggered at wrong thresholds

**Iteration 2:** Wrapper div with padding inside Executive's container ❌

- Problem: Double padding (48px total) consumed width
- Symptom: Wrong column count, width measurements off

**Solution:** Container-based ResizeObserver with 992px/2200px breakpoints ✅

- Match Executive Summary's actual behavior
- Single padding layer (24px from Executive.jsx)
- Fragment `<>` to avoid extra DOM elements

### Session 2: Replication (Staff, Zones, Equipment)

**Success Factors:**

- Learned from Work Content's pitfalls
- Created reusable pattern documented in plan
- Applied systematically to 3 more tabs
- Each implementation took ~10-15 minutes

**Key Insight:** Having a proven pattern eliminates trial-and-error

### Session 3: Complex Implementation (Schedule Tab)

**Challenge:** 2100-line file with 4 sub-tabs, 17 total cards

**Strategy:**

- Manual setup: imports, containerRef, ResizeObserver
- Manual pattern establishment: First sub-tab, first 2 cards
- Task agent delegation: Remaining 3 sub-tabs
- Result: Completed efficiently without context overflow

**Key Insight:** Task agents excel at applying established patterns to large files

### Session 4: Documentation

**Created:** This comprehensive pattern document

**Purpose:** Enable future AI assistants and developers to implement correctly first time

**Includes:** Both patterns, troubleshooting, workflow, best practices

## Version History

**v1.0** - January 2026

- Initial pattern documentation
- Pattern A (Single-Level Tabs) implemented on 4 tabs
- Pattern B (Multi-Level Tabs) implemented on Schedule tab with 4 sub-tabs
- Breakpoints: 992px (2 col), 2200px (3 col)
- Container-based responsive design with ResizeObserver
- Total cards implemented: 29 cards across 5 tabs

**Tabs Completed:**

- ✅ Work Content (6 cards) - Pattern A
- ✅ Staffing (6 cards) - Pattern A
- ✅ Zones (7 cards) - Pattern A
- ✅ Asset Health/Equipment (6 cards) - Pattern A
- ✅ Schedule Overview - Pattern B
  - ✅ Staffing sub-tab (6 cards)
  - ✅ Inbound sub-tab (4 cards)
  - ✅ Outbound sub-tab (4 cards)
  - ✅ Maintenance sub-tab (4 cards)

**Remaining Facility-Level Tabs:**

- Financial Overview
- Plans & Projects
- Insights & Analysis

---

## Quick Reference

### Minimum Required Code

```jsx
// 1. Imports
import React, { useState, useRef, useEffect } from 'react';

// 2. Inside component
const containerRef = useRef(null);
const [containerWidth, setContainerWidth] = useState(0);

useEffect(() => {
  if (!containerRef.current) return;
  const resizeObserver = new ResizeObserver((entries) => {
    for (let entry of entries) {
      setContainerWidth(entry.contentRect.width);
    }
  });
  resizeObserver.observe(containerRef.current);
  return () => resizeObserver.disconnect();
}, []);

const columnCount = containerWidth >= 2200 ? 3 : (containerWidth >= 992 ? 2 : 1);

// 3. In return statement
return (
  <>
    <Header {...headerProps} />
    <div ref={containerRef} style={{ columnCount, columnGap: sp.lg }}>
      <div style={{
        breakInside: 'avoid',
        pageBreakInside: 'avoid',
        WebkitColumnBreakInside: 'avoid',
        marginBottom: sp.lg,
        display: 'inline-block',
        width: '100%'
      }}>
        <Card>{/* content */}</Card>
      </div>
      {/* More wrapped cards */}
    </div>
  </>
);
```

### Key Numbers to Remember

- **Breakpoint 1:** 992px → 2 columns
- **Breakpoint 2:** 2200px → 3 columns
- **Column gap:** 24px (sp.lg)
- **Card margin:** 24px (sp.lg)
- **Container padding:** 24px (from Executive.jsx)

---

**End of Document**

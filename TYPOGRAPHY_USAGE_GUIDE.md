# Typography System Usage Guide

## Overview
The BigBear.ai typography system has been implemented in `src/styles/designSystem.js` and is ready to use throughout the warehouse dashboard application.

## Quick Start

### Import
```javascript
import { typography, fontWeights } from '../styles/designSystem';
```

### Basic Usage
```jsx
// Displays (Hero text)
<h1 style={typography.display1()}>Welcome to ProModel.ai</h1>
<h1 style={typography.display6()}>Dashboard Overview</h1>

// Headings
<h1 style={typography.h1()}>Main Page Title</h1>
<h2 style={typography.h2()}>Section Header</h2>
<h3 style={typography.h3()}>Subsection Title</h3>
<h4 style={typography.h4()}>Component Title</h4>

// Body Text
<p style={typography.body()}>This is regular body text.</p>
<p style={typography.body({ medium: true })}>This is emphasized body text.</p>
<p style={typography.body({ italic: true })}>This is italicized text.</p>
<p style={typography.body({ medium: true, italic: true })}>Bold italic text.</p>

// Specialized
<label style={typography.label()}>Field Name:</label>
<span style={typography.caption()}>Last updated: 2 minutes ago</span>
<a style={typography.link()}>Learn more →</a>
```

## Complete Typography Scale

### Display Styles (Large hero text)
| Function | Size | Weight | Line Height | Use Case |
|----------|------|--------|-------------|----------|
| `display1()` | 80px / 5rem | Thin (100) | 1.0 | Hero sections, major titles |
| `display2()` | 72px / 4.5rem | Thin (100) | 1.111 | Primary hero text |
| `display3()` | 64px / 4rem | Thin (100) | 1.125 | Section heroes |
| `display4()` | 56px / 3.5rem | Thin (100) | 1.143 | Sub-heroes, callouts |
| `display5()` | 48px / 3rem | Thin (100) | 1.167 | Card titles, modals |
| `display6()` | 40px / 2.5rem | Thin (100) | 1.2 | Dashboard headers |

### Heading Styles
| Function | Size | Weight | Line Height | Use Case |
|----------|------|--------|-------------|----------|
| `h1Large()` | 32px / 2rem | Thin (100) | 1.0 | Main page titles |
| `h1()` | 28px / 1.75rem | Light (300) | 1.2 | Page titles, primary headings |
| `h2()` | 24px / 1.5rem | Light (300) | 1.3 | Section headers |
| `h3()` | 18px / 1.125rem | Regular (400) | 1.5 | Subsection titles |
| `h4()` | 16px / 1rem | Medium (500) | 1.5 | Component titles |

### Body Text Styles
| Function | Size | Options | Default | Use Case |
|----------|------|---------|---------|----------|
| `bodyLarge(options)` | 16px | `{ medium, italic }` | Regular (400) | Prominent paragraphs |
| `body(options)` | 14px | `{ medium, italic }` | Regular (400) | Primary content |
| `bodySmall(options)` | 12px | `{ medium, italic }` | Regular (400) | Secondary text, helpers |

### Specialized Styles
| Function | Size | Weight | Use Case |
|----------|------|--------|----------|
| `label()` | 14px | Medium (500) | Form labels, field names |
| `caption()` | 12px | Medium (500) | Timestamps, metadata |
| `link()` | 14px | Regular (400) | Hyperlinks, navigation |

## Font Weights Reference

Use the `fontWeights` constant for custom styling:

```javascript
import { fontWeights } from '../styles/designSystem';

const customStyle = {
  fontSize: '18px',
  fontWeight: fontWeights.medium, // 500
  lineHeight: 1.4
};
```

Available weights:
- `fontWeights.thin` → 100 (Roboto Thin)
- `fontWeights.light` → 300 (Roboto Light)
- `fontWeights.regular` → 400 (Roboto Regular)
- `fontWeights.medium` → 500 (Roboto Medium)
- `fontWeights.bold` → 700 (Roboto Bold)

## Advanced Usage Examples

### Combining with Design System Colors
```jsx
import { typography, C } from '../styles/designSystem';

// Error message
<p style={{ ...typography.bodySmall(), color: C.error[600] }}>
  This field is required
</p>

// Success caption
<span style={{ ...typography.caption(), color: C.success[700] }}>
  Changes saved successfully
</span>

// Link with brand color
<a style={{ ...typography.link(), color: C.brand[600] }}>
  View details
</a>
```

### Merging with Additional Styles
```jsx
// Add custom styles to typography
<h2 style={{
  ...typography.h2(),
  marginBottom: '16px',
  color: C.neutral[800],
  textTransform: 'uppercase',
  letterSpacing: '0.5px'
}}>
  Dashboard Metrics
</h2>

// Responsive override
<p style={{
  ...typography.body({ medium: true }),
  '@media (max-width: 768px)': {
    fontSize: '12px'
  }
}}>
  Responsive text
</p>
```

### Uppercase Labels Pattern
```jsx
// Common pattern for section labels
<h4 style={{
  ...typography.h4(),
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  color: C.neutral[500]
}}>
  Zone Information
</h4>
```

## Component Migration Examples

### Before (Inline styles)
```jsx
// Old approach - hardcoded values
<h2 style={{ fontSize: '20px', fontWeight: 400, margin: 0 }}>
  Page Title
</h2>

<p style={{ fontSize: '14px', color: C.neutral[800], lineHeight: 1.5 }}>
  Description text
</p>

<label style={{ fontSize: '12px', fontWeight: 500, color: C.neutral[600] }}>
  Field Label
</label>
```

### After (Typography system)
```jsx
// New approach - semantic functions
<h2 style={{ ...typography.h2(), margin: 0 }}>
  Page Title
</h2>

<p style={{ ...typography.body(), color: C.neutral[800] }}>
  Description text
</p>

<label style={{ ...typography.label(), color: C.neutral[600] }}>
  Field Label
</label>
```

## Body Text Options

### Regular vs Medium Weight
```jsx
// Regular (default) - 400 weight
<p style={typography.body()}>Standard paragraph text</p>

// Medium - 500 weight (emphasized)
<p style={typography.body({ medium: true })}>Important information</p>
```

### Regular vs Italic
```jsx
// Regular (default)
<p style={typography.body()}>Normal text</p>

// Italic
<p style={typography.body({ italic: true })}>Stylized text</p>
```

### Combining Options
```jsx
// Both medium weight AND italic
<p style={typography.body({ medium: true, italic: true })}>
  Emphasized, stylized text
</p>
```

## Best Practices

1. **Use semantic functions** - Use `h1()` instead of hardcoding font sizes
2. **Merge with spread operator** - `{...typography.body(), color: C.brand[600]}`
3. **Maintain hierarchy** - Use display → heading → body progression
4. **Consider context** - Use `bodySmall()` for metadata, not primary content
5. **Preserve consistency** - Stick to the scale, avoid custom font sizes
6. **Add color separately** - Typography functions don't include color (by design)
7. **Test font weights** - Ensure Roboto Thin (100) and Light (300) are loaded

## Typography + Color Patterns

Common combinations:
```jsx
// Primary text
{ ...typography.body(), color: C.neutral[900] }

// Secondary text
{ ...typography.bodySmall(), color: C.neutral[600] }

// Disabled text
{ ...typography.body(), color: C.neutral[400], opacity: 0.6 }

// Error text
{ ...typography.bodySmall(), color: C.error[700] }

// Success text
{ ...typography.caption(), color: C.success[600] }

// Link hover (add to link styles)
{ ...typography.link(), color: C.brand[700] }
```

## Migration Strategy

### Gradual Adoption (Recommended)
1. ✅ Typography system added to designSystem.js (DONE)
2. Start using in NEW components
3. Update 1-2 high-traffic components as examples
4. Gradually migrate other components over time
5. No breaking changes - existing inline styles continue working

### Finding Candidates for Migration
Look for patterns like:
- `fontSize: '14px', fontWeight: 500` → `typography.body({ medium: true })`
- `fontSize: '16px', fontWeight: 500` → `typography.h4()`
- `fontSize: '12px', fontWeight: 500` → `typography.caption()`
- `fontSize: '20px', fontWeight: 400` → Could be `typography.h2()` or custom

## Accessibility Notes

- All typography includes proper line-height for readability
- Font sizes meet WCAG minimum requirements (12px+)
- Ensure color contrast meets WCAG AA standards (4.5:1 for body, 3:1 for large text)
- Consider using `aria-label` for icon-only buttons with link styles
- Test with screen readers to ensure semantic HTML (h1-h6) works with typography styles

## Performance Considerations

- Functions are lightweight (return plain objects)
- No runtime overhead vs inline styles
- Tree-shaking compatible (named exports)
- No CSS-in-JS library required
- Consider memoization for frequently used style combinations

## TypeScript Support (Future)

If migrating to TypeScript:
```typescript
type TypographyOptions = {
  medium?: boolean;
  italic?: boolean;
};

type TypographyFunction = (options?: TypographyOptions) => React.CSSProperties;
```

## Questions or Issues?

- Check existing components for usage patterns
- Refer to BigBear.ai design specification
- Test new styles in Storybook or dedicated typography page
- Ensure Roboto font weights (100, 300, 400, 500, 700) are properly loaded

---

**Last Updated**: January 2026
**Design System Version**: 1.0
**Font Family**: Roboto (Google Fonts)

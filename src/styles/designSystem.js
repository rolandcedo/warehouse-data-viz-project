// ===== DESIGN SYSTEM =====
// BigBear.ai Design System for ProModel.ai Operational Dashboards

// Color palette
export const C = {
  brand: { 50: '#EFF6FF', 100: '#D5EDFF', 200: '#BFDBFE', 500: '#2F72FF', 600: '#0037FF', 700: '#1D4ED8' },
  neutral: { 50: '#F9FAFB', 100: '#F2F4F7', 200: '#EAECF0', 300: '#D0D5DD', 400: '#98A2B3', 500: '#667085', 600: '#475467', 700: '#344054', 800: '#1D2939', 900: '#101828' },
  success: { 50: '#ECFDF3', 100: '#D1FADF', 500: '#12B76A', 600: '#039855', 700: '#027A48' },
  warning: { 50: '#FFFCF5', 100: '#FEF0C7', 200: '#FEDF89', 300: '#FEC84B', 500: '#F79009', 600: '#DC6803', 700: '#B54708' },
  error: { 50: '#FEF3F2', 100: '#FEE4E2', 500: '#F04443', 600: '#D92D20', 700: '#B42318' },
  purple: { 50: '#F4F3FF', 100: '#EBE9FE', 200: '#DDD6FE', 300: '#D9D6FE', 400: '#A78BFA', 500: '#7A5AF8', 600: '#6938EF', 700: '#5925DC', 900: '#2E1065' },
  indigo: { 50: '#EEF2FF', 100: '#E0E7FF', 200: '#C7D2FE', 500: '#6366F1', 600: '#4F46E5', 700: '#4338CA' },
  blueLight: { 50: '#F0F9FF', 100: '#E0F2FE', 500: '#0BA5EC', 600: '#0284C7' },
  orange: { 50: '#FFF6ED', 100: '#FFEDD5', 500: '#FB6514', 600: '#EA580C' },
  greenLight: { 50: '#F3FEE7', 100: '#ECFCCB', 500: '#66C61C', 600: '#65A30D' },
  rose: { 50: '#FFF1F2', 100: '#FFE4E6', 500: '#F43F5E', 600: '#E11D48' },
  yellow: { 400: '#FBBF24' }
};

// Spacing system - Rule of 8
export const sp = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  xxl: '48px'
};

// Breakpoints for responsive design
export const breakpoints = {
  mobile: 768,
  tablet: 1024,
  desktop: 1440,
  widePanel: 1600,
  ultrawide: 2200
};

// Media query helpers
export const media = {
  mobile: `@media (max-width: ${breakpoints.mobile - 1}px)`,
  tablet: `@media (min-width: ${breakpoints.mobile}px) and (max-width: ${breakpoints.tablet - 1}px)`,
  desktop: `@media (min-width: ${breakpoints.desktop}px)`,
  ultrawide: `@media (min-width: ${breakpoints.ultrawide}px)`
};

// Font weights - Roboto family
export const fontWeights = {
  thin: 100,      // Roboto Thin
  light: 300,     // Roboto Light
  regular: 400,   // Roboto Regular
  medium: 500,    // Roboto Medium
  bold: 700       // Roboto Bold
};

// ===== TYPOGRAPHY SYSTEM =====
// BigBear.ai Typography Specification - Roboto Font Family
export const typography = {
  // ===== DISPLAY STYLES (Large hero text, major titles) =====

  /**
   * Display 1 - Largest display text (80px / 5rem)
   * Use for: Hero sections, major landing page titles
   * Weight: Thin (100), Line height: 1
   */
  display1: () => ({
    fontSize: '5rem', // 80px
    fontWeight: fontWeights.thin, // 100
    lineHeight: 1,
    fontFamily: 'Roboto, sans-serif'
  }),

  /**
   * Display 2 - Large display text (72px / 4.5rem)
   * Use for: Primary hero text, feature highlights
   * Weight: Thin (100), Line height: 1.111
   */
  display2: () => ({
    fontSize: '4.5rem', // 72px
    fontWeight: fontWeights.thin, // 100
    lineHeight: 1.111,
    fontFamily: 'Roboto, sans-serif'
  }),

  /**
   * Display 3 - Medium-large display (64px / 4rem)
   * Use for: Section heroes, key messaging
   * Weight: Thin (100), Line height: 1.125
   */
  display3: () => ({
    fontSize: '4rem', // 64px
    fontWeight: fontWeights.thin, // 100
    lineHeight: 1.125,
    fontFamily: 'Roboto, sans-serif'
  }),

  /**
   * Display 4 - Medium display (56px / 3.5rem)
   * Use for: Sub-heroes, important callouts
   * Weight: Thin (100), Line height: 1.143
   */
  display4: () => ({
    fontSize: '3.5rem', // 56px
    fontWeight: fontWeights.thin, // 100
    lineHeight: 1.143,
    fontFamily: 'Roboto, sans-serif'
  }),

  /**
   * Display 5 - Smaller display (48px / 3rem)
   * Use for: Card titles, modal headers
   * Weight: Thin (100), Line height: 1.167
   */
  display5: () => ({
    fontSize: '3rem', // 48px
    fontWeight: fontWeights.thin, // 100
    lineHeight: 1.167,
    fontFamily: 'Roboto, sans-serif'
  }),

  /**
   * Display 6 - Smallest display (40px / 2.5rem)
   * Use for: Dashboard headers, panel titles
   * Weight: Thin/Light (100), Line height: 1.2
   */
  display6: () => ({
    fontSize: '2.5rem', // 40px
    fontWeight: fontWeights.thin, // 100
    lineHeight: 1.2,
    fontFamily: 'Roboto, sans-serif'
  }),

  // ===== HEADING STYLES (Section titles, page headers) =====

  /**
   * Heading 1 Large - Largest heading (32px / 2rem)
   * Use for: Main page titles, top-level headers
   * Weight: Thin (100), Line height: 1
   */
  h1Large: () => ({
    fontSize: '2rem', // 32px
    fontWeight: fontWeights.thin, // 100
    lineHeight: 1,
    fontFamily: 'Roboto, sans-serif'
  }),

  /**
   * Heading 1 Default - Standard H1 (28px / 1.75rem)
   * Use for: Page titles, primary headings
   * Weight: Light (300), Line height: 1.2
   */
  h1: () => ({
    fontSize: '1.75rem', // 28px
    fontWeight: fontWeights.light, // 300
    lineHeight: 1.2,
    fontFamily: 'Roboto, sans-serif'
  }),

  /**
   * Heading 2 - Secondary heading (24px / 1.5rem)
   * Use for: Section headers, card titles
   * Weight: Light (300), Line height: 1.3
   */
  h2: () => ({
    fontSize: '1.5rem', // 24px
    fontWeight: fontWeights.light, // 300
    lineHeight: 1.3,
    fontFamily: 'Roboto, sans-serif'
  }),

  /**
   * Heading 3 - Tertiary heading (18px / 1.125rem)
   * Use for: Subsection titles, group labels
   * Weight: Regular (400), Line height: 1.5
   */
  h3: () => ({
    fontSize: '1.125rem', // 18px
    fontWeight: fontWeights.regular, // 400
    lineHeight: 1.5,
    fontFamily: 'Roboto, sans-serif'
  }),

  /**
   * Heading 4 - Small heading (16px / 1rem)
   * Use for: Component titles, list headers
   * Weight: Medium (500), Line height: 1.5
   */
  h4: () => ({
    fontSize: '1rem', // 16px
    fontWeight: fontWeights.medium, // 500
    lineHeight: 1.5,
    fontFamily: 'Roboto, sans-serif'
  }),

  // ===== BODY TEXT STYLES (Content, descriptions, UI text) =====

  /**
   * Body Large - Large body text (16px / 1rem)
   * Use for: Prominent paragraphs, feature descriptions
   * Options: { medium: boolean, italic: boolean }
   * Default: Regular (400), Non-italic
   */
  bodyLarge: (options = {}) => {
    const { medium = false, italic = false } = options;
    return {
      fontSize: '1rem', // 16px
      fontWeight: medium ? fontWeights.medium : fontWeights.regular, // 500 : 400
      lineHeight: 1.5,
      fontStyle: italic ? 'italic' : 'normal',
      fontFamily: 'Roboto, sans-serif'
    };
  },

  /**
   * Body Default - Standard body text (14px / 0.875rem)
   * Use for: Primary content, standard paragraphs
   * Options: { medium: boolean, italic: boolean }
   * Default: Regular (400), Non-italic
   */
  body: (options = {}) => {
    const { medium = false, italic = false } = options;
    return {
      fontSize: '0.875rem', // 14px
      fontWeight: medium ? fontWeights.medium : fontWeights.regular, // 500 : 400
      lineHeight: 1.5,
      fontStyle: italic ? 'italic' : 'normal',
      fontFamily: 'Roboto, sans-serif'
    };
  },

  /**
   * Body Small - Small body text (12px / 0.75rem)
   * Use for: Secondary text, helper text, descriptions
   * Options: { medium: boolean, italic: boolean }
   * Default: Regular (400), Non-italic
   */
  bodySmall: (options = {}) => {
    const { medium = false, italic = false } = options;
    return {
      fontSize: '0.75rem', // 12px
      fontWeight: medium ? fontWeights.medium : fontWeights.regular, // 500 : 400
      lineHeight: 1.5,
      fontStyle: italic ? 'italic' : 'normal',
      fontFamily: 'Roboto, sans-serif'
    };
  },

  // ===== SPECIALIZED TEXT STYLES =====

  /**
   * Label - Form labels, field names (14px / 0.875rem)
   * Use for: Input labels, field identifiers
   * Weight: Medium (500)
   */
  label: () => ({
    fontSize: '0.875rem', // 14px
    fontWeight: fontWeights.medium, // 500
    lineHeight: 1.5,
    fontFamily: 'Roboto, sans-serif'
  }),

  /**
   * Caption - Small metadata text (12px / 0.75rem)
   * Use for: Timestamps, helper text, metadata
   * Weight: Medium (500)
   */
  caption: () => ({
    fontSize: '0.75rem', // 12px
    fontWeight: fontWeights.medium, // 500
    lineHeight: 1.5,
    fontFamily: 'Roboto, sans-serif'
  }),

  /**
   * Link - Hyperlink text (14px / 0.875rem)
   * Use for: Clickable links, navigation items
   * Weight: Regular (400)
   */
  link: () => ({
    fontSize: '0.875rem', // 14px
    fontWeight: fontWeights.regular, // 400
    lineHeight: 1.5,
    fontFamily: 'Roboto, sans-serif',
    cursor: 'pointer',
    textDecoration: 'underline'
  })
};

// Usage examples:
// Display: <h1 style={typography.display1()}>Hero Title</h1>
// Heading: <h2 style={typography.h2()}>Section Title</h2>
// Body: <p style={typography.body()}>Regular paragraph</p>
// Body (emphasized): <p style={typography.body({ medium: true })}>Important text</p>
// Body (italic): <p style={typography.body({ italic: true })}>Italicized text</p>
// Body (both): <p style={typography.body({ medium: true, italic: true })}>Bold italic</p>
// Label: <label style={typography.label()}>Field Name</label>
// Caption: <span style={typography.caption()}>Last updated: 2 min ago</span>
// Link: <a style={typography.link()}>Learn more</a>

// ===== UTILITIES =====
// Health score color mapping
export const scoreColor = s => s >= 90 ? C.success[500] : s >= 75 ? C.warning[500] : C.error[500];

// Health score status mapping
export const scoreStatus = s => s >= 90 ? 'success' : s >= 75 ? 'warning' : 'error';

// Sparkline data generator
export const spark = (n=12, b=50, v=20) =>
  Array.from({length:n}, (_,i) => ({ v: b + Math.sin(i*0.5)*v*0.5 + (Math.random()-0.5)*v }));

// Global CSS styles
export const styles = `
  * { box-sizing: border-box; font-family: 'Roboto', -apple-system, BlinkMacSystemFont, sans-serif; }
  html {
    font-size: 100%; /* 1rem = 16px (browser default) */
    height: 100%;
    overflow: hidden;
  }
  body {
    margin: 0;
    font-family: 'Roboto', -apple-system, BlinkMacSystemFont, sans-serif;
    font-size: 0.875rem; /* 14px default body size */
    line-height: 1.5;
    background: ${C.neutral[900]};
    overflow: hidden;
    height: 100%;
  }
  button { font-family: inherit; }
  div, span, p, h1, h2, h3, h4, h5, h6, label { font-family: 'Roboto', -apple-system, BlinkMacSystemFont, sans-serif; }

  /* Responsive Typography Classes */
  .typo-display1 { font-size: 3rem; font-weight: 100; line-height: 1; font-family: 'Roboto', sans-serif; }
  @media (min-width: 768px) { .typo-display1 { font-size: 4rem; } }
  @media (min-width: 1440px) { .typo-display1 { font-size: 5rem; } }

  .typo-display2 { font-size: 2.75rem; font-weight: 100; line-height: 1.111; font-family: 'Roboto', sans-serif; }
  @media (min-width: 768px) { .typo-display2 { font-size: 3.5rem; } }
  @media (min-width: 1440px) { .typo-display2 { font-size: 4.5rem; } }

  .typo-display3 { font-size: 2.5rem; font-weight: 100; line-height: 1.125; font-family: 'Roboto', sans-serif; }
  @media (min-width: 768px) { .typo-display3 { font-size: 3rem; } }
  @media (min-width: 1440px) { .typo-display3 { font-size: 4rem; } }

  .typo-display4 { font-size: 2.25rem; font-weight: 100; line-height: 1.143; font-family: 'Roboto', sans-serif; }
  @media (min-width: 768px) { .typo-display4 { font-size: 2.75rem; } }
  @media (min-width: 1440px) { .typo-display4 { font-size: 3.5rem; } }

  .typo-display5 { font-size: 2rem; font-weight: 100; line-height: 1.167; font-family: 'Roboto', sans-serif; }
  @media (min-width: 768px) { .typo-display5 { font-size: 2.5rem; } }
  @media (min-width: 1440px) { .typo-display5 { font-size: 3rem; } }

  .typo-display6 { font-size: 1.75rem; font-weight: 100; line-height: 1.2; font-family: 'Roboto', sans-serif; }
  @media (min-width: 768px) { .typo-display6 { font-size: 2rem; } }
  @media (min-width: 1440px) { .typo-display6 { font-size: 2.5rem; } }

  .typo-h1-large { font-size: 1.5rem; font-weight: 100; line-height: 1; font-family: 'Roboto', sans-serif; }
  @media (min-width: 768px) { .typo-h1-large { font-size: 1.75rem; } }
  @media (min-width: 1440px) { .typo-h1-large { font-size: 2rem; } }

  .typo-h1 { font-size: 1.375rem; font-weight: 300; line-height: 1.2; font-family: 'Roboto', sans-serif; }
  @media (min-width: 768px) { .typo-h1 { font-size: 1.5rem; } }
  @media (min-width: 1440px) { .typo-h1 { font-size: 1.75rem; } }

  .typo-h2 { font-size: 1.25rem; font-weight: 300; line-height: 1.3; font-family: 'Roboto', sans-serif; }
  @media (min-width: 768px) { .typo-h2 { font-size: 1.375rem; } }
  @media (min-width: 1440px) { .typo-h2 { font-size: 1.5rem; } }

  .typo-h3 { font-size: 1rem; font-weight: 400; line-height: 1.4; font-family: 'Roboto', sans-serif; }
  @media (min-width: 768px) { .typo-h3 { font-size: 1.0625rem; } }
  @media (min-width: 1440px) { .typo-h3 { font-size: 1.125rem; } }

  .typo-h4 { font-size: 0.9375rem; font-weight: 500; line-height: 1.5; font-family: 'Roboto', sans-serif; }
  @media (min-width: 768px) { .typo-h4 { font-size: 1rem; } }

  .typo-body-large { font-size: 0.9375rem; font-weight: 400; line-height: 1.5; font-family: 'Roboto', sans-serif; }
  @media (min-width: 768px) { .typo-body-large { font-size: 1rem; } }

  .typo-body { font-size: 0.875rem; font-weight: 400; line-height: 1.5; font-family: 'Roboto', sans-serif; }
  .typo-body-small { font-size: 0.75rem; font-weight: 400; line-height: 1.5; font-family: 'Roboto', sans-serif; }

  .typo-label { font-size: 0.8125rem; font-weight: 500; line-height: 1.5; font-family: 'Roboto', sans-serif; }
  @media (min-width: 768px) { .typo-label { font-size: 0.875rem; } }

  .typo-caption { font-size: 0.6875rem; font-weight: 500; line-height: 1.5; font-family: 'Roboto', sans-serif; }
  @media (min-width: 768px) { .typo-caption { font-size: 0.75rem; } }

  .typo-link { font-size: 0.875rem; font-weight: 400; line-height: 1.5; font-family: 'Roboto', sans-serif; cursor: pointer; text-decoration: underline; }

  .typo-medium { font-weight: 500; }
  .typo-italic { font-style: italic; }

  .card {
    padding: ${sp.md};
    border: 1px solid ${C.neutral[300]};
    border-radius: 8px;
    margin-bottom: ${sp.md};
    transition: all 0.15s ease;
  }

  .card-click {
    cursor: pointer;
  }

  .card-click:hover {
    border-color: ${C.brand[500]};
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  }
`;

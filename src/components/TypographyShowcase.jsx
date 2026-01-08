import React from 'react';
import { typography, fontWeights, C, sp } from '../styles/designSystem';

/**
 * Typography Showcase Component
 * Demonstrates all typography styles from the BigBear.ai design system
 * Use this as a reference or style guide page
 */
const TypographyShowcase = () => {
  return (
    <div style={{ padding: sp.xl, maxWidth: '1200px', margin: '0 auto', background: C.neutral[50] }}>
      {/* Header */}
      <div style={{ marginBottom: sp.xl, padding: sp.lg, background: 'white', borderRadius: '8px' }}>
        <h1 style={{ ...typography.h1(), margin: 0, marginBottom: sp.sm }}>
          Typography System
        </h1>
        <p style={{ ...typography.body(), color: C.neutral[600], margin: 0 }}>
          BigBear.ai Design System - Roboto Font Family
        </p>
      </div>

      {/* Display Styles */}
      <section style={{ marginBottom: sp.xl }}>
        <h2 style={{ ...typography.h2(), marginBottom: sp.lg }}>Display Styles</h2>

        <div style={{ background: 'white', padding: sp.lg, borderRadius: '8px', marginBottom: sp.md }}>
          <div style={{ marginBottom: sp.lg, borderBottom: `1px solid ${C.neutral[200]}`, paddingBottom: sp.md }}>
            <span style={{ ...typography.caption(), color: C.neutral[500], textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Display 1 - 80px / Thin (100)
            </span>
            <h1 style={{ ...typography.display1(), margin: 0, marginTop: sp.xs }}>
              ProModel.ai
            </h1>
          </div>

          <div style={{ marginBottom: sp.lg, borderBottom: `1px solid ${C.neutral[200]}`, paddingBottom: sp.md }}>
            <span style={{ ...typography.caption(), color: C.neutral[500], textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Display 2 - 72px / Thin (100)
            </span>
            <h1 style={{ ...typography.display2(), margin: 0, marginTop: sp.xs }}>
              Warehouse Operations
            </h1>
          </div>

          <div style={{ marginBottom: sp.lg, borderBottom: `1px solid ${C.neutral[200]}`, paddingBottom: sp.md }}>
            <span style={{ ...typography.caption(), color: C.neutral[500], textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Display 3 - 64px / Thin (100)
            </span>
            <h1 style={{ ...typography.display3(), margin: 0, marginTop: sp.xs }}>
              Dashboard Metrics
            </h1>
          </div>

          <div style={{ marginBottom: sp.lg, borderBottom: `1px solid ${C.neutral[200]}`, paddingBottom: sp.md }}>
            <span style={{ ...typography.caption(), color: C.neutral[500], textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Display 4 - 56px / Thin (100)
            </span>
            <h1 style={{ ...typography.display4(), margin: 0, marginTop: sp.xs }}>
              Real-Time Analytics
            </h1>
          </div>

          <div style={{ marginBottom: sp.lg, borderBottom: `1px solid ${C.neutral[200]}`, paddingBottom: sp.md }}>
            <span style={{ ...typography.caption(), color: C.neutral[500], textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Display 5 - 48px / Thin (100)
            </span>
            <h1 style={{ ...typography.display5(), margin: 0, marginTop: sp.xs }}>
              Performance Overview
            </h1>
          </div>

          <div style={{ marginBottom: 0 }}>
            <span style={{ ...typography.caption(), color: C.neutral[500], textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Display 6 - 40px / Thin (100)
            </span>
            <h1 style={{ ...typography.display6(), margin: 0, marginTop: sp.xs }}>
              Zone Management
            </h1>
          </div>
        </div>
      </section>

      {/* Heading Styles */}
      <section style={{ marginBottom: sp.xl }}>
        <h2 style={{ ...typography.h2(), marginBottom: sp.lg }}>Heading Styles</h2>

        <div style={{ background: 'white', padding: sp.lg, borderRadius: '8px', marginBottom: sp.md }}>
          <div style={{ marginBottom: sp.md }}>
            <span style={{ ...typography.caption(), color: C.neutral[500] }}>H1 Large - 32px / Thin (100)</span>
            <h1 style={{ ...typography.h1Large(), margin: 0, marginTop: sp.xs }}>
              Main Page Title
            </h1>
          </div>

          <div style={{ marginBottom: sp.md }}>
            <span style={{ ...typography.caption(), color: C.neutral[500] }}>H1 Default - 28px / Light (300)</span>
            <h1 style={{ ...typography.h1(), margin: 0, marginTop: sp.xs }}>
              Primary Heading
            </h1>
          </div>

          <div style={{ marginBottom: sp.md }}>
            <span style={{ ...typography.caption(), color: C.neutral[500] }}>H2 - 24px / Light (300)</span>
            <h2 style={{ ...typography.h2(), margin: 0, marginTop: sp.xs }}>
              Section Header
            </h2>
          </div>

          <div style={{ marginBottom: sp.md }}>
            <span style={{ ...typography.caption(), color: C.neutral[500] }}>H3 - 18px / Regular (400)</span>
            <h3 style={{ ...typography.h3(), margin: 0, marginTop: sp.xs }}>
              Subsection Title
            </h3>
          </div>

          <div style={{ marginBottom: 0 }}>
            <span style={{ ...typography.caption(), color: C.neutral[500] }}>H4 - 16px / Medium (500)</span>
            <h4 style={{ ...typography.h4(), margin: 0, marginTop: sp.xs }}>
              Component Title
            </h4>
          </div>
        </div>
      </section>

      {/* Body Text Styles */}
      <section style={{ marginBottom: sp.xl }}>
        <h2 style={{ ...typography.h2(), marginBottom: sp.lg }}>Body Text Styles</h2>

        <div style={{ background: 'white', padding: sp.lg, borderRadius: '8px', marginBottom: sp.md }}>
          <div style={{ marginBottom: sp.lg }}>
            <span style={{ ...typography.caption(), color: C.neutral[500] }}>Body Large (16px)</span>
            <p style={{ ...typography.bodyLarge(), margin: 0, marginTop: sp.xs }}>
              Regular: This is large body text with regular weight (400).
            </p>
            <p style={{ ...typography.bodyLarge({ medium: true }), margin: 0, marginTop: sp.xs }}>
              Medium: This is large body text with medium weight (500).
            </p>
            <p style={{ ...typography.bodyLarge({ italic: true }), margin: 0, marginTop: sp.xs }}>
              Italic: This is large body text in italic style.
            </p>
            <p style={{ ...typography.bodyLarge({ medium: true, italic: true }), margin: 0, marginTop: sp.xs }}>
              Medium + Italic: Combined weight and style.
            </p>
          </div>

          <div style={{ marginBottom: sp.lg }}>
            <span style={{ ...typography.caption(), color: C.neutral[500] }}>Body Default (14px)</span>
            <p style={{ ...typography.body(), margin: 0, marginTop: sp.xs }}>
              Regular: This is standard body text with regular weight (400). Most common for paragraphs and content.
            </p>
            <p style={{ ...typography.body({ medium: true }), margin: 0, marginTop: sp.xs }}>
              Medium: This is standard body text with medium weight (500) for emphasis.
            </p>
            <p style={{ ...typography.body({ italic: true }), margin: 0, marginTop: sp.xs }}>
              Italic: This is standard body text in italic style for stylistic variation.
            </p>
            <p style={{ ...typography.body({ medium: true, italic: true }), margin: 0, marginTop: sp.xs }}>
              Medium + Italic: Both weight and style combined for strong emphasis.
            </p>
          </div>

          <div style={{ marginBottom: 0 }}>
            <span style={{ ...typography.caption(), color: C.neutral[500] }}>Body Small (12px)</span>
            <p style={{ ...typography.bodySmall(), margin: 0, marginTop: sp.xs }}>
              Regular: This is small body text with regular weight (400). Used for helper text and secondary content.
            </p>
            <p style={{ ...typography.bodySmall({ medium: true }), margin: 0, marginTop: sp.xs }}>
              Medium: This is small body text with medium weight (500).
            </p>
            <p style={{ ...typography.bodySmall({ italic: true }), margin: 0, marginTop: sp.xs }}>
              Italic: This is small body text in italic style.
            </p>
            <p style={{ ...typography.bodySmall({ medium: true, italic: true }), margin: 0, marginTop: sp.xs }}>
              Medium + Italic: Combined for small emphasized text.
            </p>
          </div>
        </div>
      </section>

      {/* Specialized Styles */}
      <section style={{ marginBottom: sp.xl }}>
        <h2 style={{ ...typography.h2(), marginBottom: sp.lg }}>Specialized Text Styles</h2>

        <div style={{ background: 'white', padding: sp.lg, borderRadius: '8px', marginBottom: sp.md }}>
          <div style={{ marginBottom: sp.md }}>
            <span style={{ ...typography.caption(), color: C.neutral[500], display: 'block', marginBottom: sp.xs }}>
              Label (14px / Medium)
            </span>
            <label style={typography.label()}>
              Field Name or Form Label
            </label>
          </div>

          <div style={{ marginBottom: sp.md }}>
            <span style={{ ...typography.caption(), color: C.neutral[500], display: 'block', marginBottom: sp.xs }}>
              Caption (12px / Medium)
            </span>
            <span style={typography.caption()}>
              Last updated: 2 minutes ago • Metadata • Helper text
            </span>
          </div>

          <div style={{ marginBottom: 0 }}>
            <span style={{ ...typography.caption(), color: C.neutral[500], display: 'block', marginBottom: sp.xs }}>
              Link (14px / Regular)
            </span>
            <a href="#" style={typography.link()}>
              Learn more about typography →
            </a>
          </div>
        </div>
      </section>

      {/* Font Weights Reference */}
      <section style={{ marginBottom: sp.xl }}>
        <h2 style={{ ...typography.h2(), marginBottom: sp.lg }}>Font Weights Reference</h2>

        <div style={{ background: 'white', padding: sp.lg, borderRadius: '8px' }}>
          <div style={{ display: 'grid', gap: sp.md }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: sp.sm, borderBottom: `1px solid ${C.neutral[100]}` }}>
              <span style={{ fontSize: '24px', fontWeight: fontWeights.thin, fontFamily: 'Roboto, sans-serif' }}>
                Roboto Thin
              </span>
              <span style={{ ...typography.caption(), color: C.neutral[500] }}>fontWeights.thin = 100</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: sp.sm, borderBottom: `1px solid ${C.neutral[100]}` }}>
              <span style={{ fontSize: '24px', fontWeight: fontWeights.light, fontFamily: 'Roboto, sans-serif' }}>
                Roboto Light
              </span>
              <span style={{ ...typography.caption(), color: C.neutral[500] }}>fontWeights.light = 300</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: sp.sm, borderBottom: `1px solid ${C.neutral[100]}` }}>
              <span style={{ fontSize: '24px', fontWeight: fontWeights.regular, fontFamily: 'Roboto, sans-serif' }}>
                Roboto Regular
              </span>
              <span style={{ ...typography.caption(), color: C.neutral[500] }}>fontWeights.regular = 400</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: sp.sm, borderBottom: `1px solid ${C.neutral[100]}` }}>
              <span style={{ fontSize: '24px', fontWeight: fontWeights.medium, fontFamily: 'Roboto, sans-serif' }}>
                Roboto Medium
              </span>
              <span style={{ ...typography.caption(), color: C.neutral[500] }}>fontWeights.medium = 500</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '24px', fontWeight: fontWeights.bold, fontFamily: 'Roboto, sans-serif' }}>
                Roboto Bold
              </span>
              <span style={{ ...typography.caption(), color: C.neutral[500] }}>fontWeights.bold = 700</span>
            </div>
          </div>
        </div>
      </section>

      {/* Usage Example */}
      <section>
        <h2 style={{ ...typography.h2(), marginBottom: sp.lg }}>Code Usage Examples</h2>

        <div style={{ background: C.neutral[900], padding: sp.lg, borderRadius: '8px', color: C.neutral[100], fontFamily: 'monospace', fontSize: '13px', lineHeight: 1.6 }}>
          <div style={{ marginBottom: sp.md }}>
            <div style={{ color: C.success[400] }}>// Import</div>
            <div>import &#123; typography, fontWeights &#125; from '../styles/designSystem';</div>
          </div>

          <div style={{ marginBottom: sp.md }}>
            <div style={{ color: C.success[400] }}>// Display</div>
            <div>&lt;h1 style=&#123;typography.display1()&#125;&gt;Hero Title&lt;/h1&gt;</div>
          </div>

          <div style={{ marginBottom: sp.md }}>
            <div style={{ color: C.success[400] }}>// Heading</div>
            <div>&lt;h2 style=&#123;typography.h2()&#125;&gt;Section Title&lt;/h2&gt;</div>
          </div>

          <div style={{ marginBottom: sp.md }}>
            <div style={{ color: C.success[400] }}>// Body with options</div>
            <div>&lt;p style=&#123;typography.body(&#123; medium: true &#125;)&#125;&gt;Text&lt;/p&gt;</div>
          </div>

          <div style={{ marginBottom: sp.md }}>
            <div style={{ color: C.success[400] }}>// Merge with custom styles</div>
            <div>&lt;span style=&#123;&#123; ...typography.caption(), color: C.error[600] &#125;&#125;&gt;</div>
            <div style={{ paddingLeft: sp.md }}>Error message</div>
            <div>&lt;/span&gt;</div>
          </div>

          <div>
            <div style={{ color: C.success[400] }}>// Custom weight</div>
            <div>const style = &#123; fontWeight: fontWeights.medium &#125;;</div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TypographyShowcase;

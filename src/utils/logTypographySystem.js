export const logTypographySystem = () => {
  console.group('%c📐 Typography System - REM with Responsive Scaling', 'font-size: 16px; font-weight: bold; color: #2F72FF;');

  console.log('%c🎯 Base Configuration:', 'font-weight: bold; color: #12B76A;');
  console.log('  html { font-size: 100%; }  /* 1rem = 16px */');
  console.log('  body { font-size: 0.875rem; }  /* 14px default */');
  console.log('');

  console.log('%c📱 Breakpoints:', 'font-weight: bold; color: #12B76A;');
  console.log('  Mobile:  < 768px');
  console.log('  Tablet:  768px - 1439px');
  console.log('  Desktop: ≥ 1440px');
  console.log('');

  console.log('%c🔤 Typography Scale:', 'font-weight: bold; color: #12B76A;');

  const styles = [
    { name: 'display1', mobile: '3rem (48px)', tablet: '4rem (64px)', desktop: '5rem (80px)', weight: 100 },
    { name: 'display2', mobile: '2.75rem (44px)', tablet: '3.5rem (56px)', desktop: '4.5rem (72px)', weight: 100 },
    { name: 'display3', mobile: '2.5rem (40px)', tablet: '3rem (48px)', desktop: '4rem (64px)', weight: 100 },
    { name: 'display4', mobile: '2.25rem (36px)', tablet: '2.75rem (44px)', desktop: '3.5rem (56px)', weight: 100 },
    { name: 'display5', mobile: '2rem (32px)', tablet: '2.5rem (40px)', desktop: '3rem (48px)', weight: 100 },
    { name: 'display6', mobile: '1.75rem (28px)', tablet: '2rem (32px)', desktop: '2.5rem (40px)', weight: 100 },
    { name: 'h1Large', mobile: '1.5rem (24px)', tablet: '1.75rem (28px)', desktop: '2rem (32px)', weight: 100 },
    { name: 'h1', mobile: '1.375rem (22px)', tablet: '1.5rem (24px)', desktop: '1.75rem (28px)', weight: 300 },
    { name: 'h2', mobile: '1.25rem (20px)', tablet: '1.375rem (22px)', desktop: '1.5rem (24px)', weight: 300 },
    { name: 'h3', mobile: '1rem (16px)', tablet: '1.0625rem (17px)', desktop: '1.125rem (18px)', weight: 400 },
    { name: 'h4', mobile: '0.9375rem (15px)', tablet: '1rem (16px)', desktop: '1rem (16px)', weight: 500 },
    { name: 'bodyLarge', mobile: '0.9375rem (15px)', tablet: '1rem (16px)', desktop: '1rem (16px)', weight: 400 },
    { name: 'body', mobile: '0.875rem (14px)', tablet: '0.875rem (14px)', desktop: '0.875rem (14px)', weight: 400 },
    { name: 'bodySmall', mobile: '0.75rem (12px)', tablet: '0.75rem (12px)', desktop: '0.75rem (12px)', weight: 400 },
    { name: 'label', mobile: '0.8125rem (13px)', tablet: '0.875rem (14px)', desktop: '0.875rem (14px)', weight: 500 },
    { name: 'caption', mobile: '0.6875rem (11px)', tablet: '0.75rem (12px)', desktop: '0.75rem (12px)', weight: 500 },
    { name: 'link', mobile: '0.875rem (14px)', tablet: '0.875rem (14px)', desktop: '0.875rem (14px)', weight: 400 }
  ];

  console.table(styles);

  console.log('');
  console.log('%c💡 Usage Examples:', 'font-weight: bold; color: #12B76A;');
  console.log('  // Inline styles (non-responsive):');
  console.log('  <h1 style={{ ...typography.h1(), color: C.neutral[900] }}>Title</h1>');
  console.log('');
  console.log('  // CSS classes (responsive):');
  console.log('  <h1 className="typo-h1" style={{ color: C.neutral[900] }}>Title</h1>');
  console.log('');
  console.log('  // With modifiers:');
  console.log('  <p className="typo-body typo-medium">Medium weight body text</p>');
  console.log('');

  console.log('%c✅ Migration Status:', 'font-weight: bold; color: #12B76A;');
  console.log('  ✓ Design system converted to REM');
  console.log('  ✓ Responsive breakpoints added');
  console.log('  ✓ Global base font-size set to 100%');
  console.log('  ✓ Body font-size set to 0.875rem (14px)');
  console.log('');

  console.groupEnd();
};

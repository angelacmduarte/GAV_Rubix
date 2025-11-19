/**
 * Accessibility utilities
 * WCAG AA compliance helpers
 */

/**
 * Check if color contrast meets WCAG AA standards
 * @param {string} foreground - Foreground color (hex)
 * @param {string} background - Background color (hex)
 * @returns {boolean} - True if contrast ratio >= 4.5:1
 */
export const checkContrast = (foreground, background) => {
  // Simplified contrast check
  // In production, use a proper contrast calculation library
  const fg = hexToRgb(foreground);
  const bg = hexToRgb(background);
  
  if (!fg || !bg) return false;
  
  const luminance1 = getLuminance(fg);
  const luminance2 = getLuminance(bg);
  
  const ratio = (Math.max(luminance1, luminance2) + 0.05) / 
                (Math.min(luminance1, luminance2) + 0.05);
  
  return ratio >= 4.5; // WCAG AA standard
};

const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
};

const getLuminance = (rgb) => {
  const [r, g, b] = [rgb.r, rgb.g, rgb.b].map(val => {
    val = val / 255;
    return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

/**
 * Validate accessibility of color combinations used in the app
 */
export const validateColorAccessibility = () => {
  const colorPairs = [
    { fg: '#000066', bg: '#FFFFFF' }, // Primary text on white
    { fg: '#010B0C', bg: '#F4F4F4' }, // Text on light gray
    { fg: '#3038D5', bg: '#FFFFFF' }, // Button text on white
    { fg: '#FFFFFF', bg: '#000066' }, // White text on primary
  ];

  const results = colorPairs.map(pair => ({
    ...pair,
    accessible: checkContrast(pair.fg, pair.bg)
  }));

  const allAccessible = results.every(r => r.accessible);
  
  if (!allAccessible) {
    console.warn('Some color combinations may not meet WCAG AA standards:', results);
  }

  return allAccessible;
};


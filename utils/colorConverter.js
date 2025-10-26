// Color Converter Utility
// Functions for color space conversions and color naming

/**
 * Convert RGB to HSV color space
 * @param {number} r - Red (0-255)
 * @param {number} g - Green (0-255)
 * @param {number} b - Blue (0-255)
 * @returns {Object} HSV object with h (0-360), s (0-1), v (0-1)
 */
export const rgbToHsv = (r, g, b) => {
  r /= 255;
  g /= 255;
  b /= 255;
  
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;
  
  let h = 0;
  let s = max === 0 ? 0 : delta / max;
  let v = max;
  
  if (delta !== 0) {
    if (max === r) {
      h = ((g - b) / delta + (g < b ? 6 : 0)) / 6;
    } else if (max === g) {
      h = ((b - r) / delta + 2) / 6;
    } else {
      h = ((r - g) / delta + 4) / 6;
    }
  }
  
  return { h: h * 360, s: s, v: v };
};

/**
 * Convert HSV to RGB color space
 * @param {number} h - Hue (0-360)
 * @param {number} s - Saturation (0-1)
 * @param {number} v - Value (0-1)
 * @returns {Object} RGB object with r, g, b (0-255)
 */
export const hsvToRgb = (h, s, v) => {
  h = h / 360;
  
  const i = Math.floor(h * 6);
  const f = h * 6 - i;
  const p = v * (1 - s);
  const q = v * (1 - f * s);
  const t = v * (1 - (1 - f) * s);
  
  let r, g, b;
  
  switch (i % 6) {
    case 0: r = v; g = t; b = p; break;
    case 1: r = q; g = v; b = p; break;
    case 2: r = p; g = v; b = t; break;
    case 3: r = p; g = q; b = v; break;
    case 4: r = t; g = p; b = v; break;
    case 5: r = v; g = p; b = q; break;
  }
  
  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  };
};

/**
 * Convert RGB to Hex color code
 * @param {number} r - Red (0-255)
 * @param {number} g - Green (0-255)
 * @param {number} b - Blue (0-255)
 * @returns {string} Hex color code (e.g., '#ff0000')
 */
export const rgbToHex = (r, g, b) => {
  return '#' + [r, g, b].map(x => {
    const hex = Math.round(x).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
};

/**
 * Convert Hex to RGB
 * @param {string} hex - Hex color code (e.g., '#ff0000')
 * @returns {Object} RGB object with r, g, b (0-255)
 */
export const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
};

/**
 * Get approximate color name based on HSV values
 * @param {Object} rgb - RGB color object
 * @returns {string} Color name
 */
export const getColorName = (rgb) => {
  const hsv = rgbToHsv(rgb.r, rgb.g, rgb.b);
  
  // Handle grayscale colors
  if (hsv.s < 0.1) {
    if (hsv.v > 0.9) return 'White';
    if (hsv.v > 0.7) return 'Light Gray';
    if (hsv.v > 0.3) return 'Gray';
    if (hsv.v > 0.15) return 'Dark Gray';
    return 'Black';
  }
  
  // Determine color family based on hue
  const hue = hsv.h;
  const brightness = hsv.v;
  
  if (hue < 15 || hue >= 345) {
    return brightness > 0.5 ? 'Red' : 'Dark Red';
  } else if (hue < 45) {
    return brightness > 0.6 ? 'Orange' : 'Brown';
  } else if (hue < 75) {
    return brightness > 0.5 ? 'Yellow' : 'Olive';
  } else if (hue < 155) {
    return brightness > 0.5 ? 'Green' : 'Dark Green';
  } else if (hue < 185) {
    return brightness > 0.5 ? 'Cyan' : 'Teal';
  } else if (hue < 255) {
    return brightness > 0.5 ? 'Blue' : 'Navy';
  } else if (hue < 285) {
    return brightness > 0.5 ? 'Purple' : 'Violet';
  } else {
    return brightness > 0.5 ? 'Magenta' : 'Maroon';
  }
};

/**
 * Calculate color brightness (0-1)
 * @param {Object} rgb - RGB color object
 * @returns {number} Brightness value
 */
export const getColorBrightness = (rgb) => {
  return (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000 / 255;
};

/**
 * Determine if a color is light or dark
 * @param {Object} rgb - RGB color object
 * @returns {boolean} True if light, false if dark
 */
export const isLightColor = (rgb) => {
  return getColorBrightness(rgb) > 0.5;
};

/**
 * Get contrasting text color (black or white) for a background color
 * @param {Object} rgb - RGB background color
 * @returns {string} '#000000' or '#ffffff'
 */
export const getContrastingTextColor = (rgb) => {
  return isLightColor(rgb) ? '#000000' : '#ffffff';
};

/**
 * Calculate color distance between two RGB colors
 * @param {Object} rgb1 - First RGB color
 * @param {Object} rgb2 - Second RGB color
 * @returns {number} Distance value
 */
export const colorDistance = (rgb1, rgb2) => {
  return Math.sqrt(
    Math.pow(rgb1.r - rgb2.r, 2) +
    Math.pow(rgb1.g - rgb2.g, 2) +
    Math.pow(rgb1.b - rgb2.b, 2)
  );
};

/**
 * Lighten a color by a percentage
 * @param {Object} rgb - RGB color
 * @param {number} percent - Percentage to lighten (0-1)
 * @returns {Object} Lightened RGB color
 */
export const lightenColor = (rgb, percent) => {
  const hsv = rgbToHsv(rgb.r, rgb.g, rgb.b);
  hsv.v = Math.min(hsv.v + percent, 1);
  return hsvToRgb(hsv.h, hsv.s, hsv.v);
};

/**
 * Darken a color by a percentage
 * @param {Object} rgb - RGB color
 * @param {number} percent - Percentage to darken (0-1)
 * @returns {Object} Darkened RGB color
 */
export const darkenColor = (rgb, percent) => {
  const hsv = rgbToHsv(rgb.r, rgb.g, rgb.b);
  hsv.v = Math.max(hsv.v - percent, 0);
  return hsvToRgb(hsv.h, hsv.s, hsv.v);
};

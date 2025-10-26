// Color Matcher Utility
// Generates matching color palettes based on color theory

import { rgbToHsv, hsvToRgb, getColorName } from './colorConverter';

/**
 * Generate matching colors based on color theory
 * @param {Object} baseColor - Base color object with r, g, b properties
 * @returns {Object} Object containing different color schemes
 */
export const generateMatchingColors = (baseColor) => {
  const hsv = rgbToHsv(baseColor.r, baseColor.g, baseColor.b);
  
  return {
    complementary: generateComplementary(hsv),
    analogous: generateAnalogous(hsv),
    triadic: generateTriadic(hsv),
    neutral: generateNeutral(),
  };
};

/**
 * Generate complementary colors (opposite on color wheel)
 */
const generateComplementary = (hsv) => {
  const colors = [
    hsvToRgb((hsv.h + 180) % 360, hsv.s, hsv.v),
    hsvToRgb((hsv.h + 180) % 360, Math.max(hsv.s - 0.2, 0.2), hsv.v),
    hsvToRgb((hsv.h + 180) % 360, Math.min(hsv.s + 0.2, 1), hsv.v * 0.8),
  ];
  
  return colors.map(addColorInfo);
};

/**
 * Generate analogous colors (adjacent on color wheel)
 */
const generateAnalogous = (hsv) => {
  const colors = [
    hsvToRgb((hsv.h + 30) % 360, hsv.s, hsv.v),
    hsvToRgb((hsv.h - 30 + 360) % 360, hsv.s, hsv.v),
    hsvToRgb((hsv.h + 60) % 360, hsv.s * 0.8, hsv.v),
    hsvToRgb((hsv.h - 60 + 360) % 360, hsv.s * 0.8, hsv.v),
  ];
  
  return colors.map(addColorInfo);
};

/**
 * Generate triadic colors (evenly spaced on color wheel)
 */
const generateTriadic = (hsv) => {
  const colors = [
    hsvToRgb((hsv.h + 120) % 360, hsv.s, hsv.v),
    hsvToRgb((hsv.h + 240) % 360, hsv.s, hsv.v),
    hsvToRgb((hsv.h + 120) % 360, hsv.s * 0.7, hsv.v * 0.9),
  ];
  
  return colors.map(addColorInfo);
};

/**
 * Generate neutral color palette
 */
const generateNeutral = () => {
  const colors = [
    { r: 255, g: 255, b: 255 }, // White
    { r: 240, g: 240, b: 240 }, // Light gray
    { r: 160, g: 160, b: 160 }, // Medium gray
    { r: 80, g: 80, b: 80 },    // Dark gray
    { r: 30, g: 30, b: 30 },    // Charcoal
    { r: 0, g: 0, b: 0 },       // Black
  ];
  
  return colors.map(addColorInfo);
};

/**
 * Add hex and name information to color object
 */
const addColorInfo = (color) => {
  const hex = rgbToHex(color.r, color.g, color.b);
  const name = getColorName(color);
  
  return {
    ...color,
    hex,
    name,
  };
};

/**
 * Convert RGB to Hex
 */
const rgbToHex = (r, g, b) => {
  return '#' + [r, g, b].map(x => {
    const hex = Math.round(x).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
};

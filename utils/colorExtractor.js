// Color Extractor Utility
// Extracts dominant colors from an image

/**
 * Extract dominant colors from an image URI
 * @param {string} imageUri - URI of the image
 * @returns {Promise<Array>} Array of color objects with r, g, b, and hex values
 */
export const extractDominantColors = async (imageUri) => {
  try {
    // For React Native, we'll use a simplified approach
    // In a production app, you might want to use a native module
    // or a more sophisticated color extraction library
    
    // For now, we'll return some default colors based on common clothing colors
    // In a real implementation, you would process the image pixels
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Generate sample colors (in production, extract from actual image)
    const sampleColors = generateSampleColors();
    
    return sampleColors;
  } catch (error) {
    console.error('Error extracting colors:', error);
    throw error;
  }
};

/**
 * Generate sample colors (placeholder for actual color extraction)
 * In production, this should analyze actual image pixels
 */
const generateSampleColors = () => {
  // Common clothing colors as examples
  const commonColors = [
    { r: 74, g: 144, b: 226 },    // Blue
    { r: 46, g: 125, b: 50 },     // Green
    { r: 211, g: 47, b: 47 },     // Red
    { r: 251, g: 192, b: 45 },    // Yellow
    { r: 123, g: 31, b: 162 },    // Purple
    { r: 255, g: 255, b: 255 },   // White
    { r: 33, g: 33, b: 33 },      // Black
    { r: 158, g: 158, b: 158 },   // Gray
  ];
  
  // Randomly select 3-5 colors
  const numColors = Math.floor(Math.random() * 3) + 3;
  const shuffled = commonColors.sort(() => 0.5 - Math.random());
  const selectedColors = shuffled.slice(0, numColors);
  
  return selectedColors.map(color => ({
    ...color,
    hex: rgbToHex(color.r, color.g, color.b),
  }));
};

/**
 * Convert RGB to Hex color code
 */
const rgbToHex = (r, g, b) => {
  return '#' + [r, g, b].map(x => {
    const hex = Math.round(x).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
};

/**
 * Calculate color distance (for filtering similar colors)
 */
export const colorDistance = (c1, c2) => {
  return Math.sqrt(
    Math.pow(c1.r - c2.r, 2) +
    Math.pow(c1.g - c2.g, 2) +
    Math.pow(c1.b - c2.b, 2)
  );
};

/**
 * Filter out similar colors
 */
export const filterSimilarColors = (colors, threshold = 50) => {
  const filtered = [colors[0]];
  
  for (let i = 1; i < colors.length; i++) {
    let isDifferent = true;
    for (let j = 0; j < filtered.length; j++) {
      const distance = colorDistance(colors[i], filtered[j]);
      if (distance < threshold) {
        isDifferent = false;
        break;
      }
    }
    if (isDifferent) {
      filtered.push(colors[i]);
    }
  }
  
  return filtered;
};

// Note: In a production app, you would implement actual pixel analysis
// using one of these approaches:
// 1. Use expo-image-manipulator to resize and get pixel data
// 2. Use a native module for better performance
// 3. Use a library like react-native-image-colors
// 4. Process the image on a backend server
